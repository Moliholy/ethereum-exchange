const EURExchange = artifacts.require("EURExchange");
const EUROracle = artifacts.require("EUROracle");
const truffleAssert = require('truffle-assertions');


contract("EURExchange", accounts => {
    const owner = accounts[0];
    const customer = accounts[1];
    let contract;
    let oracle;

    beforeEach(async () => {
        oracle = await EUROracle.new();
        contract = await EURExchange.new(oracle.address);
        await oracle.setRateRaw('20000');
        await contract.grantAuthorization(customer);
    });


    it('should return the true owner when calling owner()', async () => {
        const contractOwner = await contract.owner();
        assert.equal(contractOwner, owner, 'Owner is not valid');
    });

    it('should transfer ownership correctly', async () => {
        let contractOwner = await contract.owner();
        assert.equal(contractOwner, owner, 'The owner is not the original one');
        const newOwner = customer;
        await contract.transferOwnership(newOwner);
        contractOwner = await contract.owner();
        assert.equal(contractOwner, newOwner, 'The owner is not the new one');
    });

    it('should grant authorization to the customer', async () => {
        const otherCustomer = accounts[2];
        let authorized = await contract.isAuthorized({from: otherCustomer});
        assert.ok(!authorized, 'Initially it must not be authorized');
        await contract.grantAuthorization(otherCustomer);
        authorized = await contract.isAuthorized({from: otherCustomer});
        assert.ok(authorized, 'It must be authorized');
    });

    it('should deny an authorization', async () => {
        let authorized = await contract.isAuthorized({from: customer});
        assert.ok(authorized, 'It must be authorized');
        await contract.denyAuthorization(customer);
        authorized = await contract.isAuthorized({from: customer});
        assert.ok(!authorized, 'It must not be authorized after denial');
    });

    it("should successfully collect the owner's balance", async () => {
        let ownerBalance = await contract.ownerBalance();
        assert.equal(ownerBalance, 0, 'Initially the balance should be zero');
        await contract.exchange(1e18.toString(), {from: customer, value: 1e18.toString()});
        ownerBalance = await contract.ownerBalance();
        assert.equal(ownerBalance, 1e18, 'After performed exchange the balance should be 1 ETH');
        await contract.collectBalance();
        ownerBalance = await contract.ownerBalance();
        assert.equal(ownerBalance, 0, 'Finally the balance should be zero');
    });

    it('should correctly set the feePercentage attribute', async () => {
        let feePercentage = await contract.feePercentage();
        assert.equal(feePercentage, 2, 'feePercentage should initially be 2');
        await contract.setFeePercentage('5');
        feePercentage = await contract.feePercentage();
        assert.equal(feePercentage, 5, 'The new feePercentage value should be 5');
    });

    it('should change the oracle address', async () => {
        const oracleAddress = await contract.oracle();
        const newOracleAddress = accounts[6];
        await contract.setOracle(newOracleAddress);
        assert.notEqual(oracleAddress, newOracleAddress, 'Oracle address must have changed');
    });

    it('should correctly set the minAmount attribute', async () => {
        let minAmount = await contract.minAmount();
        assert.equal(minAmount, 1e17, 'minAmount should initially be 0.1 ETH');
        await contract.setMinAmount(5e17.toString());
        minAmount = await contract.minAmount();
        assert.equal(minAmount, 5e17, 'the new minAmount value should be 0.5 ETH');
    });

    it('should successfully request authorization', async () => {
        const account = accounts[2];
        const tx = await contract.requestAuthorization({from: account});
        truffleAssert.eventEmitted(tx, 'AuthorizationRequested', event => {
            return event.customer === account;
        });
    });

    it('should not allow an authorized customer to request a new one', async () => {
        try {
            await contract.requestAuthorization({from: customer});
            assert.fail('An already authorized customer cannot request more authorizations');
        } catch(e) {}
    });

});
