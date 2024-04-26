export function votingPower(value: number) {
    if (value < 10) {
        return 0
    }
    return Math.sqrt(value - 9)
}
