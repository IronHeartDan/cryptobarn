import PolygonWallet from "./PolygonWallet";

export namespace WalletType {
    export const Bitcoin = 'Bitcoin'
    export const Polygon = 'Polygon'
}

export namespace WalletHelper {
    export function createWallet(type: string): Wallet | null {
        switch (type) {
            case WalletType.Bitcoin:
                return null

            case WalletType.Polygon:
                const wallet = PolygonWallet.createWallet()
                if (wallet) {
                    return new PolygonWallet(wallet)
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
                return null

            case WalletType.Polygon:
                const wallet = PolygonWallet.importWallet(privateKey)
                if (wallet) {
                    return new PolygonWallet(wallet)
                } else {
                    return null
                }

            default:
                return null
        }
    }
}

export interface Transaction {
    blockNumber?: number,
    from: string
    to?: string
    value: string
    timestamp?: number
    hash: string
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
    sendCrypto(recipientAddress: string, amountToSend: string): void
}

