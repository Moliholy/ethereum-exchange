pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "ethereum-api/oraclizeAPI_0.5.sol";

/**
 *  @title Oracle to get ETH->EUR and EUR->ETH rates.
 *  @author José Molina Colmenero
 *  @notice Rates are not guaranteed to be up to date.
 */
contract EUROracle is usingOraclize, Ownable
{
    /////////// Attributes ///////////
    uint internal rate;
    bytes32 public lastCallId;
    uint public lastUpdated;
    string public query = "json(https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR).EUR";


    /////////// Events ///////////
    event RateUpdated(uint rate);
    event FundsReceived(uint funds);


    /////////// Owner-only functions ///////////

    /**
     * @notice Creates a new contract. It is possible to pre-load the contract with ether.
     *         Provable API will be called upon creation to set the prices. The first
     *         time it is for free, so it is not strictly necessary to pre-load it with
     *         ether.
     */
    constructor() Ownable()
      public
      payable
    {
        update();  // first time it's for free!
        logFundsReceived();
    }

    /**
     * @notice Trigger the query to Provable to get the ETH->EUR exchange rate.
     * @dev It is possible to refill the contract along with this invocation.
     * @dev Careful: this function consumes a lot of gas.
     */
    function update()
      public
      payable
      onlyOwner
    {
        logFundsReceived();
        lastCallId = oraclize_query("URL", query);
    }

    /**
     * @notice To manually set the price in case services are down.
     * @param _rate The ETH->EUR rate to be manually set.
     */
    function setRateRaw(uint _rate)
      external
      onlyOwner
    {
        setRate(_rate);
    }

    /**
     * @notice Manually set the query in case the service is off.
     * @param _query string that represents URL and operations to perform in order to get the exchange rate.
     * @dev owner-restricted operation.
     */
    function setQuery(string memory _query)
      public
      onlyOwner
    {
        query = _query;
    }


    /////////// Private and internal functions ///////////

    /**
     * @notice To set the exchange rate and update the timer.
     * @param _rate the ETH->EUR exchange rate.
     */
    function setRate(uint _rate)
      internal
    {
        rate = _rate;
        lastUpdated = block.number;
        emit RateUpdated(rate);
    }


    /////////// Public and external functions ///////////

    /**
     * @notice Callback function to be invoked by Provable in order to set the ETH->EUR exchange rate.
     * @param _id ID of the last request to Provable.
     * @param _result ETH->EUR exchange rate as a string.
     */
    function __callback(bytes32 _id, string memory _result)
      public
    {
        require(msg.sender == oraclize_cbAddress(), "This address can not perform this operation");
        require(_id == lastCallId, "This call ID does not correspond to the last requested one");

        uint newRate = parseInt(_result, 2);
        setRate(newRate);
    }

    /**
     * @notice Log the amount sent to the contract, if any.
     * @dev this function must be private as it's used internally only.
     */
    function logFundsReceived()
      internal
    {
        if (msg.value > 0) {
            emit FundsReceived(msg.value);
        }
    }


    /**
     * @notice Returns 1 ETH in EUR cents.
     * @return the number of euros (in cents) worth one ether.
     */
    function EUR()
      public
      view
      returns (uint)
    {
        return rate;
    }

    /**
     * @notice Returns 1 EUR in WEI.
     * @return the number of weis worth one EUR.
     */
    function WEI()
      public
      view
      returns (uint)
    {
        return 1 ether / rate;
    }

    /**
     * @notice Used to refill the oracle by sending ether.
     */
    function()
      external
      payable
    {
        logFundsReceived();
    }
}
