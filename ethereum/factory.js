import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(CampaignFactory.abi, "0x6F7f1c7E6793C0137B485b1fba2ee397eF2a2C64");

export default instance;