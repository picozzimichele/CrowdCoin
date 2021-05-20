const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

//create an instance of web3 with ganache as the provider
const web3 = new Web3(ganache.provider());

//require the two different builds 
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: 3000000 });

    //creating the campaing from the CampaignFactory method    
    await factory.methods.createCampaign("100").send({
        from: accounts[0],
        gas: 1000000
    })

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
});

describe("Campaigns", () => {
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("marks caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);
    });

    it("allows people to contribute and marks them as approvers", async() => {
        await campaign.methods.contribute().send({
            value: 200,
            from: accounts[1]
        });
        const address1 = await campaign.methods.approvers(accounts[1]).call()
        assert.strictEqual(address1, true);
    });

    it("requires a minimum contribution", async () => {
        try{
            await campaign.methods.contribute().send({
                value: 50,
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it("allows manager to make a payment request", async () => {
        await campaign.methods
            .createRequest("Buy Batteries", 100, accounts[1]).send({
                from: accounts[0],
                gas: 1000000
        }); 

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual("Buy Batteries", request.description);
    });

    it("processes requests", async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei("10", "ether")
        });

        await campaign.methods
         .createRequest("Buy batteries", web3.utils.toWei("5", "ether"), accounts[1])
         .send({
             from: accounts[0],
             gas: 1000000
         });

         await campaign.methods.approveRequest(0).send({
             from: accounts[0],
             gas: 1000000
         });

         await campaign.methods.finalizeRequest(0).send({
             from: accounts[0],
             gas: 1000000
         });

         let balance = await web3.eth.getBalance(accounts[1]);
         balance = web3.utils.fromWei(balance, "ether");
         balance = parseFloat(balance);

         console.log(balance)
         assert(balance > 104)
    });
});