import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ButtonProps, TouchableOpacity } from 'react-native'
import WalletState from "../WalletState";
import { observer } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp } from '@react-navigation/native';
import globalStyle from '../globalStyles';
import { handleCopyToClipboard, showAlert } from '../utils';

interface WalletViewProps {
    walletState: WalletState;
}


const walletState = WalletState.getInstance()

interface HomeScreenProps {
    navigation: NavigationProp<any>;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

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


    const showReceiveDialog = () => {
        showAlert('Wallet Address',
            walletState.wallet?.address,
            [
                { text: 'Copy', onPress: () => handleCopyToClipboard(walletState.wallet!.address!) },
                { text: 'Close' },
            ],
            { cancelable: true })
    }


    const WalletView: React.FC<WalletViewProps> = observer(({ walletState }) => (
        <LinearGradient
            colors={['#FF9800', '#F44336']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletCard}
        >
            <Text style={styles.walletBallance}>Balance : {walletState.balance}</Text>
            <Text>MATIC</Text>
        </LinearGradient>
    ))

    const TileButton: React.FC<ButtonProps> = ({ title, onPress }) => (
        <TouchableOpacity style={{ ...styles.tile, borderWidth: 1 }} onPress={onPress} activeOpacity={0.5}>
            <Text>{title}</Text>
        </TouchableOpacity>
    )


    return (
        <View style={styles.container}>
            <Text style={globalStyle.logo}>Crypto Barn</Text>
            <WalletView walletState={walletState} />
            <View style={styles.tileCon}>
                <TileButton title='Send' onPress={() => {
                    navigation.navigate("SendCrypto")
                }} />
                <TileButton title='Receive' onPress={showReceiveDialog} />
            </View>
            <View style={styles.tileCon}>
                <View style={styles.tile}>
                    <Text>Bitcoin : {bitCoinPrice}</Text>
                </View>
            </View>
            <View style={styles.tileCon}>
                <View style={styles.tile}>
                    <Text>USDT : {bitCoinPrice}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    walletCard: {
        marginTop: 10,
        width: "100%",
        aspectRatio: 3 / 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    walletBallance: {
        fontFamily: "RobotoMono",
        fontSize: 24,
    },
    tileCon: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10,
    },
    tile: {
        flex: 1,
        height: 60,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
})

export default HomeScreen