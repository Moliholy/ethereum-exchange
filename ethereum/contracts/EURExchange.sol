pragma solidity ^0.5.0;

import "./EUROracle.sol";
import "./Stoppable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract EURExchange is Stoppable
{
    // Libraries
    using SafeMath for uint;
    
    // Attributes
    EUROracle public oracle;
    uint public ownerBalance;
    uint public feePercentage = 2;
    mapping(address => uint) public balances;
    mapping(address => bool) public authorizations;
    
    // Events
    event BalanceCollected(uint balance);
    event ExchangeRequested(address customer, uint amountWei, uint rawAmountCents, uint finalAmountCents);
    event WithdrawPerformed(address customer, uint amount, uint balance);
    event DepositPerformed(address customer, uint amount, uint balance);
    
    // Modifiers
    modifier authorized()
    {
        require(isAuthorized(), "This address is not authorized");
        _;
    }
    
    // Owner-only functions
    constructor(address payable _oracle) Stoppable()
      public
    {
        oracle = EUROracle(_oracle);
    }
    
    function grantAuthorization(address _authorizedAddress)
      external
      onlyOwner
    {
        require(_authorizedAddress != owner(), "Owner can not be a participant");
        
        authorizations[_authorizedAddress] = true;
    }
    
    function denyAuthorization(address _unauthorizedAddress)
      external
      onlyOwner
    {
        authorizations[_unauthorizedAddress] = false;
    }
    
    function collectBalance()
      external
      onlyOwner
    {
        uint balance = ownerBalance;
        ownerBalance = 0;
        emit BalanceCollected(balance);
        msg.sender.transfer(balance);
    }
    
    function setFeePercentage(uint _feePercentage)
      external
      onlyOwner
    {
        require(_feePercentage <= 100, "feePercentage has to be between 0 and 100");
        
        feePercentage = _feePercentage;
    }
    
    function setOracle(address payable _oracle)
      external
      onlyOwner
    {
        require(_oracle != address(0), "Oracle address must not be null");
        
        oracle = EUROracle(_oracle);
    }
    
    // Public functions
    function deposit()
      public
      payable
      authorized
      stopInEmergency
    {
        if (msg.value > 0) {
            balances[msg.sender] += msg.value;
            emit DepositPerformed(msg.sender, msg.value, getBalance());
        }
    }
    
    function exchange(uint _amount)
      public
      payable
      authorized
      stopInEmergency
    {
        deposit();
        require(getBalance() >= _amount, "Insufficient funds");
        
        (uint rawAmountCents, uint finalAmountCents) = getExchangeAmounts(_amount);
        balances[msg.sender] -= _amount;
        ownerBalance += _amount;
        emit ExchangeRequested(msg.sender, _amount, rawAmountCents, finalAmountCents);
    }
    
    function withdraw()
      public
      stopInEmergency
    {
        uint amount = getBalance();
        withdraw(amount);
    }
    
    function withdraw(uint _amount)
      public
      stopInEmergency
    {
        require(_amount > 0 && _amount <= getBalance(), "Invalid balance for this account");
        
        balances[msg.sender] -= _amount;
        emit WithdrawPerformed(msg.sender, _amount, getBalance());
        msg.sender.transfer(_amount);
    }
    
    function getExchangeAmounts(uint _amount)
      public
      view
      returns (uint, uint)
    {
        uint rawAmountCents = oracle.EUR().mul(_amount).div(1 ether);
        uint finalAmountCents = rawAmountCents.mul(100 - feePercentage).div(100);
        assert(finalAmountCents < rawAmountCents);
        
        return (rawAmountCents, finalAmountCents);
    }
    
    function getBalance()
      public
      view
      returns (uint)
    {
        return balances[msg.sender];
    }
    
    function isAuthorized()
      public
      view
      returns (bool)
    {
        return authorizations[msg.sender];
    }
    
    function()
      external
      payable
    {
        revert("Please use deposit() instead");
    }
}