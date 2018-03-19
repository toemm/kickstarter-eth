import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const DEPLOYED_CONTRACT_ADDRESS = "0xC4E0fc7f97b448d15c48C6c819e0Dd35B55cdF99";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  DEPLOYED_CONTRACT_ADDRESS
);

export default instance;
