pragma solidity ^0.4.2;
contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract token {
    /* Public variables of the token */
    string public standard = 'Jobi 1.0';
    string public name;
    string public symbol;
    uint8 public decimals = 5;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint decimalMultiplier = 100000;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function token(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply * decimalMultiplier;              // Give the creator all initial tokens
        // update total supply
        totalSupply = initialSupply * decimalMultiplier; // multiple by for decimals               
        // max is double initial supply (for mining)
        maxSupply = initialSupply * 2 * decimalMultiplier;
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}

contract Jobi is owned, token {
    // ICO dates (UTC in seconds)
    // End of ICO month window- new DateTimeOffset(2017, 8, 14, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 dateIcoEnd = 1502668800;

    // for mining
    bool public miningEnabled = false;
    bytes32 public currentChallenge;                         // The coin starts with a challenge
    uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    uint public difficulty = 10**32;                         // Difficulty starts reasonably low
    // multiplier initially set to 1 jobi / minute (can be adjusted later based on usage)
    uint public miningMultiplier = 100000;
    
    // for buying/selling from the contract
    bool public buyingAndSellingEnabled = false;
    uint256 public sellPrice;
    uint256 public buyPrice;

    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Jobi(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) token (initialSupply, tokenName, tokenSymbol) {
        // initialize mining date
        timeOfLastProof = now;
    }

    // leaving is an option ONLY up to the max supply point - this can never mint past that max value
    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        // only allow minting up to the hard cap of the max supply
        if((mintedAmount + totalSupply) > maxSupply){
            throw;
        }

        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;

        Transfer(0, this, mintedAmount);
        Transfer(this, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    function toggleBuyingAndSelling(bool enabled) onlyOwner {
        buyingAndSellingEnabled = enabled;
    }

    function toggleMining(bool enabled) onlyOwner {
        miningEnabled = enabled;
    }

    function setMiningMultiplier(uint multiplier) onlyOwner {
        miningMultiplier = multiplier;
    }

    function buy() payable {
        if(!buyingAndSellingEnabled){
            throw;
        }

        uint amount = msg.value / buyPrice;                // calculates the amount
        if (balanceOf[this] < amount) throw;               // checks if it has enough to sell
        balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
        balanceOf[this] -= amount;                         // subtracts amount from seller's balance
        Transfer(this, msg.sender, amount);                // execute an event reflecting the change
    }

    function sell(uint256 amount) {
        if(!buyingAndSellingEnabled){
            throw;
        }

        if (balanceOf[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
        balanceOf[this] += amount;                         // adds the amount to owner's balance
        balanceOf[msg.sender] -= amount;                   // subtracts the amount from seller's balance
        if (!msg.sender.send(amount * sellPrice)) {        // sends ether to the seller. It's important
            throw;                                         // to do this last to avoid recursion attacks
        } else {
            Transfer(msg.sender, this, amount);            // executes an event reflecting on the change
        }               
    }

    // for mining
    function proofOfWork(uint nonce){
        // only allow mining if enabled AND post-ICO month window
        if(!miningEnabled || now < dateIcoEnd || totalSupply >= maxSupply){
            throw;
        }

        bytes8 n = bytes8(sha3(nonce, currentChallenge));    // Generate a random hash based on input
        if (n < bytes8(difficulty)) throw;                   // Check if it's under the difficulty

        uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
        if (timeSinceLastProof <  5 seconds) throw;         // Rewards cannot be given too quickly
        balanceOf[msg.sender] += timeSinceLastProof / 60 seconds * miningMultiplier;  // The reward to the winner grows by the minute

        difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty

        timeOfLastProof = now;                              // Reset the counter
        currentChallenge = sha3(nonce, currentChallenge, block.blockhash(block.number-1));  // Save a hash that will be used as the next proof
    }
}