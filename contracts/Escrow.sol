
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    // Basic Info
    address public creator;
    address public depositor;
    uint256 public amount;
    uint256 public deadline;
    string public title;
    string public description;
    string public networkId;
    
    // Status Management
    enum Status { Pending, Filled, Released, Disputed, Canceled }
    Status public status;
    
    // Timestamps
    uint256 public createdAt;
    uint256 public filledAt;
    uint256 public releasedAt;
    uint256 public canceledAt;
    uint256 public disputedAt;
    
    // Financial
    uint256 public releasedAmount;
    uint256 public proposedAmount;
    
    // Dispute Management
    string public disputeReason;
    
    // Release Management
    string public releaseDescription;
    string public cancelReason;

    event AgreementCreated(address indexed creator, uint256 amount, uint256 deadline, string title);
    event FundsFilled(address indexed depositor, uint256 amount);
    event FundsReleased(address indexed receiver, uint256 amount);
    event DisputeOpened(string reason, uint256 proposedAmount);
    event AgreementCanceled(string reason);

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    modifier onlyParties() {
        require(msg.sender == creator || msg.sender == depositor, "Only contract parties can call this function");
        _;
    }

    constructor(uint256 _amount, uint256 _deadline, string memory _title, string memory _description, string memory _networkId) {
        creator = msg.sender;
        depositor = address(0);
        amount = _amount;
        deadline = _deadline;
        title = _title;
        description = _description;
        networkId = _networkId;
        status = Status.Pending;
        createdAt = block.timestamp;
        emit AgreementCreated(creator, amount, deadline, title);
    }

    function deposit() public payable {
        require(status == Status.Pending, "Agreement not available for deposit");
        require(msg.value == amount, "Incorrect deposit amount");
        require(depositor == address(0), "Deposit already made by someone else");
        
        depositor = msg.sender;
        status = Status.Filled;
        filledAt = block.timestamp;
        
        emit FundsFilled(depositor, amount);
    }

    function release(uint256 _releaseAmount, string memory _description) public onlyCreator {
        require(status == Status.Filled, "Funds not filled");
        require(_releaseAmount <= amount, "Cannot release more than deposited");
        
        releasedAmount = _releaseAmount;
        releaseDescription = _description;
        status = Status.Released;
        releasedAt = block.timestamp;
        
        payable(depositor).transfer(_releaseAmount);
        
        // If there's remaining amount, return it to creator
        if (_releaseAmount < amount) {
            payable(creator).transfer(amount - _releaseAmount);
        }
        
        emit FundsReleased(depositor, _releaseAmount);
    }

    function openDispute(string memory _reason, uint256 _proposedAmount) public onlyCreator {
        require(status == Status.Filled, "Can only dispute filled agreements");
        require(_proposedAmount <= amount, "Proposed amount cannot exceed deposited amount");
        
        disputeReason = _reason;
        proposedAmount = _proposedAmount;
        status = Status.Disputed;
        disputedAt = block.timestamp;
        emit DisputeOpened(_reason, _proposedAmount);
    }

    function resolveDispute(uint256 _releaseAmount, string memory _description) public onlyCreator {
        require(status == Status.Disputed, "No active dispute");
        require(_releaseAmount <= amount, "Cannot release more than deposited");
        
        releasedAmount = _releaseAmount;
        releaseDescription = _description;
        status = Status.Released;
        releasedAt = block.timestamp;
        
        payable(depositor).transfer(_releaseAmount);
        
        // Return remaining amount to creator
        if (_releaseAmount < amount) {
            payable(creator).transfer(amount - _releaseAmount);
        }
        
        emit FundsReleased(depositor, _releaseAmount);
    }

    function cancel(string memory _reason) public onlyCreator {
        require(status == Status.Pending, "Can only cancel pending agreements");
        
        cancelReason = _reason;
        status = Status.Canceled;
        canceledAt = block.timestamp;
        emit AgreementCanceled(_reason);
    }

    // Emergency release after deadline (can be called by anyone)
    function emergencyRelease() public {
        require(status == Status.Filled, "Funds not filled");
        require(block.timestamp >= deadline, "Deadline not reached");
        
        releasedAmount = amount;
        releaseDescription = "Emergency release after deadline";
        status = Status.Released;
        releasedAt = block.timestamp;
        
        payable(depositor).transfer(amount);
        emit FundsReleased(depositor, amount);
    }
}
