const { createHash } = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this. previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return createHash('sha256').update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0,'1/10/21','no one saves you','0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            // if hash of current block is invalid OR previous hash in current block is not same as hash in previous block, chain is invalid
            if(currentBlock.hash !== currentBlock.calculateHash() || currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

let Chain0One = new Blockchain();


Chain0One.addBlock(new Block(1,'1/10/21',{amount: 1}));
Chain0One.addBlock(new Block(2,'1/10/21',{amount: 2}));

console.log(JSON.stringify(Chain0One, null, 4));
console.log(Chain0One.isValid());