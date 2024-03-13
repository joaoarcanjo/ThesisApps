import React,{ useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image } from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import { historyStyle, passwordFirstHalf, passwordSecondHalf } from '../styles/styles'
import Navbar from '../../../navigation/actions'
import { savePasswordGenerated } from '../../../database/passwords'
import Algorithm from './algorithm'
import { FlashMessage, copyValue } from '../../../components/UserMessages'
import MainBox from '../../../components/MainBox'
import { useSessionInfo } from '../../../firebase/authentication/session'

const minusImage = "../../../assets/images/minus.png"
const plusImage = "../../../assets/images/plus.png"
const crossImage = "../../../assets/images/cross.png"
const checkImage = "../../../assets/images/check.png"

const defaultLength = 12
const saveTimer = 3000

const requirementLabel = "REQUISITOS:"
const lengthLabel = "Tamanho:"
const upperLabel = "Maiúsculas"
const lowerLabel = "Minúsculas"
const specialLabel = "&%/$#\"@?"
const numbersLabel = "Números"

const enum Requirements {
  Upper = 'upper',
  Lower = 'lower',
  Special = 'special',
  Numbers = 'numbers'
}

export default function Generator({ navigation }: {readonly navigation: any}) {

  const [passGenerated, setPassGenerated] = useState("");
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(defaultLength);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(true);
  const { localDBKey } = useSessionInfo();

  const incLength = () => {if(length < 40)setLength(length + 1)}
  const decLength = () => {if(length > 8)setLength(length - 1)}
  const updateUpperCase = () => {if(!verifyPool(Requirements.Upper)) setUppercase(!uppercase)}
  const updateLowerCase = () => {if(!verifyPool(Requirements.Lower)) setLowercase(!lowercase)}
  const updateSpecial = () => {if(!verifyPool(Requirements.Special)) setSpecial(!special)}
  const updateNumbers = () => {if(!verifyPool(Requirements.Numbers)) setNumbers(!numbers)}

  //UseEffects: ---
  useEffect(() => { 
    generatePassword()
   }, [length, uppercase, lowercase, numbers, special])

  useEffect(() => {
    const timer = setTimeout(() => {
      if(passGenerated != password) {
        saveNewPassword()
      }
    }, saveTimer);
    return () => clearTimeout(timer);
  }, [password, passGenerated]);


  //Auxiliar functions: ---
  function verifyPool(currentCase: string): boolean {
    switch(currentCase) {
      case Requirements.Upper: 
        return (uppercase && !lowercase && !numbers && !special)
      case Requirements.Lower: 
        return (!uppercase && lowercase && !numbers && !special)
      case Requirements.Special: 
        return (!lowercase && special && !uppercase && !numbers)
      case Requirements.Numbers: 
        return (!lowercase && !special && numbers && !uppercase)
    }
    return (!lowercase && !uppercase && !numbers && !special) 
  }

  async function saveNewPassword() {
    if(passGenerated != password) {
      // You can use the 'result' object to get information about the password strength
      setPassword(passGenerated)
      savePasswordGenerated(passGenerated, localDBKey)
    }
  }

  function generatePassword() {
    const password = Algorithm({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    setPassGenerated(password)
  }

  /* Quando se clica em guardar, vai copiar a mesma, e guardar em histórico a nova password
     Basicamente vai fazer o que faria ao fim de timestamp, mas de forma instântanea.
  */
  function saveOnClickBoard() {
    saveNewPassword()
    copyValue(password, FlashMessage.passwordCopied)
  }

  //Components: ---

  function HistoryButton() {

    const HistoryPressed = () => {
      saveNewPassword()
      navigation.push('PasswordHistory')
    }

    return (
      <View style= { { flex: 0.06, width: '100%', marginTop: '2%', alignItems: 'flex-end' } }>
            <TouchableOpacity style={[{flex: 1,  width: '45%', marginRight: '8%'}, historyStyle.historyButton, stylesButtons.mainConfig]} onPress={() => HistoryPressed()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Histórico</Text>
            </TouchableOpacity>
      </View>
    )
  }
  
  function PasswordFirstBox() {
    
    return (
      <View style= { { flex: 0.24, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginTop: '2%', marginHorizontal: '8%', justifyContent: 'center',  alignItems: 'center'}, passwordFirstHalf.container]}>
              
              {/* View onde vai aparecer a password que será gerada */}
              <View style={[{flex: 1,  width: '90%', marginTop: '5%',marginBottom: '1%', marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center'}, passwordFirstHalf.passwordGenerated]}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 22 }]}>{passGenerated}</Text>
              </View>
              
              {/* Botões para copiar a password e para gerar uma nova */}
              <View style={{flexDirection: 'row', margin: '3%', marginBottom: '5%'}}>
                <TouchableOpacity style={[{flex: 0.5, marginRight: '2%'}, passwordFirstHalf.copyButton, stylesButtons.mainConfig]} onPress={() => saveOnClickBoard() }>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{flex: 0.5, marginLeft: '2%'}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => generatePassword() }>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    )
  }
  
  function RequirementLength() {
    return (
      <View style={[{flex: 0.20, flexDirection: 'row', width: '90%', justifyContent: 'center',  alignItems: 'center' }, passwordSecondHalf.lengthContainer]}>
        <View style={[{flex: 0.40, width: '100%', justifyContent: 'center',  alignItems: 'center', marginLeft: '5%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.lengthText]}>{lengthLabel}</Text>
        </View>
        <View style={[{flex: 0.60, flexDirection: 'row', margin: '5%', justifyContent: 'center',  alignItems: 'center'}]}>
        <TouchableOpacity style={[{flex: 0.30}]} onPress={() => decLength()}>
          <Image source={require(minusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <View style={[{flex: 0.40, marginHorizontal: '5%', alignItems: 'center'}, passwordSecondHalf.lengthDisplay]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%'}, passwordSecondHalf.numberSelectedText]}>{length}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.30}]} onPress={() => incLength()}>
          <Image source={require(plusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
  
  function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
    return (
      <TouchableOpacity style={[{flex: 0.50, height: '90%', marginHorizontal: '3%', justifyContent: 'center',  alignItems: 'center' }, passwordSecondHalf.lengthContainer, stylesButtons.mainConfig]} onPress={() => func()}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.requirementsText]}>{name}</Text>
        <View style={{flex: 0.65, width: '100%', marginTop: '5%'}}>
          {value ? 
          <Image source={require(checkImage)} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>:
          <Image source={require(crossImage)} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>}
        </View>
      </TouchableOpacity>
    )
  }

  function PasswordSecondBox() {
    return (
      <View style= { { flex: 0.55, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginHorizontal: '4%', justifyContent: 'center',  alignItems: 'center'}, passwordSecondHalf.container]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '2%', width: '90%', justifyContent: 'center'}, passwordSecondHalf.requirementsText]}>{requirementLabel}</Text>
              <RequirementLength/>
              <View style={{flex: 0.70, marginHorizontal: '5%', marginVertical: '5%'}}>
                <View style={[{flex: 0.50, width: '90%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name={upperLabel} value={uppercase} func={updateUpperCase}/>
                  <Requirement name={lowerLabel} value={lowercase} func={updateLowerCase}/>
                </View>
                <View style={[{flex: 0.50, width: '90%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name={numbersLabel} value={numbers} func={updateNumbers}/>
                  <Requirement name={specialLabel} value={special} func={updateSpecial}/>
                </View>
              </View>
          </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text='Gerador'/>
      <HistoryButton/>
      <PasswordFirstBox/>
      <PasswordSecondBox/>
      <Navbar/>
    </View>
  )
}