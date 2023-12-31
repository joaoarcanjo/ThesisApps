import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiver1SSSKey, elderlyEmail, elderlyId, elderlySSSKey, firestoreSSSKey, localDBKey, caregiver2SSSKey } from './constants';
import * as Crypto from 'expo-crypto';
/**
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
async function save(key: string, value: string) {
  do {
    setItemAsync(key, value)
  } while(value != '' && await getValueFor(key) == '')
}

/**
 * Função para obter o valor correspondente a determinada chave.
 * 
 * @param key 
 */
async function getValueFor(key: string): Promise<string> {
  return getItemAsync(key).then((result) => result ?? '')
}

/**
 * Função para apagar todos os valores armazenados na keychain do dispositivo.
 * Apenas utilizado para debug, para limpar tudo.
 */
async function cleanKeychain(id: string) {

  await deleteItemAsync(firestoreSSSKey(id))
  .then(() => deleteItemAsync(elderlySSSKey(id)))
  .then(() => deleteItemAsync(caregiver1SSSKey(id)))
  .then(() => deleteItemAsync(caregiver2SSSKey(id)))
  .then(() => deleteItemAsync(elderlyId))
}

/**
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
async function initKeychain(userId: string, userEmail: string): Promise<boolean> {

  if(await getValueFor(elderlyId) == '') {
    await cleanKeychain(userId).then(() => {
      save(elderlyId, userId)
      save(elderlyEmail, userEmail)
    })
  }
  if(await getValueFor(localDBKey(userId)) == '') {
    save(localDBKey(userId), String.fromCharCode.apply(null, Array.from(Crypto.getRandomBytes(32)))) 
  }
  return true
}

export { getValueFor, cleanKeychain, initKeychain, save };