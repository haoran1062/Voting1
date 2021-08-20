pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "./FreeSpeechCoin.sol";

interface FreeSpeechCoinInterface{
    function balanceOf(address _addr) external view returns(uint256);
    function transferFrom(address _from, address _to, uint256 amount) external view returns(bool);
}

contract Voting{
    struct User{
        address voterAddress;
        string nickName;
        uint256 usedCoin;
        uint256 totalCoin;
        
    }
    // string[] public CandidateNameList;
    User[] public userList;
    // FreeSpeechCoin fscoin_instance = FreeSpeechCoin(msg.sender);

    mapping(string => uint256) public votesReceived;

    constructor() {
        // uint256 user_coins = fscoin_instance.balanceOf(msg.sender);
        // uint256 user_coins = FreeSpeechCoin.balanceOf(msg.sender);
        // uint256 user_coins = 0;
        // User memory user = User(msg.sender, 'Matrix', 0, user_coins);
        // userList.push(user);
        // votesReceived['Matrix'] = 0; 
    }

    function getCandidateNames() view public returns(string[] memory){
        // uint n = 1;
        string[] memory nameList = new string[](userList.length);
        for(uint i = 0; i < userList.length; i++){
            nameList[i] = userList[i].nickName;
        }
        return nameList;
    }

    function registerCandidate(address token_addr, address _addr, string memory name) public returns(bool){
        if(isExistedCandidate(_addr, name)){
            return false;
        }
        FreeSpeechCoinInterface FSCI = FreeSpeechCoinInterface(token_addr);
        uint256 user_coins = FSCI.balanceOf(_addr);
        // uint256 user_coins = 0;
        User memory user = User(_addr, name, 0, user_coins);
        userList.push(user);
        votesReceived[name] = 0;
        return true;
    }

    function getCandidateVotesByName(string memory name) view public returns(uint){
        require(ValidCandidate(name));
        return votesReceived[name];

    }

    function voteForCandidate(address token_addr, address _from, string memory candidate, uint256 votecoins) public payable returns(uint){
        require((ValidCandidate(candidate)));
        require(getBalanceInFSCoin(token_addr, _from) >= votecoins);
        votesReceived[candidate] += votecoins;
        for(uint256 i = 0; i < userList.length; i++){
            if (userList[i].voterAddress == _from){
                userList[i].usedCoin += votecoins;
                userList[i].totalCoin -= votecoins;
                break;
            }
        }
        FreeSpeechCoinInterface FSCI = FreeSpeechCoinInterface(token_addr);
        FSCI.transferFrom(_from, msg.sender, votecoins);
        return votesReceived[candidate];
    }

    function totalVotesFor(string memory candidate) view public returns(uint){
        require(ValidCandidate(candidate));
        return votesReceived[candidate];
    }

    function isExistedCandidate(address _addr, string memory name) view public returns(bool){
        for(uint256 i = 0; i < userList.length; i++){
            if(keccak256(abi.encodePacked(userList[i].nickName)) == keccak256(abi.encodePacked(name))){
                return true;
            }
            if (_addr == userList[i].voterAddress){
                return true;
            }
        }
        return false;
    }

    function ValidCandidate(string memory name) view public returns(bool){
        for(uint256 i = 0; i < userList.length; i++){
            if(keccak256(abi.encodePacked(userList[i].nickName)) == keccak256(abi.encodePacked(name))){
                return true;
            }
        }
        return false;
    }

    function getVotes(string memory candidate) view public returns(uint){
        return votesReceived[candidate];
    }

    function getBalanceInFSCoin(address token_addr, address _addr) view public returns(uint256){
        FreeSpeechCoinInterface FSCI = FreeSpeechCoinInterface(token_addr);
        return FSCI.balanceOf(_addr);
    }

    function getUsedFSCoin(address _addr) view public returns(uint256){
        for(uint256 i = 0; i < userList.length; i++){
            if(userList[i].voterAddress == _addr){
                return userList[i].usedCoin;
            }
        }
        return 0;
    }

    
}