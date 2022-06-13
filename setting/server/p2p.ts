import { Chain } from '@core/blockchain/chain'
import { WebSocket } from 'ws'

export class P2PServer extends Chain {
    public sockets: WebSocket[]
    public my: WebSocket | null

    constructor(_blockchain: Chain) {
        super()
        this.my = null
        this.sockets = []
    }

    getSocket() {
        return this.sockets
    }

    listen(port: number = 7545): void {
        const server = new WebSocket.Server({ port })
        server.on('connection', socket => {
            console.log(` socket connected port : ${port} `)
            this.my = socket
            this.connectSocket(socket)
        })
    }

    connectSocket(socket: WebSocket): void {
        this.sockets.push(socket)
        this.messageHandler(socket)
        this.errorHandler(socket)
        const data: Message = {
            type: MessageType.latest_block,
            data: null,
        }
        this.send(socket)(MessageType.latest_block, data)
    }

    messageHandler(socket: WebSocket): void {
        const message = (data: string) => {
            const message: Message | null = P2PServer.dataParse<Message>(data)
            if (message === null) return

            const send = this.send(socket)
            switch (message.type) {
                case MessageType.latest_block:
                    console.log(MessageType.latest_block)
                    send(MessageType.all_block, [this.getLatestBlock()])
                    break
                case MessageType.all_block:
                    console.log(MessageType.all_block)
                    send(MessageType.response_chain, this.getChain())
                    break
                case MessageType.response_chain:
                    console.log(MessageType.response_chain)
                    const receivedChain: IBlock[] | null = P2PServer.dataParse<IBlock[]>(message.data)
                    if (receivedChain === null) break
                    this.handleChainResponse(receivedChain)
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

    handleChainResponse(receivedChain: Chain) {
        const isVaildChain = this.recivedChain(receivedChain.getChain())
        if (isVaildChain.isError) throw new Error(isVaildChain.error)

        switch (isVaildChain.value?.type) {
            case MessageType.latest_block:
                this.broadcast(isVaildChain.value)
                break
        }
    }

    broadcast(message: Message): void {
        this.sockets.forEach(socket => this.send(socket)(message.type, message.data))
    }

    close() {
        this.my?.close()
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
