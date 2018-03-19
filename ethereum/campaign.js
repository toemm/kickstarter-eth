import web3 from "./web3";
import Campaign from "./build/Campaign.json";

// Funktion erhält Addresse des deployten Campaign Contracts 
// und erstellt lokales Contract Objekt, dessen Methoden aufgerufen werden können
// um mit dem Contract zu interagierne
export default address => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};
