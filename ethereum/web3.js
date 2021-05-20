import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
   
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/ed6a109743ab428c81d44a64d58bb75a"
    );
    web3 = new Web3(provider);
}

//Returns our version of web3 with metamask provider irrespective of web3 version injected by metamask  
export default web3;