const EURExchange = artifacts.require("EURExchange");
const EUROracle = artifacts.require("EUROracle");
const truffleAssert = require('truffle-assertions');


contract("EURExchange", accounts => {
    const owner = accounts[0];
    const customer = accounts[1];
    const rate = 20000;
    let contract;
    let oracle;

    beforeEach(async () => {
        oracle = await EUROracle.new();
        contract = await EURExchange.new(oracle.address);
        await oracle.setRateRaw(rate.toString());
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
        const tx = await contract.transferOwnership(newOwner);
        contractOwner = await contract.owner();
        assert.equal(contractOwner, newOwner, 'The owner is not the new one');
        truffleAssert.eventEmitted(tx, 'OwnershipTransferred', event => {
            return event.previousOwner === owner && event.newOwner === customer;
        });
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
        let tx = await contract.exchange(1e18.toString(), {from: customer, value: 1e18.toString()});
        truffleAssert.eventEmitted(tx, 'ExchangeRequested', event => {
            return event.customer === customer &&
                event.amountWei.toString() === 1e18.toString() &&
                event.rawAmountCents.toString() === rate.toString() &&
                event.finalAmountCents.toString() === (rate * 98 / 100).toString();
        });
        ownerBalance = await contract.ownerBalance();
        assert.equal(ownerBalance, 1e18, 'After performed exchange the balance should be 1 ETH');
        tx = await contract.collectBalance();
        ownerBalance = await contract.ownerBalance();
        assert.equal(ownerBalance, 0, 'Finally the balance should be zero');
        truffleAssert.eventEmitted(tx, 'BalanceCollected', event => {
            return event.balance.toString() === 1e18.toString();
        });
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
        } catch (e) {
        }
    });

    it('should deposit the correct amount', async () => {
        let balance = await contract.getBalance({from: customer});
        assert.equal(balance, 0, 'Initially the balance should be zero');
        const amount = 1e18.toString();
        const tx = await contract.deposit({value: amount, from: customer});
        balance = await contract.getBalance({from: customer});
        assert.equal(balance, amount, 'Balance should be 1 ETH after deposit');
        truffleAssert.eventEmitted(tx, 'DepositPerformed', event => {
            return event.customer === customer &&
                event.amount.toString() === amount &&
                event.balance.toString() === amount;
        });
    });

    it('should not allow a non-authorized customer to deposit funds', async () => {
        const amount = 1e18.toString();
        try {
            await contract.deposit({value: amount, from: accounts[2]});
            assert.fail('A non-authorized customer cannot deposit funds');
        } catch (e) {
        }
    });

    it('should not allow a non-authorized customer to exchange funds', async () => {
        const amount = 1e18.toString();
        try {
            await contract.exchange(amount, {value: amount, from: accounts[2]});
            assert.fail('A non-authorized customer cannot exchange funds');
        } catch (e) {
        }
    });

    it('should fail if trying to withdraw with invalid balance', async () => {
        try {
            await contract.withdraw();
            assert.fail('It must not be possible to withdraw with a balance of zero');
        } catch (e) {
        }

        try {
            await contract.withdraw(1e18);
            assert.fail('It must not be possible to withdraw more than current balance');
        } catch (e) {
        }
    });

    it('should withdraw the amount if available', async () => {
        await contract.deposit({value: 2e18.toString(), from: customer});
        let balance = await contract.getBalance({from: customer});
        assert.equal(balance, 2e18, 'The balance should be 2 ETH before withdraw');
        const tx = await contract.withdraw({from: customer});
        balance = await contract.getBalance({from: customer});
        assert.equal(balance, 0, 'The balance should be 0.5 ETH after withdraw');
        truffleAssert.eventEmitted(tx, 'WithdrawPerformed', event => {
            return event.customer === customer &&
                event.amount.toString() === 2e18.toString() &&
                event.balance.toString() === '0';
        });
    });

    it('should return the correct amounts when calling getExchangeAmounts()', async () => {
        const result = await contract.getExchangeAmounts(1e18.toString());
        assert.equal(result['0'].toString(), rate.toString(), 'The raw amount should be 200 EUR');
        assert.equal(result['1'].toString(), (rate * 98 / 100).toString(), 'The final amount should be 196 EUR');
    });

    it('should restrict certain functions to the owner', async () => {
        const functions =  [
            ['grantAuthorization', [accounts[2]]],
            ['denyAuthorization', [accounts[2]]],
            ['collectBalance', []],
            ['setFeePercentage', ['5']],
            ['setOracle', [accounts[5]]],
            ['setMinAmount', [1e18.toString()]]
        ];
        functions.forEach(async (func) => {
            const funcName = func[0];
            const args = func[1];
            try {
                await contract[funcName](...args, {from: customer});
                assert.fail(`A customer should not be able to call ${funcName}`);
            } catch (e) {
            }
        });
    });

    it('should stop functioning if the owner commands it', async () => {
        let status = await contract.stopped();
        assert.ok(!status, 'The contract should be initially active');
        await contract.toggleContractActive();
        status = await contract.stopped();
        assert.ok(status, 'The contract should have been stopped');
        const account = accounts[2];
        const functions = [
            ['deposit', [1e18.toString(), {value:1e18.toString(), from: account}]],
            ['exchange', [1e18.toString(), {value:1e18.toString(), from: account}]],
            ['withdraw', [{from: account}]],
        ];
        functions.forEach(async (func) => {
            const funcName = func[0];
            const args = func[1];
            try {
                await contract[funcName](...args,);
                assert.fail(`${funcName} is supposed not to be working right now`);
            } catch (e) {
            }
        });
    });
});
