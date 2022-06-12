import { BlockChain } from './core'
import { P2PServer } from './server/p2p'

import express from 'express'

const app = express()
const bc = new BlockChain()
const chain = bc.chain
const ws = new P2PServer(chain)

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world!')
})

app.post('/mineBlock', (req, res) => {
    const newBlock = chain.addBlock(req.body.data)
    if (newBlock.isError) return res.status(500).json(newBlock.error)
    res.json(newBlock.value)
})

app.get('/peers', (req, res) => {
    res.send()
})

app.post('/addPeer', (req, res) => {})

app.listen(3000, () => {
    console.log('hello')
    ws.listen()
})
