# ETH -> EUR Exchange

This repository contains an ethereum DApp whose target is to offer to exchange ETH for EUR in a seamless way.
All operations are performed through the main smart contract, and it also includes a web frontend made with React.



## Table of contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Components](#components)
    - [Oracle](#oracle)
    - [Exchange](#exchange)
- [Libraries](#libraries)
- [Testing](#testing)
- [Testnet](#testnet)



## Requirements

- `truffle`
- `node`



## Setup

It will be necessary to open three terminals in `./ethereum`:

Install the dependencies:

```bash
$ npm install
```

Launch the testing blockchain in port 7545:

```bash
$ truffle develop
```

Launch the oracle service:

```bash
$ npm run bridge
```

Compile and migrate the contracts in the testnet:

```bash
$ npm run migrate
```

To start the frontend project:

```bash
$ cd ./client
$ npm install
$ npm run start
```



## Components


### Oracle

The system uses an [oracle](ethereum/contracts/EUROracle.sol) that provides the ETH->EUR exchange rate.
Its implementation uses [oraclize](https://docs.provable.xyz/) so that each time a query is performed an event is
broadcasted and captured by that company, who executes the URL call and extract the correct value from the response.
Once the data has been retrieved it calls the contract's ``__callback(bytes32,string)`` function, which parses the
result and sets the number of euro cents worth one ether.

It's worth mentioning that right now the available version of the contracts in EthPM is valid for solidity 0.4, but
this project uses the version 0.5, which made impossible to use EthPM to fetch the contract. Instead, they have been
directly imported from github through [package.json](./ethereum/package.json). Once the EthPM repository gets updated
it will be necessary to update the [ethpm.json](./ethereum/ethpm.json) file like this:

```json
{

  
  "dependencies": {
    "oraclize-api": "^1.0.0"
  }
}
```

### Exchange

This contract actually performs exchange operations. It is composed of owner and customer sections:

#### Functionality for owner

- Grant and deny authorizations to use the service.
- Emergency stop to block all non-owner public functions.
- Collect earnings.
- Set the fee.
- Set the oracle address.
- Set the minimum amount to be traded.
- Transfer ownership.

#### Functionality for customers

- Request authorization to the owner.
- Deposit funds in the contract to be exchanged at a later moment.
- Exchange ETH for EUR.
- Withdraw previously deposited amounts.
- Check what is the current raw and final amount in EUR given the amount of ETH to trade.
- Check the current deposited balance.
- Check whether the customer is authorized to use the service or not.
 


## Libraries

This project uses two libraries:

- [usingOraclize](https://github.com/provable-things/ethereum-api/blob/master/oraclizeAPI_0.5.sol) from Provable API.
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)'s `SafeMath` and `Ownable`. 


## Testing

Firstly open the truffle testnet blockchain and oracle service:

```bash
$ truffle develop 
```

```bash
$ npm run bridge
```

Once deployed simply run the following in the truffle console:

```
truffle(develop)> test
```


## Testnet

The main contract is deployed in [rinkeby](https://rinkeby.etherscan.io/address/0x08E53CE9ff69f56E6B033c644e851767fb4032c6).
Feel free to interact with it or deploy your own.

In order to verify it on Etherscan it has been necessary to install [solpp](https://github.com/merklejerk/solpp). Later simply running

```bash
$ solpp --output flattened.sol contracts/EURExchange.sol
```

provides the full flattened version of the contract. Afterwards simply select whether there is optimization or not, and 
the compiler version. I recommend selecting the single file option to verify it.

### Host in IPFS

The frontend can be hosted in IPFS. In order to do so follow these steps:

- Run the daemon:

```bash
$ ipfs daemon
```

- Generate the client's production build:

```bash
$ cd client
$ npm run build
```

- Add the files to IPFS:

```bash
$ ipfs add -r client/build
```

After that simply access http://127.0.0.1:8080/ipfs/QmX9aeCWZWxSsxDVBavd5yNKbZKRqsnwJYEoWTFS7khHhJ/ and you can
start interacting with the DApp.