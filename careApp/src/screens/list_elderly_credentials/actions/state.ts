import { BehaviorSubject } from "rxjs";
import { deriveSecret } from "../../../algorithms/sss/sss";
import { getKey, listAllCredentialsFromFirestore } from "../../../firebase/firestore/functionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlySSSKey } from "../../../keychain/constants";
import { Credential } from "./index";
import { getElderlyId } from "../../../database/elderlyFunctions";

export const credentialsListUpdated = new BehaviorSubject<Credential[]>([])

export const setCredentialsListUpdated = async (userId: string, elderlyEmail: string) => {
    console.log("===> setCredentialsListUpdatedCalled")
    const elderlyId = await getElderlyId(elderlyEmail, userId)
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey])
    
    listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: Credential[] = [];
      credencials.forEach(value => {
        if(value.data.length != 0) {
          auxCredencials.push({id: value.id, data: JSON.parse(value.data)})
        }
      })
      credentialsListUpdated.next(auxCredencials)
    })
}