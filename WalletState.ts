import { makeAutoObservable } from "mobx"
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';


const PRIVATE_KEY_KEYCHAIN = 'CRYPRO-BARN-KEYCHAIN';

export default class WalletState {
    private static instance: WalletState;
    privateKey: string | null = null;
    wallet: ethers.Wallet | null = null;
    balance = 0.0

    constructor() {
        makeAutoObservable(this)
        this.loadWallet()
    }

    public static getInstance(): WalletState {
        if (!WalletState.instance) {
            WalletState.instance = new WalletState();
        }
        return WalletState.instance;
      }

    async loadWallet() {
        try {
            const keychainData = await SecureStore.getItemAsync(PRIVATE_KEY_KEYCHAIN);
            if (keychainData) {
                this.privateKey = keychainData;
                this.importWallet(keychainData);
            }
        } catch (error) {
            console.error('Failed to load private key:', error);
        }
    }

    async savePrivateKey() {
        try {
            await SecureStore.setItemAsync(PRIVATE_KEY_KEYCHAIN, this.privateKey!);
        } catch (error) {
            console.error('Failed to save private key:', error);
        }
    }

    createWallet() {
        try {
            const wallet = ethers.Wallet.createRandom();
            this.wallet = wallet;
            this.privateKey = wallet.privateKey;
            this.savePrivateKey();

            console.log("New Wallet Created");
            console.log(wallet);
            console.log(wallet.privateKey);
            console.log(wallet.mnemonic);

        } catch (error) {
            console.error("Failed to create wallet:", error);
        }
    }

    importWallet(privateKey: string) {
        try {
            const wallet = new ethers.Wallet(privateKey);
            this.wallet = wallet;
            this.privateKey = privateKey;
            this.savePrivateKey();
            this.updateBalance();
        } catch (error) {
            console.error("Failed to import wallet:", error);
        }
    }

    updateBalance() {
        if (this.wallet) {
            const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
            const walletAddress = '0xc591Be559896BaDb1469C1E2F7eb7E55225CaE86';

            provider.getBalance(walletAddress)
                .then((balance) => {
                    const formattedBalance = ethers.utils.formatEther(balance);
                    this.balance = Number.parseFloat(formattedBalance);
                    console.log(`Wallet Balance: ${formattedBalance} MATIC`);
                })
                .catch((error) => {
                    console.error('Error retrieving balance:', error);
                });
        }
    }

    reset() {
        this.wallet = null;
        this.balance = 0.0;
        SecureStore.deleteItemAsync(PRIVATE_KEY_KEYCHAIN);
    }
}