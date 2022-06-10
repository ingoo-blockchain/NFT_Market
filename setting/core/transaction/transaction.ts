export class Transaction implements ITransaction {
    public hash: string
    public txIns: ITxIn[]
    public txOuts: ITxOut[]

    constructor() {
        this.hash = ''
        this.txIns = []
        this.txOuts = []
    }

    static createTransactionHash(_transaction: Transaction): string {
        const txInContent: string = Transaction.TxToString(_transaction.txIns)
        const txOutContent: string = Transaction.TxToString(_transaction.txOuts)
        return txInContent + txOutContent
    }

    static TxToString<T>(_data: T[]): string {
        return _data.reduce((acc: string, item: T) => {
            const [[key, value]] = Object.entries(item)
            acc += key + value.toString()
            return acc
        }, '')
    }
}
