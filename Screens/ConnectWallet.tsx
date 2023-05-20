import React, { useState } from 'react'
import { ButtonProps, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import WalletState from '../WalletState';
import PrimaryButton from '../components/PrimaryButton';

const walletState = WalletState.getInstance()

export default function ConnectWallet() {

    const [privateKey, setPrivateKey] = useState("")

    return (
        <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.upper}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={styles.logo}>Crypto Barn</Text>
                    <Image source={require("../assets/asset_wallet.jpg")} style={styles.image} />
                    <Text style={styles.introNote}>
                        Welcome to Crypto Barn!{'\n\n'}
                        Import wallet with private key below,{'\n'}
                        or create a new wallet.
                    </Text>
                </View>
            </View>
            <View style={styles.lower}>
                <TextInput placeholder='Enter Private Key' onChangeText={(text) => setPrivateKey(text)} style={styles.input} />
                <PrimaryButton onPress={() => walletState.importWallet(privateKey)} title='Import Wallet' />
                <PrimaryButton onPress={() => walletState.createWallet()} title='Create Wallet' />
            </View>
        </ScrollView >
    )

}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    upper: {
        flex: 1,
        minHeight: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lower: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        fontWeight: '500',
        textAlign: 'center',
    },
    image: {
        marginTop: 20,
        width: '100%',
        maxHeight: 250,
        aspectRatio: 1,
    },
    introNote: {
        fontFamily: 'RobotoMono',
        fontSize: 14,
        textAlign: 'center',
    },
    input: {
        width: "100%",
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
    },
});
