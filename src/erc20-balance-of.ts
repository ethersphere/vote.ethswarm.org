import Snapshot from '@snapshot-labs/snapshot.js'
import { Types } from 'cafe-utility'

export async function getErc20BalanceOf(
    network: string,
    snapshot: number,
    address: string,
    symbol: string,
    voters: string[]
): Promise<Record<string, number>> {
    const space = 'swarmfoundation.eth'
    const strategies = [
        {
            name: 'erc20-balance-of',
            params: {
                address,
                symbol,
                decimals: 16
            }
        }
    ]
    const url = `https://score.snapshot.org`
    const scores = await Snapshot.utils.getScores(space, strategies, network, voters, snapshot, url)
    const results: Record<string, number> = {}
    Types.asArray(scores).forEach((score: unknown) => {
        const entries = Object.entries(Types.asObject(score))
        entries.forEach(([key, value]) => {
            results[key.toLowerCase()] = Types.asNumber(value)
        })
    })
    return results
}
