import { BehaviorSubject } from "rxjs";
import { getKey, listAllCredentialsFromFirestore } from "../../../firebase/firestore/functionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlySSSKey } from "../../../keychain/constants";
import { getElderlyId } from "../../../database/elderly";
import { CredentialType } from "../../list_credentials/actions/types";
import { deriveSecret } from "../../../algorithms/shamirSecretSharing/sss";

export const credentialsListUpdated = new BehaviorSubject<CredentialType[]>([])

export const setCredentialsListUpdated = async (userId: string, elderlyEmail: string) => {
    console.log("===> setCredentialsListUpdatedCalled")
    const elderlyId = await getElderlyId(elderlyEmail, userId)
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey])
    listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: CredentialType[] = [];
      credencials.forEach(value => {
        if(value.data) {
          auxCredencials.push({id: value.id, data: value.data})
        }
      })
      credentialsListUpdated.next(auxCredencials)
    })
}