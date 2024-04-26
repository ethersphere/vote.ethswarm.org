import { Files } from 'cafe-node-utility'
import { Arrays, Objects, System } from 'cafe-utility'
import { getBzz, getStakedBzz, getXBzz } from '../getter'
import { votingPower } from '../voting-power'

const BATCH_SIZE = 50
const SLEEP_MILLIS = 3_000

main()

async function main() {
    const lines = await Files.readCsv(
        'snapshot-report-0x28b308188ed7afba140ac5629b2aff4d6b6012b400403468e595d4af0549cdbd.csv',
        1
    )
    let current = 0
    const groups = Arrays.splitBySize(lines, BATCH_SIZE)
    for (const group of groups) {
        const bzz = await getBzz(group.map(line => line[0]))
        const xbzz = await getXBzz(group.map(line => line[0]))
        const stakes = await getStakedBzz(group.map(line => line[0]))
        const merged = Objects.zipSum([bzz, xbzz, stakes])
        for (const [address, vote, vp] of group) {
            if (!merged[address.toLowerCase()]) {
                throw Error(`Address ${address} not found`)
            }
            const result = votingPower(merged[address.toLowerCase()]).toFixed()
            if (result !== vp) {
                throw Error(`Voting power mismatch for ${address}: ${result} !== ${vp}`)
            }
            console.log(address, vote === '1' ? 'REMOVE' : 'MAINTAIN', vp, '===', result)
        }
        console.log('Processed', (current += group.length), 'addresses')
        await System.sleepMillis(SLEEP_MILLIS)
    }
}
