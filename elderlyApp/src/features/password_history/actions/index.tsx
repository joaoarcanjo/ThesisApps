import React,{ useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import { styleScroolView } from '../styles/styles'
import formatTimestamp from '../../../algorithms/0thers/time';
import Navbar from '../../../navigation/actions';
import { realizarConsulta } from '../../../database'
import { Password } from '../../../database/types'
import { FlashMessage, copyValue } from '../../../components/ShowFlashMessage'
import MainBox from '../../../components/MainBox';

export default function PasswordHistory() {
  
  function PasswordGeneratedItem({thisPassword, time}: Readonly<{thisPassword: string, time: number}>) {
    return (
      <View style={[{flex: 0.15, margin: '3%', flexDirection: 'row'}, styleScroolView.item]}>
        <View style={[{flex: 0.7, margin: '2%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontSize: 30, margin: '3%', fontWeight: 'bold' }, styleScroolView.itemPassword]}>{thisPassword}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%', textAlign: 'right' }, styleScroolView.itemDate]}>{formatTimestamp(time)}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.3, margin: '2%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(thisPassword, FlashMessage.passwordCopied) }>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function PasswordsList() {

    const [passwords, setPasswords] = useState<Password[]>([]);

    useEffect(() => {
      realizarConsulta().then(value => setPasswords(value))
    }, [])
    
    return (
      <View style={{ flex: 0.85, marginTop: '5%', flexDirection: 'row'}}>
        <View style={[{ flex: 1, marginHorizontal: '3%'}, styleScroolView.container]}>
          <ScrollView style={[{margin: '2%'}]}>
            {passwords.map((password) => <PasswordGeneratedItem key={password.id} thisPassword={password.password} time={password.timestamp}></PasswordGeneratedItem>)}
          </ScrollView>
        </View>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={'History'}/>
      <PasswordsList/>   
      <Navbar/>
    </View>
  )
}