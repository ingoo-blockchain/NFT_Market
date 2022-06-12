import { P2PServer } from './p2p'
import { Chain } from '@core/blockchain/chain'

describe('P2P server ', () => {
    const blockchain1: Chain = new Chain()
    const blockchain2: Chain = new Chain()
    let ws1 = new P2PServer(blockchain1)
    let ws2 = new P2PServer(blockchain2)

    beforeAll(done => {
        ws1.listen(7545)
        ws2.listen(8545)
        done()
    })

    afterAll(() => {
        console.log('after')
        ws1.close()
        ws2.close()
    })

    it('Server test', done => {
        // ws1.connectToPeer('ws://localhost:8545')
        done()
    })
})
