import React, { useState } from "react"
import { View, TextInput, Text, TouchableOpacity } from "react-native"
import { styles, actions } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/LoadingComponents";
import { useSessionInfo } from "../../../firebase/authentication/session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { signUpOperation } from "../../../firebase/authentication/funcionalities";
import { appName, createAccountLabel, emailLabel, emailPlaceholder, emptyValue, mobileLabel, mobilePlaceholder, nameLabel, namePlaceholder, passwordLabel, passwordPlaceholder } from "../../../assets/constants/constants";
import  { NavbarJustBack } from "../../../navigation/actions";

export function SignUp () {

    const [email, setEmail] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [name, setName] = useState(emptyValue)
    const [phoneNumber, setPhoneNumber] = useState(emptyValue)

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(true)

    const toggleShowPassword = () => {setShowPassword(!showPassword)}
    const { setUserEmail, setUserPhone, setUserName } = useSessionInfo()

    const signUp = async () => {
        setLoading(true)
        signUpOperation(email, password).then((loginResult) => {
            if(loginResult) {
                setUserPhone(phoneNumber)
                setUserName(name) 
                setUserEmail(email)
            }
        })
    }
    
    return (        
            <View style={[styles.container]}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 50}}>
                        {appName}
                    </Text>
                </View>
                <View style={{}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '5%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{nameLabel}</Text>
                    <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={namePlaceholder}
                        value={name}
                        autoFocus={true} 
                        autoCapitalize="none"
                        style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                        onChangeText={setName}
                        maxLength={36}
                        />
                    </View> 
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{emailLabel}</Text>
                    <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={emailPlaceholder}
                        value={email}
                        autoFocus={true} 
                        autoCapitalize="none"
                        style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                        onChangeText={setEmail}
                        />
                    </View> 
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{mobileLabel}</Text>
                    <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={mobilePlaceholder}
                        value={phoneNumber}
                        autoFocus={true} 
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                        onChangeText={setPhoneNumber}
                        />
                    </View>
                    { loading ? <Spinner width={250} height={250}/>
                    : 
                    <>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20 }]}>{passwordLabel}</Text>
                        <View style={[{ marginTop: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                                placeholder={passwordPlaceholder}
                                value={password}
                                autoFocus={true}
                                secureTextEntry={showPassword}
                                autoCapitalize='none'
                                style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                                onChangeText={setPassword} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={[{ flex: 0.22, marginHorizontal: '4%', marginTop: '2%' }, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword}>
                                <MaterialCommunityIcons style={{ marginHorizontal: '5%' }} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={{}}>
                            <TouchableOpacity style={[{  marginVertical: '5%', marginHorizontal: '10%' }, stylesButtons.mainConfig, actions.sinUpButton]} onPress={signUp}>
                                <Text style={{ fontSize: 30, marginVertical: '5%' }}>{createAccountLabel}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                </View>
            </View>
    )
}

export default function SignUpPage() {
    return (
        <>
            <KeyboardAvoidingWrapper>
                <SignUp/>
            </KeyboardAvoidingWrapper>
            <NavbarJustBack/>
        </>
    )
}