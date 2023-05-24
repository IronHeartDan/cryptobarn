import { View, Text, TextInput, Modal, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import globalStyle from '../utils/globalStyles'
import walletState from '../states/WalletState'
import * as Clipboard from 'expo-clipboard';
import { showAlert } from '../utils/utils'


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
            if (!toSend) {
                showAlert("Please Enter Address")
                return
            }

            if (!amount) {
                showAlert("Please Enter Amount")
                return
            }

            setIsLoading(true)
            let hash = await walletState.wallet?.sendCrypto(toSend!, amount!)
            if (hash) {
                Alert.alert(
                    'Sent',
                    `Hash : ${hash}`,
                    [
                        { text: 'Copy', onPress: () => handleCopyToClipboard(hash!) },
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

            <Text>Balance : {walletState.wallet?.balance}</Text>
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