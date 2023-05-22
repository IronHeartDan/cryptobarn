import { action, makeAutoObservable } from "mobx";
import Wallet, { WalletHelper, WalletType } from "../wallets/Wallet";
import * as SecureStore from 'expo-secure-store';

const PRIVATE_KEY_KEYCHAIN = 'CRYPRO-BARN-KEYCHAIN';

class WalletState {
    private static instance: WalletState | null = null
    wallet: Wallet | null = null;

    constructor() {
        makeAutoObservable(this)
        this.init()
    }

    public static getInstance(): WalletState {
        if (!WalletState.instance) {
            WalletState.instance = new WalletState();
        }
        return WalletState.instance;
    }

    private async init() {
        const privateKey = await SecureStore.getItemAsync(PRIVATE_KEY_KEYCHAIN)
        if (privateKey) {
            const wallet = WalletHelper.importWallet(WalletType.Polygon, privateKey)

            if (wallet) {
                walletState.setWallet(wallet)
            }
        }
    }

    private saveKey() {
        SecureStore.setItemAsync(PRIVATE_KEY_KEYCHAIN, this.wallet?.getPrivateKey()!)
    }

    private deleteKey() {
        SecureStore.deleteItemAsync(PRIVATE_KEY_KEYCHAIN)
    }

    setWallet = action((wallet: Wallet) => {
        this.wallet = wallet
        this.saveKey()
    })

    fetchBalance = action(() => {
        this.wallet?.fetchBalance()
    })

    loadTransactions = action(async () => {
        await this.wallet?.loadTransactions()
    })

    sendCrypto = action((recipientAddress: string, amountToSend: string) => {
        this.wallet?.sendCrypto(recipientAddress, amountToSend)
    })

    reset = action(() => {
        this.wallet = null
        this.deleteKey()
    })
}

const walletState = WalletState.getInstance()
export default walletState