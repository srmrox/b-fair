const MINE_RATE = 1000; // in milliseconds
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '0',
    hash: '0',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: ['no one saves you']
};

module.exports = { GENESIS_DATA, MINE_RATE };