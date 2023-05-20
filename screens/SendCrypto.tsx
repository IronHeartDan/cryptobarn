import { View, Text, TextInput, Modal, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import globalStyle from '../utils/globalStyles'
import WalletState from '../states/WalletState'
import * as Clipboard from 'expo-clipboard';

const walletState = WalletState.getInstance()

export default function SendCrypto() {
    const [isLoading, setIsLoading] = useState(false);
    const [toSend, setToSend] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | null>(null);


    const handleCopyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text)
        Alert.alert('Copied to Clipboard', 'The text has been copied to the clipboard.');
    };

    const sendCrypto = async () => {
        try {
            if (!toSend && !amount) return;
            setIsLoading(true)
            let res = await walletState.sendTransaction(toSend!, amount!)
            if (res?.hash) {
                Alert.alert(
                    'Sent',
                    `Hash : ${res.hash!}`,
                    [
                        { text: 'Copy', onPress: () => handleCopyToClipboard(res!.hash!) },
                        { text: 'Close' },
                    ],
                    { cancelable: true }
                );
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    return (
        <View style={globalStyle.container}>

            <Text>Balance : {walletState.balance}</Text>
            <TextInput placeholder='Enter Address' style={globalStyle.input} onChangeText={(text) => setToSend(text)} />
            <TextInput placeholder='Amount' keyboardType='numeric' style={globalStyle.input} onChangeText={(text) => setAmount(text)} />
            <PrimaryButton title='Send' onPress={sendCrypto} />
            <Modal visible={isLoading} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="blue" />
                        <Text style={styles.loadingText}>Processing...</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});