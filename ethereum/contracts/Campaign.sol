// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    //should this be a constructor??
    function createCampaign (uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {
    
    //this struct definition does not create a variable, is not an instance of a variable is a type
    struct Request {
        string description;
        uint value;
        address payable recipient; //payable maybe?
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    mapping(uint => Request) public requests; //this create a struct Request type mapping named requests
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint private currentIndex = 0;
    uint public approversCount = 0;
    
    modifier restricted() { //this gives a code that we can add to all the function
        require(msg.sender == manager); //this allowes only the manager of the contract to execute
        _; //this is where the code of the function follows
    }
    
    //the manager decides what is the minimum contribution when making a Campaign
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        //check if the amount sent is grater than minimum required by the manager
        require(msg.value > minimumContribution); 
        
        //we add the sender of the transaction to the approvers mapping and set it as true, only the boolean value gets stored
        approvers[msg.sender] = true;
        
        //keep track of total number of contributors
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address payable recipient) payable public restricted {
        
        require(value <= address(this).balance);
        Request storage newRequestInStorage = requests[currentIndex];
        newRequestInStorage.description = description;
        newRequestInStorage.value = value;
        newRequestInStorage.recipient = recipient;
        newRequestInStorage.complete = false;
        newRequestInStorage.approvalCount = 0;
        currentIndex++;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        //if the address has donated (aka is in approvers) the boolean is true
        require(approvers[msg.sender]); 
        //if the person has not voted yet he can (false if he has not voted!)
        require(!request.approvals[msg.sender]);
        
        //recoding the new vote in the mapping
        request.approvals[msg.sender] = true;
        //increase the vote as yes
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        //check if the total approve votes are more than 50% of people who contributed in the Campaign
        require(request.approvalCount > (approversCount/2));
        
        //check if the request is already completed or not
        require(!request.complete);
        
        //send the money to the address specified in the request
        request.recipient.transfer(request.value);
        //change the request as complete
        request.complete = true;
    }

    function getSummary() public view returns( uint, uint, uint, uint, address ) {
        return (
            minimumContribution,
            address(this).balance,
            currentIndex,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint)  {
        return currentIndex;
    }
}