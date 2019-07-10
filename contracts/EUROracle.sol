pragma solidity ^0.5.0;

import "./UsingOraclize.sol";


contract EUROracle is usingOraclize {
    uint public ETHEUR;
    bytes32 public lastCallId;
    string public query = "json(https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR).EUR";
    address owner;
    
    modifier onlyOwner()
    {
        require(msg.sender == owner);
        _;
    }
    
    event RateUpdated(uint newValue);
    event FundsReceived(uint funds);

    constructor()
      public
      payable
    {
        owner = msg.sender;
        
        // even though it works on testnet, in ganache it doesn't as there's no infrastructure
        // hence this line is commented out to be able to work with ganache
        // update();  // first time it's for free!
        logFundsReceived();
    }

    function __callback(bytes32 _id, string memory _result)
      public
    {
        require(msg.sender == oraclize_cbAddress());
        require(_id == lastCallId);
        ETHEUR = parseInt(_result, 2);
        emit RateUpdated(ETHEUR);
    }
    
    function logFundsReceived()
      private
    {
        if (msg.value > 0) {
            emit FundsReceived(msg.value);
        }
    }

    function update()
      public
      payable
      onlyOwner
    {
        logFundsReceived();
        lastCallId = oraclize_query("URL", query);
    }

    /**
     * Returns 1 ETH in EUR cents
     */
    function EUR()
      public
      view
      returns (uint)
    {
        return ETHEUR;
    }
    
    /**
     * Returns 1 EUR in WEI
     */
    function WEI()
      public
      view
      returns (uint)
    {
        return 1 ether / ETHEUR;
    }
    
    function setQuery(string memory _query)
      public
      onlyOwner
    {
        query = _query;
    }
    
    /**
     * To manually set the price in case services are down.
     */
    function setETHEUR(uint _ETHEUR)
      public
      onlyOwner
    {
        ETHEUR = _ETHEUR;
    }
      

    function()
      external
      payable
    {
        logFundsReceived();
    }
}
