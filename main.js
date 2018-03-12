var sha256 = require('./node_modules/js-sha256');
var transactionFile = require('./transactions.json')

class Block {
    constructor(previousHash, transactions) {
        this.previousHash = previousHash
        this.transactions = transactions
        this.timestamp = new Date()
        this.nonce = 0
        this.hash = this.calculateHash()
    }

    calculateHash() {
        var dataToHash = this.previousHash + JSON.stringify(this.transactions) + this.timestamp.getTime() + this.nonce
        return sha256(dataToHash)
    }

    mine(difficulty) {
        var matchString = Array(difficulty + 1).join("0")

        while (this.hash.substr(0, difficulty) != matchString) {
            this.nonce++
            this.hash = this.calculateHash()
        }
    }
}

class Blockchain {
    constructor(difficulty) {
        var genesisBlock = new Block("0", "empty")
        this.chain = [genesisBlock]
        this.transactions = 
        this.difficulty = difficulty
        this.maxTransactions = 5
    }

    validateBlocks() {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i]
            var previousBlock = this.chain[i - 1]

            if (currentBlock.hash != currentBlock.calculateHash()) return false
            if (currentBlock.previousHash != previousBlock.hash) return false
        }
        return true
    }

    mineBlock() {
        this.transactions

        var block = new Block(this.chain[this.chain.length - 1].hash, ts)
        block.mine(this.difficulty)

        this.chain.push(block)
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = new Date()
    }
}

var c = new Blockchain(5)

console.log(c.transactions)