import { sessionEstablishedFlash, sessionRejectedFlash } from "../../../components/ShowFlashMessage"
import { acceptElderlyOnDatabase, deleteElderly } from "../../../database"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, CaregiverDataBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, removeSession, sessionForRemoteUser } from "../../../e2e/session/state"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { elderlyListUpdated, setElderlyListUpdated } from "./state"

//
// ESTAS FUNÇÕES SÃO UTILIZADAS TENDO EM CONTA A DECISÃO DO CUIDADOR QUANDO RECEBE A NOTIFICAÇÃO.
//

export async function startSessionWithElderly(elderlyEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    try {
        await startSession(elderlyEmail)
        const session = sessionForRemoteUser(elderlyEmail)
        currentSessionSubject.next(session ?? null)

        const data: CaregiverDataBody = {
            userId: userId,
            name: userName,
            email: userEmail,
            phone: userPhone,
            photo: ""
        }

        await encryptAndSendMessage(elderlyEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA) 

    } catch (error) {
        return Promise.reject(new ErrorInstance(Errors.ERROR_STARTING_SESSION))
        //FAZER UM ALERT PARA ISTO?
    }
}

/**
 * Quando o cuidador aceita um idoso, é enviada uma mensagem para o idoso a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptElderly(userId: string, elderlyEmail: string, userName: string, userEmail: string, userPhone: string) {

    const session = sessionForRemoteUser(elderlyEmail)
    currentSessionSubject.next(session || null)

    const data: CaregiverDataBody = {
        userId: userId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        photo: ""
    }
    //await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
    await encryptAndSendMessage(elderlyEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA)
    await acceptElderlyOnDatabase(elderlyEmail)
    sessionEstablishedFlash(true)
}

/**
 * Quando o cuidador rejeita a relação, é enviada uma mensagem para o idoso a dizer que rejeitou a conexão.
 * O cuidador vai remover a sessão (webSocket) que possui com o idoso.
 * @param to 
 */
export async function refuseElderly(userId: string, to: string) {
    await deleteElderly(userId, to)
    await encryptAndSendMessage(to, 'rejectSession', true, ChatMessageType.REJECT_SESSION)
    setElderlyListUpdated()
    removeSession(to)
    sessionRejectedFlash(true)
}

/**
 * Todas as ações que têm que ser realizadas quando se realiza a desvinculação do idoso.
 * @param email 
 */
export async function decouplingElderly(userId: string, email: string) {
    //TODO: Enviar notificação a informar do desligamento.
    await deleteElderly(userId, email)
    await sendElderlyDecoupling(email)
}

async function sendElderlyDecoupling(elderlyEmail: string) {
    //TODO: Enviar notificação a informar do desligamento se ele estiver offline.
    if(!sessionForRemoteUser(elderlyEmail)) {
        await startSession(elderlyEmail)
        const session = sessionForRemoteUser(elderlyEmail)
        currentSessionSubject.next(session ?? null)
    }
    await encryptAndSendMessage(elderlyEmail, '', false, ChatMessageType.DECOUPLING_SESSION) 
}