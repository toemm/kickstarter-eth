import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const DEPLOYED_CONTRACT_ADDRESS = "0x5A5EEc2D8C28CDE9ff04ECBDdc7f13622DE9A53d";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  DEPLOYED_CONTRACT_ADDRESS
);

export default instance;
