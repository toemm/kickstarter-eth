pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    
    function createCampaign(uint256 minContribution) public {
        address addr = new Campaign(minContribution, msg.sender);   // neuer Contract mit new Campaign
        deployedCampaigns.push(addr);
    }
    
    function getDeployedContracts() public view returns(address[]) {
        return deployedCampaigns;
    }
    
}



contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;     // const searchtime, vorteil ggü. lists, wenn iteriert werden muss!
        uint256 approvalCount;
    }
    
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint256 approversCount;
    
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function changeContributionMin(uint256 newMin) public {
        minimumContribution = newMin;
    }
    
    function approveRequest(uint256 index) public {
        Request storage request = requests[index];  // referenz auf Request Objekt, keine Kopie! (memory keyword)
        
        require(approvers[msg.sender]);
        require(!request.complete);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function createRequest(string description, uint256 value, address recipient) public onlyManager {
        // newRequest kann kein Pointer (storage keyword)  zugewiesen werden, da Request ein Objekt in Memory erzeugt
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function finalizeRequest(uint256 index) public onlyManager {
        Request storage request = requests[index];
        
        require(!request.complete);
        require (request.approvalCount > (approversCount / 2));  // atleast 50% of contributers need to vote Yes
    
        request.complete = true;
        request.recipient.transfer(request.value);
    }
    

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    

}