import { decrypt, encrypt } from '../../algorithms/0thers/crypto';
import { firebase } from '../FirebaseConfig';
import { caregiverCollectionName, caregiversCollectionName, caregiversDocumentName, credencialsCollectionName, defaultCaregiver, defaultCredencials, elderlyCollectionName, keyCollectionName, keyDocumentName, updateDataCredencial } from './constants';

const firestore = firebase.firestore()

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(elderlyId: string): Promise<string> {
    return firebase.firestore().collection(elderlyCollectionName)
        .doc(elderlyId).collection(keyCollectionName).doc(keyDocumentName).get().then((doc: any) => {
            if(doc.exists) {
                return doc.data().key
            } 
        })
        .catch((error: any) => {
            alert('Erro ao tentar obter a chave, tente novamente!')
           console.log('Error: ', error)
            return ''
        })
}

/**
 * Função para adicionar uma nova credencial à coleção pertencente ao respetivo idoso.
 * @param userId 
 * @param newCredencialId 
 * @param data 
 */
async function addCredencial(userId: string, encryptionKey: string, newCredencialId: string, data: string, isElderlyCredentials: boolean) {
    const encrypted = encrypt(data, encryptionKey)
    const credential = defaultCredencials(encrypted)

    const collection = isElderlyCredentials ? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)
    await collection.doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(credential)
        .catch((error: any) => {
            alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
        })
}


interface Credential {
    id: string,
    data: string
}

/**
 * Função para listar as credenciais de determinado utilizador
 * @param userId 
 */
export async function listAllCredentials(userId: string, encryptionKey: string, isElderlyCredentials: boolean): Promise<Credential[]> {

    let collection = isElderlyCredentials? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)

    return collection.doc(userId).collection(credencialsCollectionName).get().then((docs: any) => {
        const values: Credential[] = []
        docs.forEach((doc: any) => { 
            if(doc.data()) {
                const decrypted = decrypt(doc.data().data, encryptionKey)
                values.push({'id': doc.id, 'data': decrypted}) 
            }
        });
        return values
    }).catch((error: any) => {
        alert('Erro ao obter as credenciais, tente novamente!')
        console.log('Error: ', error)
        return []
    });
}

/**
 * Função para apagar uma credencial específica
 * @param credentialId 
 */
async function deleteCredential(userId: string, credentialId: string, isElderlyCredential: boolean): Promise<boolean> {

    const collection = isElderlyCredential ? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)

    return collection.doc(userId)
            .collection(credencialsCollectionName)
            .doc(credentialId)
            .delete()
        .catch((error: any) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

async function updateCredential(userId: string, credencialId: string, encryptionKey: string, data: string, isElderlyCredential: boolean): Promise<boolean> {
    const encrypted = encrypt(data, encryptionKey) 
    
    const collection = isElderlyCredential ? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)
    const updatedCredencial = updateDataCredencial(encrypted)
    return collection.doc(userId)
            .collection(credencialsCollectionName)
            .doc(credencialId)
            .update(updatedCredencial)
        .catch((error: any) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            //console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

export async function getCaregiversArray(elderlyId: string, permission: string) {
    const privateCaregiverDocRef = firebase.firestore()
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(caregiversCollectionName).doc(caregiversDocumentName)

    return privateCaregiverDocRef.get().then((doc: any) => { 
        if(!doc.exists) {
            return []
        }
        const elderlyDoc = doc.data()
        
        if(!elderlyDoc) {
            return
        }

        return elderlyDoc[permission] || []
    })
    .catch((error: any) => {
        alert('Erro ao obter os cuidadores que conseguem ler, tente novamente!')
        console.error('Error: ', error)
        return []
    });
}

export async function verifyIfCanManipulateCredentials(userId: string, elderlyId: string) {
    return await getCaregiversArray(elderlyId, 'writeCaregivers').then(result => {
        return result.includes(userId)
    })
}

async function caregiverExists(caregiverId: string): Promise<boolean> {
    
    return firestore.collection(caregiverCollectionName).doc(caregiverId).get()
    .then((doc) => doc.exists)
    .catch((error) => {
        //alert('Erro ao verificar se o cuidador existe, tente novamente!')
        console.error('Error: ', error)
        return false
    })
}

/**
 * Função para criar a coleção default para o idoso. Esta função apenas vai ser chamada uma vez,
 * respetivamente na criação da conta.
 * @returns 
 */
async function createCaregiver(caregiverId: string) {
    try {
        const caregiverCollectionRef = firebase.firestore().collection(caregiverCollectionName)

        //Cria na coleção o elemento do idoso.
        const novoDocumentoRef = caregiverCollectionRef.doc(caregiverId)
        novoDocumentoRef.set(defaultCaregiver)

    } catch (error) {
        alert('Erro ao tentar criar a conta na firebase!')
        //console.log('Error: ', error)
    }
}

export async function initFirestore(userId: string): Promise<boolean> {
    return caregiverExists(userId).then((result) => {
        if (!result) { //se não existir
            createCaregiver(userId)
            //console.log('Elderly created sucessfully!!')
        }
        return true
    }).catch(error => {
        //console.log('Error initFirestore: ', error)
        return false
    });
}

export { deleteCredential, getKey, addCredencial, updateCredential }