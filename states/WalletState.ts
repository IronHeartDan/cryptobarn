import { action, makeAutoObservable } from "mobx"
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, providers } from 'ethers';
import * as SecureStore from 'expo-secure-store';


const API_KEY = "AWVVKUD5BEU4FP6R7BBKYAB7E6Z7SHNU2T";
const PRIVATE_KEY_KEYCHAIN = 'CRYPRO-BARN-KEYCHAIN';

export interface Transaction {
    blockNumber?: number,
    from: string;
    to?: string;
    value: string;
    timestamp?: number;
    hash: string;
}

export default class WalletState {

    private static instance: WalletState;
    privateKey: string | null = null;
    wallet: ethers.Wallet | null = null;
    balance = "0.0"
    transactions: Transaction[] = [];
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

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
            wallet.connect(this.provider)
            this.wallet = wallet;
            this.privateKey = wallet.privateKey;
            this.savePrivateKey();
            this.loadTransactions();

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
            const wallet = new ethers.Wallet(privateKey, this.provider);
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

            const walletAddress = this.wallet.address;

            this.provider.getBalance(walletAddress)
                .then((balance) => {
                    const formattedBalance = ethers.utils.formatEther(balance);
                    this.balance = Number.parseFloat(formattedBalance).toFixed(2);
                    console.log(`Wallet Balance: ${formattedBalance} MATIC`);
                })
                .catch((error) => {
                    console.error('Error retrieving balance:', error);
                });
        }
    }


    async loadTransactions() {
        if (!this.wallet) {
            console.log("Wallet Not Found");
            return
        }

        try {
            const etherscanProvider = new ethers.providers.EtherscanProvider(this.provider.network, API_KEY);

            const history = await etherscanProvider.getHistory(this.wallet!.address);

            action(() => {
                this.transactions = history.map((tx: providers.TransactionResponse): Transaction => ({
                    blockNumber: tx.blockNumber,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.utils.formatEther(tx.value),
                    hash: tx.hash,
                }));
            })();
        } catch (error) {
            console.error('Failed to retrieve transaction history:', error);
        }
    }

    async sendTransaction(recipientAddress: string, amountToSend: string): Promise<ethers.Transaction | null> {
        try {
            const amount = ethers.utils.parseUnits(amountToSend, 'ether'); // Amount in MATIC, 0.1 MATIC in this case

            const transaction = await this.wallet!.sendTransaction({
                to: recipientAddress,
                value: amount,
            });

            this.updateBalance()

            console.log('Transaction hash:', transaction.hash);

            return transaction;

        } catch (error) {
            console.error('Failed to send transaction :', error);
            return null
        }
    }

    reset() {
        console.log(this.wallet);
        this.wallet = null;
        this.balance = "0.0";
        SecureStore.deleteItemAsync(PRIVATE_KEY_KEYCHAIN);
    }
}