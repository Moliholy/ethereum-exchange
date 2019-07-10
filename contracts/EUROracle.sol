pragma solidity ^0.5.0;
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.5.sol";


contract EUROracle is usingOraclize {
    uint public ETHEUR;
    bytes32 public lastCallId;
    
    event RateUpdated(uint newValue);

    constructor()
      public
      payable
    {
        update();
    }

    function __callback(bytes32 _id, string memory _result)
      public
    {
        require(msg.sender == oraclize_cbAddress());
        require(_id == lastCallId);
        ETHEUR = parseInt(_result, 2);
        emit RateUpdated(ETHEUR);
    }

    function update()
      public
      payable
    {
        require(address(this).balance >= oraclize.getPrice("URL"));
        lastCallId = oraclize_query("URL", "json(https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR).EUR");
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
}
