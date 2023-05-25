import BitcoinWallet from "./BitcoinWallet";
import PolygonWallet from "./PolygonWallet";

export namespace WalletType {
    export const Bitcoin = 'Bitcoin'
    export const Polygon = 'Polygon'
}

export namespace WalletHelper {
    export function createWallet(type: string): Wallet | null {
        switch (type) {
            case WalletType.Bitcoin:
                const bitcoinWallet = BitcoinWallet.createWallet()
                if (bitcoinWallet) {
                    return new BitcoinWallet(bitcoinWallet)
                } else {
                    return null
                }

            case WalletType.Polygon:
                const polygonWallet = PolygonWallet.createWallet()
                if (polygonWallet) {
                    return new PolygonWallet(polygonWallet)
                } else {
                    return null
                }

            default:
                return null
        }
    }

    export function importWallet(type: string, privateKey: string): Wallet | null {
        switch (type) {
            case WalletType.Bitcoin:
                const bitcoinWallet = BitcoinWallet.importWallet(privateKey)
                if (bitcoinWallet) {
                    return new BitcoinWallet(bitcoinWallet)
                } else {
                    return null
                }

            case WalletType.Polygon:
                const polygonWallet = PolygonWallet.importWallet(privateKey)
                if (polygonWallet) {
                    return new PolygonWallet(polygonWallet)
                } else {
                    return null
                }

            default:
                return null
        }
    }
}

export interface Transaction {
    hash: string
    value: string
    timestamp?: number
}

export default interface Wallet {
    type: string
    address: string | null
    balance: string | null
    transactions: Transaction[]
    getAddress(): void
    getPrivateKey(): string
    getNmenomic(): void
    fetchBalance(): void
    loadTransactions(): Promise<void>;
    sendCrypto(recipientAddress: string, amountToSend: string): Promise<string | null>
}

