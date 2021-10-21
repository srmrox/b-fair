const { createHash } = require('crypto');
const h2b = require('hex-to-binary');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(transactions, previousHash='') {
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return createHash('sha256').update(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).digest('hex');
    }

    mine(difficulty){
        while(h2b(this.hash).toString().substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.transactionPool = [];
        this.reward = 100;
    }

    createGenesisBlock() {
        return new Block('no one saves you','0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    mineTransactionPool(rewardAddress){
        let block = new Block(this.transactionPool, this.getLatestBlock().hash);    // this list passed here determines which transactions are included in a block
        block.mine(this.difficulty);
        this.chain.push(block);

        this.transactionPool = [
            new Transaction(null, rewardAddress, this.reward)   // having a from address here means mining reward is paid by someone but it's possible they don't have sufficient money. since there are too many transactions that are being mined and the received would want to recieve the full amount, can't dedcut from transactions
        ];
    }

    createTransaction(from, to, amount){
        this.transactionPool.push(new Transaction(from, to, amount));
    }

    getBalance(address){
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions){
                if(transaction.from === address){
                    balance -= transaction.amount;
                }

                if(transaction.to === address){
                    balance += transaction.amount;
                }
            }
        }

        return balance;
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

Chain0One.createTransaction('hina','shahrukh',100);
Chain0One.createTransaction('shahrukh','malik',50);
Chain0One.mineTransactionPool('shahrukh');
Chain0One.mineTransactionPool('shahrukh');

console.log(JSON.stringify(Chain0One, null, 4));
console.log(Chain0One.isValid());
console.log(Chain0One.getBalance('shahrukh'));