import {View, Text, Image, TouchableOpacity} from 'react-native'
import { stylesOptions, stylesFirstHalf } from '../styles/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack';
import { stylesButtons } from '../../../assets/styles/main_style';
import { useSessionInfo } from '../../../firebase/authentication/session';
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain';
import { elderlyName, elderlyPhone } from '../../../keychain/constants';
import { createIdentity } from '../../../e2e/identity/functions';
import { getAllCredentialsAndValidate } from '../../list_credentials/actions/functions';
import { credentialTimoutRefresh, credentialsLabel, cuidadoresLabel, emptyValue, generatorLabel, heyLabel, pageCaregivers, pageCredentials, pageQuestions, pageGenerator, pageSettings, questionsLabel, settingsLabel } from '../../../assets/constants/constants';
import { flashTimeoutPromise } from '../../splash_screen/actions/functions';
import SplashScreen from '../../splash_screen/actions';
import * as SplashFunctions from 'expo-splash-screen';

const credentialsImage = '../../../assets/images/credenciais.png'
const generatorImage = '../../../assets/images/gerador.png'
const settingsImage = '../../../assets/images/definições.png'
const questionsImage = '../../../assets/images/perguntas.png'
const elderlyImage = '../../../assets/images/elderly.png'


function ElderlyInfoBox() {

    const { userName } = useSessionInfo()

    return (
        <View style={[{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%', marginTop: '2%' }, stylesFirstHalf.elderContainer]}>
            <View style={{flex: 0.55}}>
                <View style={{flex: 0.50, justifyContent: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 25, fontWeight: 'bold', marginLeft: '10%'}}>{heyLabel}</Text>
                </View>
                <View style={{flex: 0.50, marginLeft: '10%'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 35, fontWeight: 'bold'}}>{userName}</Text>
                </View>
            </View>
            <View style={{flex: 0.45, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require(elderlyImage)} style={{ width: '80%', height: '80%', resizeMode: 'contain'}}/>
            </View>
        </View>
    )
}

function Functionalities() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const CaregiversNavigation = () => {
        navigation.push(pageCaregivers)
    }

    const CredencialsNavigation = async () => {
        navigation.push(pageCredentials)
    }

    const GeneratorsNavigation = () => {
        navigation.push(pageGenerator)
    }

    const FrequentQuestionsNavigation = () => {
        navigation.push(pageQuestions)
    }

    const SettingsNavigation = () => {
        navigation.push(pageSettings)
    }

    return (
        <View style={{flex: 0.80, marginBottom: '10%', justifyContent: 'center', alignItems: 'center'}}>
             <View style={[{flex: 0.25, marginVertical: '2%', width: '90%'}]} >
                <TouchableOpacity style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, stylesFirstHalf.caregiversButton, stylesButtons.mainConfig]} onPress={() => {CaregiversNavigation()}}>
                    <Text style={[stylesFirstHalf.caregiversButtonText]}>{cuidadoresLabel}</Text>
                </TouchableOpacity>
            </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareCredentials, stylesButtons.mainConfig]} onPress={() => CredencialsNavigation()}>
                    <Image source={require(credentialsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{credentialsLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareGenerator, stylesButtons.mainConfig]} onPress={() => GeneratorsNavigation()}>
                    <Image source={require(generatorImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{generatorLabel}</Text>
                </TouchableOpacity>
           </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareSettings, stylesButtons.mainConfig]} onPress={() => SettingsNavigation()}>
                    <Image source={require(settingsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{settingsLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareQuestions, stylesButtons.mainConfig]} onPress={() => FrequentQuestionsNavigation()}>
                    <Image source={require(questionsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{questionsLabel}</Text>
                </TouchableOpacity>
           </View>
        </View>
    );
}

/**
 * Quando o componente do menu principal é renderizado, é atualizado os dados do user.
 * @returns 
 */
export default function MainMenu() {

    const { userId, setUserName, setUserPhone, userPhone, userName, userEmail, localDBKey } = useSessionInfo()
    const [appIsReady, setAppIsReady] = useState(true)
    //const { expoPushToken } = usePushNotifications()
    
    useEffect(() => {
        if(userId == emptyValue || localDBKey == emptyValue) return
        
        const interval = setInterval(async () => {
            await getAllCredentialsAndValidate(userId, localDBKey)
        }, credentialTimoutRefresh)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        savePhoneAndName()
        identityCreation()

        flashTimeoutPromise(userId, setAppIsReady)
        .then(() => setAppIsReady(true))
    }, [])
    
    const savePhoneAndName = async () => {
        if(userPhone == emptyValue && userName == emptyValue && userId != emptyValue) {
            const userNameAux = await getKeychainValueFor(elderlyName(userId))
            const userPhoneAux = await getKeychainValueFor(elderlyPhone(userId))

            if(userNameAux != emptyValue && userPhoneAux != emptyValue) {
                setUserName(userNameAux)
                setUserPhone(userPhoneAux)
            }
        } else if (userId != emptyValue) {
            await saveKeychainValue(elderlyName(userId), userName)
            await saveKeychainValue(elderlyPhone(userId), userPhone)
        }
    }
    
    const identityCreation = async () => {
        await createIdentity(userId, userEmail)
    }

    savePhoneAndName()

    const onLayoutRootView = useCallback(async () => { if (!appIsReady) await SplashFunctions.hideAsync() }, [appIsReady])

    if (!appIsReady) return <SplashScreen layout={onLayoutRootView} />
    return (
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '5%'}}>
            <ElderlyInfoBox/>
            <Functionalities/>
        </View>
    );
}