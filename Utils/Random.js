const BigNumber = require('bignumber.js');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInRange(min, max) {
    const diff = new BigNumber(max).minus(min);
    const random = new BigNumber(Math.random());
    const result = random.times(diff).plus(min);
    return result.toFixed();
}

module.exports = {
    getRandomInt,
    randomInRange,
    getRandomNumber,
}

