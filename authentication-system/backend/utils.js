const primeList = require('./primes.json');

const getRandomInt = (max) => Math.floor(Math.random() * max);
const getRandomPrime = () => primeList[getRandomInt(primeList.length)];

const multiplyMod = (A, B, MOD) => {
    let a = BigInt(A);
    let b = BigInt(B);
    let mod = BigInt(MOD);
    return Number(a * b % mod);
}

const powerMod = (A, B, MOD) => {
    let a = BigInt(A);
    let b = BigInt(B);
    let mod = BigInt(MOD);
    let res = 1n;
    while(b) {
        if((b % 2n)) res = res * a % mod;
        a = a * a % mod;
        b >>= 1n;
    }
    return Number(res);
}

module.exports = {
    getRandomInt,
    powerMod,
    multiplyMod,
    getRandomPrime,
}