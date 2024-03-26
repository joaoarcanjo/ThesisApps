import { getTimeoutFromLocalDB, insertTimeoutToLocalDB } from "../../database/ssstimer"
import { changeFirestoreKey, listAllElderlyCredencials, updateCredentialFromFiretore } from "../../firebase/firestore/functionalities"
import { getKeychainValueFor, saveKeychainValue } from "../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey, firestoreSSSKey, elderlyFireKey } from "../../keychain/constants"
import { decrypt, generateKey } from "../0thers/crypto"
import { sendShares } from "./sendNewShares"
import { generateShares } from "./sss"

/**
 * Changes the shared secret for a user.
 * Vai gerar os novos shares, vai enviar para todos os cuidadores (2 max) o seu novo share, e vai atualizar o share na cloud.
 * @param userId - The user ID.
 * @returns The new shared secret.
 */
export async function changeKey(userId: string): Promise<string> {
    const key = generateKey()
    //console.log("New key: ", key)
    const shares: string[] = generateShares(key, 3, 2)
    //console.log(shares)
   
    const caregiver1Key = shares[2]+''
    const caregiver2Key = shares[1]+''
    const firestoreKey = shares[0]+''
    await saveKeychainValue(caregiver1SSSKey(userId), caregiver1Key)
    await saveKeychainValue(caregiver2SSSKey(userId), caregiver2Key)
    await saveKeychainValue(firestoreSSSKey(userId), firestoreKey)
    await saveKeychainValue(elderlyFireKey(userId), key)  

    await sendShares(userId, caregiver1Key, caregiver2Key)
    await changeFirestoreKey(userId)
    return key
}

export async function executeKeyChangeIfTimeout(userId: string): Promise<string> {
    console.log("===> executeKeyChangeIfTimeoutCalled")
    const timer = await getTimeoutFromLocalDB(userId)
    if(timer == null) {
        await insertTimeoutToLocalDB(userId, new Date().getTime())
        return ''
    }

    const thirtyDaysInMillis = 11//30 * 24 * 60 * 60 * 1000
    const currentDate = new Date().getTime()
    
    if (currentDate - timer > thirtyDaysInMillis) {
        return await executeKeyExchange(userId)
    }
    return ''
}

export async function executeKeyExchange(userId: string): Promise<string> {
    console.log("===> executeKeyExchangeCalled")
    const oldkey = await getKeychainValueFor(elderlyFireKey(userId))
    const credentialsCloud = await listAllElderlyCredencials(userId)
    const newKey = await changeKey(userId)
    
    console.log("Old key: ", oldkey)
    credentialsCloud.forEach(async (credential) => {
        if(credential === undefined) return
        let credentialCloud = JSON.parse(decrypt(credential.data, oldkey)) 
        if (credentialCloud != undefined) {
            await updateCredentialFromFiretore(
                userId,
                credential.id,
                newKey,
                JSON.stringify(credentialCloud)
            )
        }
    })
    return newKey
}