import { Key } from '@core/wallet/key'

export class Wallet extends Key {
    public balance: number
    public publicKey: string
    private privateKey: string

    constructor(_privKey: string = '') {
        super()

        const privkey = _privKey === '' ? Key.createPrivateKey() : _privKey
        this.balance = 0
        this.privateKey = privkey
        this.publicKey = Key.getPublicKey(privkey)
    }

    public toString() {}
}
