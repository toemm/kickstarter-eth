import Web3 from "web3";

const NETWORK_URL = "https://rinkeby.infura.io/Fa2azoIr5iBF85owGAac";

let web3;

// Check, ob Code auf Node Server oder im Browser ausgeführt wird
if (typeof window  !== "undefined" && typeof window.web3 !== "undefined") {
  // Im Browser, window = object  UND  MetaMask intalliert (web3 inject)
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Im Server oder User hat MetaMask nicht installiert
  const provider = new Web3.providers.HttpProvider(NETWORK_URL);

  web3 = new Web3(provider);
}

export default web3;