pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract Stoppable is Ownable
{
    bool private stopped = false;

    modifier stopInEmergency {
        require(!stopped, "Stoppable: this contract has its functionality stopped for security reasons");
        _;
    }

    constructor() Ownable()
      public
    {}

    function toggleContractActive()
      external
      onlyOwner
    {
        stopped = !stopped;
    }
}