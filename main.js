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
        this.transactions = transactionFile.transactions
        this.difficulty = difficulty
        this.maxTransactions = 5
        this.miningReward = 10
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

    mineBlock(minerAddress) {
        var blockTransactions = []
        if (this.transactions.length > 0) {
            for (var i = 0; i < this.maxTransactions; i++) {
                if (this.transactions.length > 0) {
                    blockTransactions.push(this.transactions.pop())
                }
                else {
                    // In the event that there are no more transactions
                    // this will move on to mining what it can
                    console.log("There are no more transactions, mining with " + blockTransactions.length + " transaction(s).")
                    break
                }
            }
    
            var block = new Block(this.chain[this.chain.length - 1].hash, blockTransactions)
            block.mine(this.difficulty)
    
            this.chain.push(block)
            console.log("Block added: " + block.hash + " Transactions: " + block.transactions.length)

            this.transactions.push(new Transaction("", minerAddress, this.miningReward))
            console.log("Mining reward distributed.")
        }
        else {
            console.log("There are no transactions, cannot mine.")
        }
    }

    getBalance(address) {
        var balance = 0
        this.chain.forEach((block) => {
            for (var i = 0; i < block.transactions.length; i++) {
                if (block.transactions[i].toAddress == address) balance += block.transactions[i].amount
                if (block.transactions[i].fromAddress == address) balance -= block.transactions[i].amount
            }
        })
        return balance
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

// The parameter states the difficulty of the blockchain to be mined
var c = new Blockchain(5)

// This can be anything
var minerAddress = "miner"

console.log("Mining started...")

// This will make sure that the loop will end.
// Miners shouldn't be able to infinitely mine
// their own transaction reward
while (c.transactions.length > 1) {
    console.log("Attempting to mine.")
    c.mineBlock(minerAddress)
}

console.log("\n\nBalances:")
console.log("Miner: " + c.getBalance("miner")) // this should match the miner address
console.log("Paul: " + c.getBalance("paul"))
console.log("Kenn: " + c.getBalance("kenn"))
console.log("Jenn: " + c.getBalance("jenn"))
console.log("Bob: " + c.getBalance("bob"))
console.log("Alex: " + c.getBalance("jenn"))
console.log("John: " + c.getBalance("john"))
