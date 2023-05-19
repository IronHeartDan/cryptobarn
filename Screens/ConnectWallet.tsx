import React, { useState } from 'react'
import { ButtonProps, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import WalletState from '../WalletState';

const walletState = WalletState.getInstance()

export default function ConnectWallet() {
    const [privateKey, setPrivateKey] = useState("")


    const PrimaryBtn: React.FC<ButtonProps> = ({ onPress, title }) => {
        return (
            <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
                <Text style={styles.btntxt}>{title}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput placeholder='Enter Private Key' onChangeText={(text) => setPrivateKey(text)} style={styles.input} />
                <PrimaryBtn onPress={() => walletState.importWallet(privateKey)} title='Import Wallet' />
                <PrimaryBtn onPress={() => walletState.createWallet()} title='Create Wallet' />
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 350,
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
    },
    btn: {
        width: 350,
        margin: 5,
        backgroundColor: "black",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    btntxt: {
        color: "white",
        textAlign: "center",
    }
});
