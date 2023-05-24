import { action, makeAutoObservable } from "mobx"
import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers, providers } from 'ethers'

import Wallet, { Transaction, WalletType } from "./Wallet"

const API_KEY = "AWVVKUD5BEU4FP6R7BBKYAB7E6Z7SHNU2T";

class PolygonWallet implements Wallet {

    private wallet!: ethers.Wallet

    type: string = WalletType.Polygon
    address: string | null = null
    balance: string | null = null
    transactions: Transaction[] = []

    static provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/')

    constructor(wallet: ethers.Wallet) {
        makeAutoObservable(this)
        this.wallet = wallet
        this.fetchBalance()
        this.getAddress()
    }

    static createWallet = action((): ethers.Wallet | null => {
        try {
            const wallet = ethers.Wallet.createRandom()
            wallet.connect(this.provider)
            return wallet
        } catch (error) {
            console.error("Failed to create wallet:", error)
            return null
        }
    })

    static importWallet = action((privateKey: string): ethers.Wallet | null => {
        try {
            return new ethers.Wallet(privateKey, this.provider);
        } catch (error) {
            console.error("Failed to import wallet:", error);
            return null
        }
    })

    async getAddress() {
        this.address = await this.wallet.getAddress()
        console.log(this.address)
    }

    getPrivateKey(): string {
        return this.wallet.privateKey
    }

    getNmenomic(): void {
        console.log(this.wallet.mnemonic.phrase);
    }

    fetchBalance = action(async () => {
        try {
            const walletAddress = this.wallet!.address;
            const balance = await PolygonWallet.provider.getBalance(walletAddress)
            const formattedBalance = ethers.utils.formatEther(balance);
            this.balance = Number.parseFloat(formattedBalance).toFixed(2);
            console.log(`Wallet Balance: ${formattedBalance} MATIC`);
        } catch (error) {
            console.error('Error retrieving balance:', error);
        }
    })

    loadTransactions = action(async () => {
        if (!this.wallet) {
            console.log("Wallet Not Found");
            return
        }

        try {
            const etherscanProvider = new ethers.providers.EtherscanProvider(PolygonWallet.provider.network, API_KEY);

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
    })

    sendCrypto = action(async (recipientAddress: string, amountToSend: string): Promise<string | null> => {
        try {
            const amount = ethers.utils.parseUnits(amountToSend, 'ether'); // Amount in MATIC, 0.1 MATIC in this case

            const transaction = await this.wallet!.sendTransaction({
                to: recipientAddress,
                value: amount,
            });

            await transaction.wait(); // Wait for transaction confirmation

            this.fetchBalance();

            console.log('Transaction hash:', transaction.hash);

            return transaction.hash;
        } catch (error) {
            console.error('Failed to send transaction:', error);
            return null;
        }
    })
}

export default PolygonWallet