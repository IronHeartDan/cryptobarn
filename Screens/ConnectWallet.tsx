import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View, Image, ScrollView, KeyboardAvoidingView } from 'react-native';

import walletState from '../states/WalletState';
import PrimaryButton from '../components/PrimaryButton';
import globalStyle from '../utils/globalStyles';
import { WalletHelper, WalletType } from '../wallets/Wallet';
import { showAlert } from '../utils/utils';
import { Dropdown } from 'react-native-element-dropdown';
import { Platform } from 'react-native';


export default function ConnectWallet() {

    const [privateKey, setPrivateKey] = useState<string | null>(null)
    const [selectedWalletType, setWalletType] = useState<{ label: string, value: string } | null>(null)

    const walletTypes = [
        { label: 'Bitcoin', value: WalletType.Bitcoin },
        { label: 'Polygon', value: WalletType.Polygon },
    ];

    const createWallet = () => {
        const wallet = WalletHelper.createWallet(WalletType.Bitcoin)
        if (wallet) {
            walletState.setWallet(wallet)
        } else {
            showAlert("Failed To Create Wallet")
        }
    }

    const importWallet = () => {
        if (!selectedWalletType) {
            showAlert("Please Select Wallet Type")
            return;
        }

        if (!privateKey) {
            showAlert("Please Enter Private Key")
            return;
        }

        const wallet = WalletHelper.importWallet(selectedWalletType.value, privateKey)
        if (wallet) {
            walletState.setWallet(wallet)
        } else {
            showAlert("Failed To Import Wallet")
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? undefined : 'padding'}>
            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.upper}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={globalStyle.logo}>Crypto Barn</Text>
                        <Image source={require("../assets/asset_wallet.jpg")} style={styles.image} />
                        <Text style={styles.introNote}>
                            Welcome to Crypto Barn!{'\n\n'}
                            Import wallet with private key below,{'\n'}
                            or create a new wallet.
                        </Text>
                    </View>
                </View>
                <View style={styles.lower}>
                    <Dropdown
                        style={globalStyle.dropdown}
                        data={walletTypes}
                        placeholder='Select Wallet Type'
                        labelField="label"
                        valueField="value"
                        value={selectedWalletType ?? null}
                        onChange={(item: any) => {
                            setWalletType(item)
                        }}
                    />
                    <TextInput placeholder='Enter Private Key' onChangeText={(text) => setPrivateKey(text)} style={globalStyle.input} />
                    <PrimaryButton onPress={() => importWallet()} title='Import Wallet' />
                    {/* <PrimaryButton onPress={() => createWallet()} title='Create Wallet' /> */}
                </View>
            </ScrollView >
        </KeyboardAvoidingView>
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
});
