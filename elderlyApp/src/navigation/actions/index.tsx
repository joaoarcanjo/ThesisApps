import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import navigationStyle from '../style/style';

export default function Navbar({ navigation }: {readonly navigation: any}) {

    const goBack = () => navigation.goBack()

    const goToFirstPage = () => navigation.push('Home')

    return (
        <View style={[{flex: 0.12, backgroundColor: 'red', flexDirection: 'row'}, navigationStyle.pageInfoContainer]}>
            <TouchableOpacity style={[{flex: 0.4, marginLeft: '5%', marginRight: '2%', marginTop: '2%', marginBottom: '6%', justifyContent: 'center', alignItems: 'center'}, navigationStyle.backButton]} onPress={() => goBack()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.6, marginLeft: '2%', marginRight: '5%', marginTop: '2%', marginBottom: '6%', justifyContent: 'center', alignItems: 'center'}, navigationStyle.initialButton]} onPress={() => goToFirstPage()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Página Inicial</Text>
            </TouchableOpacity>
        </View>
    )
}