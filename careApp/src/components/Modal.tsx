import { BlurView } from "expo-blur";
import React, { ReactNode, useState } from "react";
import {View, StyleSheet, Modal, TouchableOpacity, Text, ScrollView} from 'react-native'
import { stylesButtons } from "../assets/styles/main_style"
import { modal, options } from "../screens/credential_interface/styles/styles"
import { Spinner } from "./LoadingComponents"
import { upperLabel, lowerLabel, numbersLabel, specialLabel, copyUsernameLabel, copyPasswordLabel, navigateLabel, copyCardNumberLabel, copySecurityCodeLabel, copyVerificationCodeLabel, cancelLabel, otherLabel } from "../assets/constants";
import { RequirementLength, Requirement } from "./passwordGenerator/Requirement";
import { updateUpperCase, updateLowerCase, updateNumbers, updateSpecial } from "./passwordGenerator/functions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function YesOrNoModal({question, yesFunction, noFunction, visibleFlag}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => yesFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => noFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Não</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

function YesOrNoSpinnerModal({question, yesFunction, noFunction, visibleFlag, loading}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  return (
    <ModalBox visibleFlag={visibleFlag}>
      {loading ?
        <Spinner width={300} height={300} />
        :  
        <>
          <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => yesFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => noFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Não</Text>
            </TouchableOpacity>
          </View>
        </>
    }
    </ModalBox>
  )
}

export function PasswordOptionsModal({saveFunction, closeFunction, visibleFlag}: Readonly<{saveFunction: Function, closeFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [special, setSpecial] = useState(true)
  const [length, setLength] = useState(15)

  const saveRequirements = () => {
    saveFunction({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    closeFunction()
  }
  
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View>
        <RequirementLength setLength={setLength} currentLength={length}/>
        <View style={{flexDirection: 'row', marginTop: '5%'}}>
          <Requirement name={upperLabel} value={uppercase} func={() => {updateUpperCase(setUppercase, uppercase, lowercase, numbers, special)}}/>
          <Requirement name={lowerLabel} value={lowercase} func={() => {updateLowerCase(setLowercase, uppercase, lowercase, numbers, special)}}/>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Requirement name={numbersLabel} value={numbers} func={() => {updateNumbers(setNumbers, uppercase, lowercase, numbers, special)}}/>
          <Requirement name={specialLabel} value={special} func={() => {updateSpecial(setSpecial, uppercase, lowercase, numbers, special)}}/>
        </View>
        <View style={{ borderBottomColor: 'black', borderWidth: StyleSheet.hairlineWidth, marginVertical: '5%' }}/>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.greenButton]} onPress={saveRequirements}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => closeFunction()}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalBox>
  )
}

export function CredentialLoginOptionsModal({copyUsername, copyPassword, navigate, closeFunction, visibleFlag}: Readonly<{copyUsername: Function, copyPassword: Function, navigate: Function, closeFunction: Function, visibleFlag: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => copyUsername()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{copyUsernameLabel}</Text>
        </TouchableOpacity>
      </View> 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => copyPassword()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{copyPasswordLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => navigate()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{navigateLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomColor: 'black', borderWidth: StyleSheet.hairlineWidth, marginVertical: '5%' }}/>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => closeFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

export function CredentialCardOptionsModal({copyCardNumber, copySecurityCode, copyVerificationCode, closeFunction, visibleFlag}: Readonly<{copyCardNumber: Function, copySecurityCode: Function, copyVerificationCode: Function, closeFunction: Function, visibleFlag: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => copyCardNumber()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{copyCardNumberLabel}</Text>
        </TouchableOpacity>
      </View> 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => copySecurityCode()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{copySecurityCodeLabel}</Text>
        </TouchableOpacity>
      </View> 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.blueButton]} onPress={() => copyVerificationCode()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{copyVerificationCodeLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomColor: 'black', borderWidth: StyleSheet.hairlineWidth, marginVertical: '5%' }}/>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => closeFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

export function PlatformSelectionModal({setPlatformName, setPlatformURI, closeFunction, visibleFlag}: Readonly<{setPlatformName: Function, setPlatformURI: Function, closeFunction: Function, visibleFlag: boolean}>) {

  interface Platform { platformName: any, platformURI: any, materialCommunityIcon: any, iconColor: any }

  const jsonData = require('../assets/platforms.json');

  const applySelection = (platform: Platform) => {
    setPlatformName(platform.platformName)
    setPlatformURI(platform.platformURI)
    closeFunction()
  }

  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View style={{flexDirection: 'row', maxHeight: '85%'}}>
        <ScrollView style={{width: '100%'}}>
          {jsonData.platforms.map((platform: Platform, index: string) => 
            <View key={index} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={[{flex: 1, marginVertical: '3%', flexDirection: 'row'}, stylesButtons.mainConfig, stylesButtons.greyButton]} onPress={() => {applySelection(platform)}}>
                <MaterialCommunityIcons name={platform.materialCommunityIcon} size={35} color={platform.iconColor}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }, options.permissionsButtonText]}>{platform.platformName}</Text>
              </TouchableOpacity>
            </View>  
          )}
        </ScrollView>
      </View><View style={{ height: 1, backgroundColor: 'black', marginVertical: '3%' }}/>
      <View style={{flexDirection: 'row', marginBottom: '2%'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.orangeButton]} onPress={() => closeFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{otherLabel}</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

function ModalBox({children, visibleFlag}: Readonly<{children: ReactNode, visibleFlag: boolean}>) {
    return (
        <Modal
      transparent
      animationType="slide"
      visible={visibleFlag}
      >
        <BlurView
          style={{ flex: 1 }}
          intensity={60} // You can adjust the intensity of the blur
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {children}
            </View>
          </View>
        </BlurView>
      </Modal>
    )
}

export { YesOrNoSpinnerModal, YesOrNoModal, ModalBox }

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    maxHeight: '60%', // 90% of the screen height
    margin: '8%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '8%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});