const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 1000000 });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: 1000000
  });

  [campaignAddress] = await factory.methods.getDeployedContracts().call(); // Array Destructuring

  // lokale Repräsentation des schon erstellten Campaign Contracts
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows ppl to contribute and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 50000
    });

    // funktioniert so approvers(KEY) returns(VAL) from mapping, returned nicht das ganze mapping
    const approved = await campaign.methods.approvers(accounts[1]).call();
    assert(approved);
  });

  it("minimum contribution required", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: 50
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it("manager can make a request", async () => {
    await campaign.methods
      .createRequest("testRequest", "5000", accounts[5])
      .send({
        from: accounts[0],
        gas: "1000000"
      });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request["description"], "testRequest");
  });

  it("processes requests", async () => {
    let initBalance = await web3.eth.getBalance(accounts[1]); // zum Vergleich der Balance zu unten
    initBalance = web3.utils.fromWei(initBalance, "ether");
    initBalance = parseFloat(initBalance);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    await campaign.methods
      .createRequest("testRequest", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > initBalance + 4.8);
  });
});
