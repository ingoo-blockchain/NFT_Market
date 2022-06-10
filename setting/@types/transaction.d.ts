declare interface ITxOut {
    [address: string]: number
}

declare interface ITxIn {
    txOutId: string
    txOutindex: string
    signature?: string
}

declare interface ITransaction {
    hash: string
    txIns: ITxIn[]
    txOuts: ITxOut[]
}
