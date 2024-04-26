import { Files } from 'cafe-node-utility'
import { Types } from 'cafe-utility'
import { GNOSIS_BLOCK } from '../constants'

buildStakerDatabase()

async function buildStakerDatabase() {
    const addresses: Record<string, number> = {}
    const json = Types.asObject(await Files.readJsonAsync('data/swarmscan-events-staking-stake.json'))
    const stakeEvents = Types.asArray(json.events).map(Types.asObject)
    for (const stakeEvent of stakeEvents) {
        const blockNumber = Types.asNumber(stakeEvent.blockNumber)
        if (blockNumber > GNOSIS_BLOCK) {
            continue
        }
        const { owner, stakeAmount } = Types.asObject(stakeEvent.data)
        const amount = Types.asNumber(stakeAmount) / 1e16
        const key = Types.asString(owner).toLowerCase()
        if (!addresses[key]) {
            addresses[key] = amount
        } else if (addresses[key] < amount) {
            addresses[key] = amount
        }
    }
    await Files.writeJsonAsync('data/stake.json', addresses)
}
