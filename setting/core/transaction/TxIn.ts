import BN from 'bn.js'

export class TxIn implements ITxIn {
    public txOutId: string
    public txOutIndex: number
    public signature?: string

    constructor(_id: string, _index: number) {
        this.txOutId = _id
        this.txOutIndex = _index
    }

    static hasDuplicates(txIns: TxIn[]): Failable<undefined, string> {
        const groups = txIns.reduce((acc: any, txIn: TxIn) => {
            const key = acc[txIn.txOutId + txIn.txOutIndex]
            const value = key === undefined ? 1 : key + 1
            return acc
        }, {})

        const result = new Set<string>(Object.values(groups))
        if (result.size < 1) return { isError: true, error: '중복된 TxIn이 존재합니다.' }
        return { isError: false, value: undefined }
    }

    static signTxIn(): string {
        return ''
    }
}

// export class Signature {
//     public r: BN
//     public s: BN
// }
