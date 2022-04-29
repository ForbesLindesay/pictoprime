// @ts-check

// import { randomInt } from 'crypto'
import { parentPort } from 'worker_threads'

import { generatePrimes } from '../generatePrimes.js'
// import { modPow } from '../modularArithmetic.js'

const SMALL_PRIMES = generatePrimes(2_000).map(p => BigInt(p))

parentPort.on('message', (message) => {
    parentPort.postMessage(isPossiblyPrime(message));
});

function isPossiblyPrime(value) {
    const integerValue = BigInt(value)
    return isNotDivisibleBySmallPrimes(integerValue) // && passesLittleFermat(integerValue)
}

function isNotDivisibleBySmallPrimes(value) {
    for (const v of SMALL_PRIMES) {
        if (value % v === 0n) {
            return false
        }
    }
    return true
}

// const MAX_FERMAT_TEST = Math.pow(2, 48)
// const a = BigInt(randomInt(2, MAX_FERMAT_TEST))
// function passesLittleFermat(value) {
//     if (modPow(a, value - 1n, value) !== 1n) {
//         return false
//     }
//     return true
// }
