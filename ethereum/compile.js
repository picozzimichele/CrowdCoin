const path = require("path");
const solc = require("solc");
//fs gives access to the file systems
const fs = require("fs-extra"); 

const buildPath = path.resolve(__dirname, 'build');

//removes the build folder with a single command
fs.removeSync(buildPath); 

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

//read contents of file with encoding
const source = fs.readFileSync(campaignPath, "utf8");

var input = {
    language: 'Solidity',
    sources: {
        "Campaign.sol" : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

//the output from the contracts folder (Campaign and campaigFactory)
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => {
      console.log(err.formattedMessage);
    });
  } else {
    const contracts = output.contracts["Campaign.sol"];
    fs.ensureDirSync(buildPath);
    for (let contractName in contracts) {
      const contract = contracts[contractName];
      fs.writeFileSync(
        path.resolve(buildPath, `${contractName}.json`),
        JSON.stringify(contract, null, 2),
        "utf8"
      );
    }
  }

