pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract EURExchange is Ownable
{
    address rateOracle;
    
    constructor(address _rateOracle)
      Ownable()
      public
    {
        rateOracle = _rateOracle;
    }
}