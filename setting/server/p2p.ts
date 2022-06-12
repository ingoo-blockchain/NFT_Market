import { Chain } from '@core/blockchain/chain'
import { WebSocket } from 'ws'

enum MessageType {
    latest_block = 0, // 최신 블록 가져오기
    all_block = 1, // 전체 블록 가져오기
    response_chain = 2, // 체인받기 - 블록검증
}

interface Message {
    type: MessageType
    data: any
}

export class P2PServer {
    public blockchain: Chain
    public sockets: WebSocket[]

    constructor(_blockchain: Chain) {
        this.blockchain = _blockchain
        this.sockets = []
    }

    getSocket() {
        return this.sockets
    }

    listen(port: number = 7545): void {
        const server = new WebSocket.Server({ port })
        server.on('connection', socket => {
            console.log(` socket connected port : ${port} `)
            this.connectSocket(socket)
        })
    }

    connectSocket(socket: WebSocket): void {
        this.sockets.push(socket)
        this.messageHandler(socket)
        this.errorHandler(socket)
    }

    messageHandler(socket: WebSocket): void {
        const message = (data: string) => {
            const message: Message | null = P2PServer.dataParse<Message>(data)
            if (message === null) return

            const send = this.send(socket)
            switch (message.type) {
                case MessageType.latest_block:
                    console.log(MessageType.latest_block)
                    send(MessageType.all_block, [this.blockchain.getLatestBlock()])
                    break
                case MessageType.all_block:
                    console.log(MessageType.all_block)
                    send(MessageType.response_chain, this.blockchain.getChain())
                    break
                case MessageType.response_chain:
                    console.log(MessageType.response_chain)
                    console.log(message.data)
                    break
            }
        }

        socket.on('message', message)
    }

    send(socket: WebSocket) {
        return (type: MessageType, data: any) => {
            socket.send(P2PServer.createAction(type, data))
        }
    }

    connectToPeer(newPeer: string) {
        const socket = new WebSocket(newPeer)
        socket.on('open', () => {
            this.connectSocket(socket)
        })
        socket.on('error', () => {
            console.log('소켓 연결 실패')
        })
    }

    errorHandler(socket: WebSocket) {
        const closeConnection = (myWs: WebSocket): void => {
            console.log('connection failed to peer' + myWs.url)
            this.sockets.splice(this.sockets.indexOf(myWs), 1)
        }

        socket.on('close', () => {
            closeConnection(socket)
        })
        socket.on('error', () => {
            closeConnection(socket)
        })
    }

    close() {
        process.exit(1)
    }

    static dataParse<T>(data: string): T | null {
        try {
            return JSON.parse(Buffer.from(data).toString())
        } catch (e) {
            return null
        }
    }

    static createAction(type: MessageType, data: any): string {
        return JSON.stringify({ type, data })
    }
}
