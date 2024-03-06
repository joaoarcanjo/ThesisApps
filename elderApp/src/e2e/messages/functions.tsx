import { MessageType, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { currentSessionSubject, sessionForRemoteUser, sessionListSubject } from "../session/state"
import { SendAcknowledgeMessage, SendWebSocketMessage } from "../network/types"
import { signalStore, usernameSubject } from "../identity/state"
import { stringToArrayBuffer } from "../signal/signal-store"
import { signalWebsocket } from "../network/webSockets"
import { ChatSession } from "../session/types"
import { ChatMessageType, CaregiverDataBody, ProcessedChatMessage } from "./types"
import { randomUUID } from 'expo-crypto'
import { checkCaregiverByEmail, deleteCaregiver, saveCaregiver, updateCaregiver } from "../../database"
import { findCaregiverRequest, removeCaregiverRequested, setCaregiverListUpdated } from "../../screens/list_caregivers/actions/state"
import { FlashMessage, editCompletedFlash, sessionAcceptedFlash, sessionEndedFlash, sessionRejectedFlash } from "../../components/UserMessages"
import { getValueFor } from "../../keychain"
import { elderlyId } from "../../keychain/constants"
import { addCaregiverToArray } from "../../firebase/firestore/functionalities"
import { startSession } from "../session/functions"

/**
 * Função para processar uma mensagem recebida de tipo 3
 * @param address Representa o identificador de quem enviou a mensagem.
 * @param message Conteúdo da mensagem enviada.
 */
export async function processPreKeyMessage(address: string, message: MessageType, type: number): Promise<void> {
    console.log('-> processPreKeyMessage')
    const cipher = new SessionCipher(signalStore, new SignalProtocolAddress(address, 1))
    const plaintextBytes = await cipher.decryptPreKeyWhisperMessage(message.body!, 'binary')
    let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))

    const session : ChatSession= sessionForRemoteUser(address) || {
        remoteUsername: address,
        messages: [],
    }

    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(session)
    sessionListSubject.next(sessionList)
    
    let cm: ProcessedChatMessage | null = null
    try{
        plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, '')
        cm = JSON.parse(plaintext) as ProcessedChatMessage
        addMessageToSession(address, cm, type, true)
        encryptAndSendMessage(address, 'firstMessage', true, ChatMessageType.START_SESSION)
    } catch (e) {
        //console.log(e)
    }
}

/**
 * Função para informar o remetente que a regularMessage foi recebida com sucesso.
 * @param address 
 * @param messageId Representa o id da mensagem que queremos informar ao remetente que foi recebida com sucesso. 
 * O remetente a receber um acknowledge de uma mensagem, não precisa da retransmitir.  
 */
function sendAcknowledgement(address: string, id: string) {
    const wsm: SendAcknowledgeMessage = {
        action: 'acknowledge',
        address: address,
        from: usernameSubject.value,
        messageId: id
    }
    signalWebsocket.next(wsm)
}

/**
 * Função para processar uma mensagem recebida de tipo 1
 * @param address Representa o identificador de quem enviou a mensagem.
 * @param message Conteúdo da mensagem enviada.
 */
export async function processRegularMessage(address: string, message: string, type: number): Promise<void> {
    console.log('-> processRegularMessage')
    
    const protocolAddress = new SignalProtocolAddress(address, 1)
    const cipher = new SessionCipher(signalStore, protocolAddress)
    
    const plaintextBytes = await cipher.decryptWhisperMessage(message, 'binary')
    
    let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))
    plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, '');
    const cm: ProcessedChatMessage = JSON.parse(plaintext)
    addMessageToSession(address, cm, type)
    sendAcknowledgement(address, cm.id)
}

/**
 * Para encriptar e enviar uma mensagem para determinado destinatário.
 * @param to 
 * @param message 
 */
export async function encryptAndSendMessage(to: string, message: string, firstMessage: boolean, type: ChatMessageType): Promise<void> {
    
    const address = new SignalProtocolAddress(to, 1)
    const cipher = new SessionCipher(signalStore, address)

    const cm: ProcessedChatMessage = {
        id: randomUUID(),
        address: to,
        from: usernameSubject.value,
        timestamp: Date.now(),
        firstMessage: firstMessage,
        body: message,
        type: type,
    }

    addMessageToSession(to, cm, 1, true)  
    const signalMessage = await cipher.encrypt(stringToArrayBuffer(JSON.stringify(cm)))
    sendSignalProtocolMessage(to, usernameSubject.value, signalMessage)
}

/**
 * @param to Username do destinatário
 * @param from Username de quem está a enviar
 * @param message Este campo é um objeto retornado pelo método "sessionCipher.encrypt"
 */
export function sendSignalProtocolMessage(to: string, from: string, message: MessageType): void {
    const wsm: SendWebSocketMessage = {
        action: 'sendMessage',
        address: to,
        from,
        message: JSON.stringify(message),
    }
    signalWebsocket.next(wsm)
}

export async function addMessageToSession(address: string, cm: ProcessedChatMessage, type: number, itsMine?: boolean): Promise<void> {
    console.log('-> addMessageToSession')
    const userSession = { ...sessionForRemoteUser(address)! }

    console.log("AHAHAHHA")
    //Se for uma mensagem de dados do cuidador e não for uma mensagem nossa (tipo 0)
    if(cm.type === ChatMessageType.PERSONAL_DATA && !itsMine) {
        await processPersonalData(cm)
        //userSession.messages.push(cm)  
    } else if (cm.type === ChatMessageType.REJECT_SESSION) {
        //userSession.messages.push(cm)  
        await processRejectMessage(cm)
    } else if (cm.type === ChatMessageType.DECOUPLING_SESSION) {
        await deleteCaregiver(cm.from)
        setCaregiverListUpdated()
        sessionEndedFlash(cm.from)
        
    } else if(type !== 3 && !cm.firstMessage) {
        userSession.messages.push(cm)
    }
    
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername !== address)
    //console.log('Filtered session list', { sessionList })
    sessionList.unshift(userSession)
    sessionListSubject.next(sessionList)
    if (currentSessionSubject.value?.remoteUsername === address) {
        currentSessionSubject.next(userSession)
    }
}

async function processPersonalData(cm: ProcessedChatMessage) {
    const data = JSON.parse(cm.body) as CaregiverDataBody

    const id = await getValueFor(elderlyId)

    if (await checkCaregiverByEmail(cm.from)) {  
        await updateCaregiver(data.email, data.name, data.phone)
        setCaregiverListUpdated()
        editCompletedFlash(FlashMessage.caregiverPersonalInfoUpdated)
    } else if(findCaregiverRequest(cm.from)) {
        await saveCaregiver(data.userId, data.name, data.email, data.phone)
        .then(() => addCaregiverToArray(id, data.userId, "readCaregivers"))
        .then(() => sessionAcceptedFlash(cm.from))
        .then(() => removeCaregiverRequested(cm.from))
        .then(() => setCaregiverListUpdated())
    }
}

async function processRejectMessage(cm: ProcessedChatMessage) {
    sessionRejectedFlash(cm.from)
}