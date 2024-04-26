import { Types } from 'cafe-utility'
import { readFileSync } from 'fs'
import { BZZ, ETHEREUM, ETHEREUM_BLOCK, GNOSIS, GNOSIS_BLOCK, XBZZ } from './constants'
import { getErc20BalanceOf } from './erc20-balance-of'

const stakeDatabase = Types.asNumericDictionary(JSON.parse(readFileSync('data/stake.json', 'utf-8')))

export async function getBzz(addresses: string[]): Promise<Record<string, number>> {
    return getErc20BalanceOf(ETHEREUM, ETHEREUM_BLOCK, BZZ, 'BZZ', addresses)
}

export async function getXBzz(addresses: string[]): Promise<Record<string, number>> {
    return getErc20BalanceOf(GNOSIS, GNOSIS_BLOCK, XBZZ, 'xBZZ', addresses)
}

export async function getStakedBzz(addresses: string[]): Promise<Record<string, number>> {
    return addresses.reduce((acc, address) => {
        acc[address.toLowerCase()] = stakeDatabase[address.toLowerCase()] || 0
        return acc
    }, {} as Record<string, number>)
}
