import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import WalletState from "../WalletState";
import { observer } from 'mobx-react';

interface WalletViewProps {
    walletState: WalletState;
}


const walletState = WalletState.getInstance()

export default function HomeScreen() {

    const [bitCoinPrice, setBitCoinPrice] = useState("")

    useEffect(() => {
        // Establish WebSocket connection
        const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

        // Handle socket open event
        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        // Handle incoming messages
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setBitCoinPrice(message.p)
        };

        // Handle socket close event
        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, []);


    const WalletView: React.FC<WalletViewProps> = observer(({ walletState }) => (
        <Text>Balance : {walletState.balance}</Text>
    ))


    return (
        <View style={styles.container}>
            <Text>Bitcoin : {bitCoinPrice}</Text>
            <WalletView walletState={walletState} />
            <Button title='Logout' onPress={() => walletState.reset()} />
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
})
