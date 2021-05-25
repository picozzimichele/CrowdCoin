const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
const mnemonic = process.env.ACCOUNT_MNEMONIC;
const network = process.env.RINKEBY_ENDPOINT;

//Deployed to: 0x6F7f1c7E6793C0137B485b1fba2ee397eF2a2C64

const provider = new HDWalletProvider(
    "kingdom abandon resist ring job trick expect exact bread quit anxiety capable",
    "https://rinkeby.infura.io/v3/ed6a109743ab428c81d44a64d58bb75a"
);

const provider = new HDWalletProvider(mnemonic, network);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
     .deploy({data: compiledFactory.evm.bytecode.object}) // add 0x bytecode
     .send({from: accounts[0]}); // remove 'gas'

    console.log(compiledFactory.abi)
    console.log("contract deployed to", result.options.address);
};

deploy();