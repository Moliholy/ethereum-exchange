pragma solidity ^0.5.0;

import "./EUROracle.sol";
import "./Stoppable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title Contract to exchange ETH for EUR.
 * @author José Molina Colmenero
 * @notice The owner of this contract holds funds in EUR, approves customers and
 *         accepts ETH->EUR exchanges for a fee.
 */
contract EURExchange is Stoppable
{
    /////////// Libraries ///////////
    using SafeMath for uint;


    /////////// Attributes ///////////
    EUROracle public oracle;
    uint public ownerBalance;
    uint public feePercentage = 2;
    uint public minAmount = 0.1 ether;
    mapping(address => uint) public balances;
    mapping(address => bool) public authorizations;


    /////////// Events ///////////
    event BalanceCollected(uint balance);
    event ExchangeRequested(address indexed customer, uint amountWei, uint rawAmountCents, uint finalAmountCents);
    event AuthorizationRequested(address indexed customer);
    event WithdrawPerformed(address indexed customer, uint amount, uint balance);
    event DepositPerformed(address indexed customer, uint amount, uint balance);


    /////////// Modifiers ///////////
    modifier authorized()
    {
        require(isAuthorized(), "This address is not authorized");
        _;
    }

    modifier notAuthorized()
    {
        require(!isAuthorized(), "This address is already authorized");
        _;
    }


    /////////// Owner-only functions ///////////

    /**
     * @notice Creates a new contract.
     * @param _oracle address of the EUROracle to be used.
     */
    constructor(address payable _oracle) Stoppable()
      public
    {
        oracle = EUROracle(_oracle);
    }

    /**
     * @notice Allow a customer to participate.
     *         Only the owner can perform this operation.
     * @dev The owner can not allow himself to participate.
     */
    function grantAuthorization(address _authorizedAddress)
      external
      onlyOwner
    {
        require(_authorizedAddress != owner(), "Owner can not be a participant");

        authorizations[_authorizedAddress] = true;
    }

    /**
     * @notice Disallow a customer to participate.
     *         Only the owner can perform this operation.
     */
    function denyAuthorization(address _unauthorizedAddress)
      external
      onlyOwner
    {
        authorizations[_unauthorizedAddress] = false;
    }

    /**
     * @notice Allows the owner to collect its own earnings.
     *         Only the owner can perform this operation.
     * @dev Resets owner's balance to zero.
     */
    function collectBalance()
      external
      onlyOwner
    {
        uint balance = ownerBalance;
        ownerBalance = 0;
        emit BalanceCollected(balance);
        msg.sender.transfer(balance);
    }

    /**
     * @notice Sets the percentage the owner is going to earn per exchange.
     *         Only the owner can perform this operation.
     * @dev the value has to be between 0 and 100.
     */
    function setFeePercentage(uint _feePercentage)
      external
      onlyOwner
    {
        require(_feePercentage <= 100, "feePercentage has to be between 0 and 100");

        feePercentage = _feePercentage;
    }

    /**
     * @notice Sets the EUROracle's address.
     *         Only the owner can perform this operation.
     * @dev If using an invalid address the system will collapse.
     */
    function setOracle(address payable _oracle)
      external
      onlyOwner
    {
        require(_oracle != address(0), "Oracle address must not be null");

        oracle = EUROracle(_oracle);
    }

    /**
     * @notice Sets the minimum amount to exchange.
     *         Only the owner can perform this operation.
     */
    function setMinAmount(uint _minAmount)
      external
      onlyOwner
    {
        minAmount = _minAmount;
    }


    /////////// Public and external functions ///////////

    /**
     * @notice Request authorization to the owner to use this service.
     */
    function requestAuthorization()
      external
      notAuthorized
    {
        emit AuthorizationRequested(msg.sender);
    }

    /**
     * @notice Deposits funds into this contract.
     *         This operation does not trigger an exchange.
     * @dev Requires ether to be sent. Otherwise the operation will abort.
     */
    function deposit()
      public
      payable
      authorized
      stopInEmergency
    {
        require(msg.value > 0);

        balances[msg.sender] += msg.value;
        emit DepositPerformed(msg.sender, msg.value, getBalance());
    }

    /**
     * @notice Performs an exchange operation.
     *         A given amount is taken from this user's funds in the contract
     *         and are given to the owner. The owner will then send the funds
     *         in EUR to this customer.
     *         The owner might take a percentage of the amount as a payment for
     *         its services.
     *         Optionally it is possible to deposit extra funds by sending ether
     *         when calling this function.
     * @dev If the customer has not enough funds the operation will be aborted.
     * @param _amount Amount of wei to be exchanged for EUR.
     */
    function exchange(uint _amount)
      public
      payable
      authorized
      stopInEmergency
    {
        require(_amount >= minAmount, "Amount too low to exchange");

        if (msg.value > 0) {
            deposit();
        }
        require(getBalance() >= _amount, "Insufficient funds");

        (uint rawAmountCents, uint finalAmountCents) = getExchangeAmounts(_amount);
        balances[msg.sender] -= _amount;
        ownerBalance += _amount;
        emit ExchangeRequested(msg.sender, _amount, rawAmountCents, finalAmountCents);
    }

    /**
     * @notice Collects all funds for a given customer.
     */
    function withdraw()
      public
      stopInEmergency
    {
        uint amount = getBalance();
        withdraw(amount);
    }

    /**
     * @notice Collects some amount of a customer's current funds.
     * @dev If the customer does not have enough funds the operation will be aborted.
     * @param _amount Amount of funds to collect.
     */
    function withdraw(uint _amount)
      public
      stopInEmergency
    {
        require(_amount > 0 && _amount <= getBalance(), "Invalid balance for this account");

        balances[msg.sender] -= _amount;
        emit WithdrawPerformed(msg.sender, _amount, getBalance());
        msg.sender.transfer(_amount);
    }

    /**
     * @notice Gets a tuple with both the raw amount of EUR cents worth a given amount of wei,
     *         and the exchange amount after applying fees using this service.
     */
    function getExchangeAmounts(uint _amount)
      public
      view
      returns (uint, uint)
    {
        uint rawAmountCents = oracle.EUR().mul(_amount).div(1 ether);
        uint finalAmountCents = rawAmountCents.mul(100 - feePercentage).div(100);
        assert(finalAmountCents <= rawAmountCents);

        return (rawAmountCents, finalAmountCents);
    }

    /**
     * @notice Gets a customer's current deposited balance.
     */
    function getBalance()
      public
      view
      returns (uint)
    {
        return balances[msg.sender];
    }

    /**
     * @notice Gets whether a customer is authorized to use this service or not.
     */
    function isAuthorized()
      public
      view
      returns (bool)
    {
        return authorizations[msg.sender];
    }

    /**
     * @notice Default function. Sending ether is not allowed.
     *         Instead, use deposit().
     */
    function()
      external
      payable
    {
        revert("Please use deposit() instead");
    }
}