import Router from '@koa/router'
import { Objects, Types } from 'cafe-utility'
import Koa from 'koa'
import { ApiResponse } from './api-response'
import { blacklist } from './blacklist'
import { BZZ, ETHEREUM_BLOCK, GNOSIS_BLOCK, XBZZ } from './constants'
import { getBzz, getStakedBzz, getXBzz } from './getter'
import { votingPower } from './voting-power'

const app = new Koa()
const router = new Router()
router.get('/', context => {
    context.body = {
        bzz: BZZ,
        xBzz: XBZZ,
        ethereumBlock: ETHEREUM_BLOCK,
        gnosisBlock: GNOSIS_BLOCK
    }
})
router.get('/get_vote_count', async context => {
    const addresses = Types.asEmptiableString(context.query.addresses || '')
        .toLowerCase()
        .split(',')
    const bzz = await getBzz(addresses)
    const xBzz = await getXBzz(addresses)
    const stake = await getStakedBzz(addresses)
    const merged = Objects.zipSum([bzz, xBzz, stake])
    Object.keys(merged).forEach(key => {
        if (blacklist.includes(key)) {
            merged[key] = 0
        } else {
            merged[key] = votingPower(merged[key])
        }
    })
    const keys = Object.keys(merged)
    const response: ApiResponse = {
        score: []
    }
    for (const key of keys) {
        response.score.push({
            address: key,
            score: merged[key].toFixed(0)
        })
    }
    context.body = response
})
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
