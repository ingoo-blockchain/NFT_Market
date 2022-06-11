export class UnspentTxOut implements IUspentTxOut {
    public txOutId: string
    public txOutIndex: number
    public address: string
    public amount: number

    constructor(_txOutId: string, _txOutIndex: number, _address: string, _amount: number) {
        this.txOutId = _txOutId
        this.txOutIndex = _txOutIndex
        this.address = _address
        this.amount = _amount
    }

    static findUnspentTxOuts(_addres: string, _unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
        // TODO : test 코드 작성해봐야함.
        return _unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === _addres)
    }
}
