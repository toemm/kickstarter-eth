const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const MNEMONIC =
  "orient flash little steel boss avocado devote measure alpha define bar deer";
const NETWORK_URL = "https://rinkeby.infura.io/Fa2azoIr5iBF85owGAac";

const provider = new HDWalletProvider(MNEMONIC, NETWORK_URL);

const web3 = new Web3(provider);

// Ähnlich wie in beforeEach(), außer Deploy in Testnetwork Rinkeby anstatt lokales ganashe Network
// Funktion deploy(), damit async/await Syntax verwendbar
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to: ", result.options.address);
};

deploy();
