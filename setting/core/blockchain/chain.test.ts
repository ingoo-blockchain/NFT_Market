import { Chain } from './chain'

describe('Chain 함수체크', () => {
    let node: Chain
    beforeEach(() => {
        node = new Chain()
    })

    it('addBlock 함수 체크', () => {
        for (let i = 1; i <= 12; i++) {
            node.addBlock([`Block #${i}`])
        }

        console.log(node)
    })
})
