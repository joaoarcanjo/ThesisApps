import { sessionAcceptedFlash, sessionRejectedFlash } from "../../../components/UserMessages"
import { acceptCaregiverOnDatabase, deleteCaregiver } from "../../../database/caregivers"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, ElderlyDataBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, removeSession, sessionForRemoteUser } from "../../../e2e/session/state"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { getKeychainValueFor } from "../../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey } from "../../../keychain/constants"
import { setCaregiverListUpdated } from "./state"

export async function startSessionWithCaregiver(number: number, caregiverEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    try {
        await startSession(caregiverEmail)
        const session = sessionForRemoteUser(caregiverEmail)
        currentSessionSubject.next(session ?? null)
    
        const valueKey = number == 1 ? await getKeychainValueFor(caregiver1SSSKey(userId)) :  await getKeychainValueFor(caregiver2SSSKey(userId))
    
        const data: ElderlyDataBody = {
            userId: userId,
            key: valueKey,
            name: userName,
            email: userEmail,
            phone: userPhone,
            photo: ""
        }
        await encryptAndSendMessage(caregiverEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA) 
    } catch (error) {
        return Promise.reject(new ErrorInstance(Errors.ERROR_STARTING_SESSION))
        //FAZER UM ALERT PARA ISTO?
    }
}
/**
 * Quando o idoso aceita o cuidador, é enviada uma mensagem para o cuidador a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptCaregiver(caregiverId: string, number: number, userId: string, caregiverEmail: string, userName: string, userEmail: string, userPhone: string) {

    const session = sessionForRemoteUser(caregiverEmail)
    currentSessionSubject.next(session || null)

    const valueKey = number == 1 ? await getKeychainValueFor(caregiver1SSSKey(userId)) :  await getKeychainValueFor(caregiver2SSSKey(userId))

    const data: ElderlyDataBody = {
        userId: userId,
        key: valueKey,
        name: userName,
        email: userEmail,
        phone: userPhone,
        photo: ""
    }
    
    //await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
    await encryptAndSendMessage(caregiverEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA)
    await addCaregiverToArray(userId, caregiverId, "readCaregivers")
    await acceptCaregiverOnDatabase(userId, caregiverEmail)
    sessionAcceptedFlash(caregiverEmail, true)
}

/**
 * Quando o cuidador rejeita a relação, é enviada uma mensagem para o idoso a dizer que rejeitou a conexão.
 * O cuidador vai remover a sessão (webSocket) que possui com o idoso.
 * @param to 
 */
export async function refuseCaregiver(userId: string, to: string, elderlyName: string) {
    await deleteCaregiver(userId, to)
    await encryptAndSendMessage(to, 'rejectSession', true, ChatMessageType.REJECT_SESSION)
    setCaregiverListUpdated()
    removeSession(to)
    sessionRejectedFlash(to, true)
}


export async function decouplingCaregiver(caregiverEmail: string, caregiverId: string, userId: string) {
    await deleteCaregiver(userId, caregiverEmail)
    .then(() => removeCaregiverFromArray(userId, caregiverId, 'writeCaregivers')) 
    .then(() => removeCaregiverFromArray(userId, caregiverId, 'readCaregivers'))
    .then(() => sendCaregiversDecoupling(caregiverEmail))

    //TODO: Atualizar na firebase a chave de encriptação.
    //TODO: Enviar para o outro cuidador (caso exista), a sua nova chave.
}

async function sendCaregiversDecoupling(caregiverEmail: string) {
    //TODO: Enviar notificação a informar do desligamento se ele estiver offline.
    if(!sessionForRemoteUser(caregiverEmail)) {
        await startSession(caregiverEmail)
        const session = sessionForRemoteUser(caregiverEmail)
        currentSessionSubject.next(session ?? null)
    }
    await encryptAndSendMessage(caregiverEmail, '', false, ChatMessageType.DECOUPLING_SESSION) 
}