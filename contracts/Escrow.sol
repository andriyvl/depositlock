
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract Escrow {
    // Basic Info
    address public creator;
    address public depositor;
    uint256 public amount;
    uint256 public deadline;
    string public title;
    string public description;
    string public networkId;

    // ERC-20 token info
    address public tokenAddress;
    string public tokenSymbol;
    uint8 public tokenDecimals;

    // Status Management
    enum Status {
        Pending,
        Filled,
        Released,
        Disputed,
        Canceled
    }
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

    event AgreementCreated(
        address indexed creator,
        uint256 amount,
        uint256 deadline,
        string title,
        address tokenAddress,
        string tokenSymbol
    );
    event FundsFilled(address indexed depositor, uint256 amount);
    event FundsReleased(address indexed receiver, uint256 amount);
    event DisputeOpened(string reason, uint256 proposedAmount);
    event AgreementCanceled(string reason);

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    constructor(
        uint256 _amount,
        uint256 _deadline,
        string memory _title,
        string memory _description,
        string memory _networkId,
        address _tokenAddress,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) {
        require(_tokenAddress != address(0), "Token address is required");
        require(_amount > 0, "Amount must be greater than 0");

        creator = msg.sender;
        depositor = address(0);
        amount = _amount;
        deadline = _deadline;
        title = _title;
        description = _description;
        networkId = _networkId;
        tokenAddress = _tokenAddress;
        tokenSymbol = _tokenSymbol;
        tokenDecimals = _tokenDecimals;
        status = Status.Pending;
        createdAt = block.timestamp;

        emit AgreementCreated(creator, amount, deadline, title, tokenAddress, tokenSymbol);
    }

    function deposit() public {
        require(status == Status.Pending, "Agreement not available for deposit");
        require(depositor == address(0), "Deposit already made by someone else");

        depositor = msg.sender;
        status = Status.Filled;
        filledAt = block.timestamp;

        _safeTransferFrom(tokenAddress, msg.sender, address(this), amount);
        emit FundsFilled(depositor, amount);
    }

    function release(uint256 _releaseAmount, string memory _description) public onlyCreator {
        require(status == Status.Filled, "Funds not filled");
        _releaseFunds(_releaseAmount, _description);
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
        _releaseFunds(_releaseAmount, _description);
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

        _releaseFunds(amount, "Emergency release after deadline");
    }

    function _releaseFunds(uint256 _releaseAmount, string memory _description) internal {
        require(_releaseAmount <= amount, "Cannot release more than deposited");

        releasedAmount = _releaseAmount;
        releaseDescription = _description;
        status = Status.Released;
        releasedAt = block.timestamp;

        if (_releaseAmount > 0) {
            _safeTransfer(tokenAddress, depositor, _releaseAmount);
        }

        uint256 creatorAmount = amount - _releaseAmount;
        if (creatorAmount > 0) {
            _safeTransfer(tokenAddress, creator, creatorAmount);
        }

        emit FundsReleased(depositor, _releaseAmount);
    }

    function _safeTransfer(address _token, address to, uint256 value) internal {
        (bool success, bytes memory returndata) = _token.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, value)
        );
        require(success, "Token transfer failed");
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "Token transfer returned false");
        }
    }

    function _safeTransferFrom(address _token, address from, address to, uint256 value) internal {
        (bool success, bytes memory returndata) = _token.call(
            abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value)
        );
        require(success, "Token transferFrom failed");
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "Token transferFrom returned false");
        }
    }
}
