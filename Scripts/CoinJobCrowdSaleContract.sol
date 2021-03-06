pragma solidity ^0.4.2;
contract token { function transfer(address receiver, uint amount); }

contract CoinJobCrowdsale {
    address public owner;
    // ICO dates (UTC in seconds)
    // Pre-Sale - new DateTimeOffset(2017, 7, 13, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 datePreSaleInSeconds = 1499904000;
    // Main ICO date - new DateTimeOffset(2017, 7, 14, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 dateIcoPhaseOneInSeconds = 1499990400;
    // ICO - Stage 2 - new DateTimeOffset(2017, 7, 15, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 dateIcoPhaseTwoInSeconds = 1500076800;
    // ICO - Stage 3 - new DateTimeOffset(2017, 7, 21, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 dateIcoPhaseThreeInSeconds = 1500595200;
    // End of ICO 30 day window window - new DateTimeOffset(2017, 8, 14, 0, 0, 0, TimeSpan.FromHours(0)).ToUnixTimeSeconds()
    uint256 dateIcoEnd = 1502668800;

    // pricing stages (note: multiple ALL by 100,000 to adjust for XCJ's 5 decimals for fractional token support)
    uint decimalMultiplier = 100000;
    uint public jobisPerEtherPreSale = 1500 * decimalMultiplier;
    uint public jobisPerEtherIcoPhaseOne = 1200 * decimalMultiplier;
    uint public jobisPerEtherIcoPhaseTwo = 1100 * decimalMultiplier;
    uint public jobisPerEtherIcoPhaseThree = 1000 * decimalMultiplier;

    // 20.3mm Jobis goal; 20mm available for pre-sale
    uint public fundingGoalInJobis = 20300000 * decimalMultiplier; 
    uint public maxPreSaleGoalInJobis = 20000000 * decimalMultiplier;
    uint public amountRaisedInJobis = 0; 
    uint public amountRaisedInWei = 0; 
    
    token public tokenReward; // Jobi token
    address public beneficiary; // CoinJob account
    mapping(address => uint256) public balanceOf; // balances
    bool fundingGoalReached = false;
    bool crowdsaleClosed = false;
    event GoalReached(address beneficiary, uint amountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    /* data structure to hold information about campaign contributors */

    /*  at initialization, setup the owner */
    function CoinJobCrowdsale(
        address ifSuccessfulSendTo,
        token addressOfTokenUsedAsReward
    ) {
        beneficiary = ifSuccessfulSendTo;
        tokenReward = token(addressOfTokenUsedAsReward);

        owner = msg.sender;
    }

    /* The function without name is the default function that is called whenever anyone sends funds to a contract */
    function () payable {
        if (crowdsaleClosed || now > dateIcoEnd) throw;

        // amount of Jobis yielded is the value provided in either (value / 1 ether) * jobisPerEther at the current price by date
        uint rawAmount = msg.value;
        
        uint currentJobisPerEther = this.getCurrentJobisPerEtherPrice();
        uint amountInJobis = (rawAmount * currentJobisPerEther) / (1 ether);

        // set balance of contributor (note: important that this is in raw amount so we can return 
        // the whole contribution regardless of the Jobi price at which the contribution was made)
        balanceOf[msg.sender] += rawAmount;
        // keep track of raised amount in Jobis and wei
        amountRaisedInJobis += amountInJobis;
        amountRaisedInWei += rawAmount;

        // transfer Jobis to contributor
        tokenReward.transfer(msg.sender, amountInJobis);

        // contribute raw amount
        FundTransfer(msg.sender, rawAmount, true);
    }

    modifier afterDeadline() { if (now >= dateIcoEnd) _; }

    /* checks if the goal or time limit has been reached and ends the campaign */
    function checkGoalReached() afterDeadline {
        if (amountRaisedInJobis >= fundingGoalInJobis){
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaisedInWei);
        }
        crowdsaleClosed = true;
    }

    function safeWithdrawal() afterDeadline {
        this.checkGoalReached();

        // if after deadline and NOT reached, then return all of wei
        if (!fundingGoalReached) {
            // take wei balance and return
            uint amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }

        // if successful, deposit to beneficiary account (owner account)
        if (fundingGoalReached && owner == msg.sender) {
            // deposit the wei amount raised
            if (beneficiary.send(amountRaisedInWei)) {
                FundTransfer(beneficiary, amountRaisedInWei, false);
            } else {
                //If we fail to send the funds to beneficiary, unlock funders balance
                fundingGoalReached = false;
            }
        }
    }

    function getCurrentJobisPerEtherPrice() returns (uint price){
        if(now < datePreSaleInSeconds){
            throw;
        }
        // if pre-sale
        else if(now >= datePreSaleInSeconds && now < dateIcoPhaseOneInSeconds){
            // abort if we've already reached pre-sale max raised
            if(amountRaisedInJobis >= maxPreSaleGoalInJobis){
                throw;
            }
            return jobisPerEtherPreSale;
        }
        // if ICO phase 1
        else if(now >= dateIcoPhaseOneInSeconds && now < dateIcoPhaseTwoInSeconds){
            return jobisPerEtherIcoPhaseOne;
        }
        // if ICO phase 2
        else if(now >= dateIcoPhaseTwoInSeconds && now < dateIcoPhaseThreeInSeconds){
            return jobisPerEtherIcoPhaseTwo;
        }
        // if ICO phase 3
        else if(now >= dateIcoPhaseThreeInSeconds){
            return jobisPerEtherIcoPhaseThree;
        }
    }
}