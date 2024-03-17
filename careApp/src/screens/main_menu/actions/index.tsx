import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { stylesOptions, stylesFirstHalf } from '../styles/sytles'
import { stylesButtons } from '../../../assets/styles/main_style'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain'
import { caregiverName, caregiverPhone } from '../../../keychain/constants'

const credentialsImage = '../images/credenciais.png'
const generatorImage = '../images/gerador.png'
const settingsImage = '../images/definições.png'
const questionsImage = '../images/perguntas.png'
const elderlyImage = '../images/elderly.png'


function CaregiverInfoBox() {

    const { userName } = useSessionInfo()

    return (
        <View style={[{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%', marginTop: '2%' }, stylesFirstHalf.caregiverContainer]}>
            <View style={{flex: 0.55}}>
                <View style={{flex: 0.50, justifyContent: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 25, fontWeight: 'bold', marginLeft: '10%'}}>Olá,</Text>
                </View>
                <View style={{flex: 0.50, marginLeft: '10%'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit  style={{fontSize: 35, fontWeight: 'bold'}}>{userName}</Text>
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

    const ElderlyNavigation = () => {
        navigation.push('ElderlyList')
    }

    const CredencialsNavigation = async () => {
        // Your code to handle the click event
        navigation.push('Credentials')
    }

    const GeneratorsNavigation = () => {
        // Your code to handle the click event
        navigation.push('Generator')
    }

    const FrequentQuestionsNavigation = () => {
        // Your code to handle the click event
        navigation.push('FrequentQuestions')
    }

    const SettingsNavigation = () => {
        // Your code to handle the click event
        navigation.push('Settings')
    }

    return (
        <View style={{flex: 0.80, marginBottom: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={[{flex: 0.25, marginVertical: '2%', width: '90%'}]} >
                <TouchableOpacity style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, stylesFirstHalf.caregiversButton, stylesButtons.mainConfig]} onPress={ElderlyNavigation}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesFirstHalf.caregiversButtonText]}>Idosos</Text>
                </TouchableOpacity>
            </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareCredentials, stylesButtons.mainConfig]} onPress={() => CredencialsNavigation()}>
                    <Image source={require(credentialsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Credenciais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareGenerator, stylesButtons.mainConfig]} onPress={() => GeneratorsNavigation()}>
                    <Image source={require(generatorImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '0%'}, stylesOptions.squareText]}>Gerar nova</Text>
                </TouchableOpacity>
           </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareSettings, stylesButtons.mainConfig]} onPress={() => SettingsNavigation()}>
                    <Image source={require(settingsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Definições</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareQuestions, stylesButtons.mainConfig]} onPress={() => FrequentQuestionsNavigation()}>
                    <Image source={require(questionsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Perguntas</Text>
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

    const { userId, setUserName, setUserPhone, userPhone, userName } = useSessionInfo()
    //const { expoPushToken } = usePushNotifications()

    const savePhoneAndName = async () => {
        
        if(userPhone == '' || userName == '') {
            const userNameAux = await getKeychainValueFor(caregiverName(userId))
            const userPhoneAux = await getKeychainValueFor(caregiverPhone(userId))

            if(userNameAux != '') setUserName(userNameAux)
            if(userPhoneAux != '') setUserPhone(userPhoneAux)
             
        } else {
          await saveKeychainValue(caregiverName(userId), userName)
          await saveKeychainValue(caregiverPhone(userId), userPhone)
        }
    }

    savePhoneAndName()

    return (
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '5%'}}>
            <CaregiverInfoBox/>
            <Functionalities/>
        </View>
    );
}