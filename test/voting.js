const Voting = artifacts.require("Voting");
const FreeSpeechCoin = artifacts.require("FreeSpeechCoin");

contract("Voting", accounts => {
  
  before(async () =>{
    fsc_instance = await FreeSpeechCoin.deployed();
    voting_instance = await Voting.deployed();
  })

  it("deployed voting", async () => {
    console.log(accounts);
    // const instance = await Voting.deployed();
    // console.log(instance);
    var r = await voting_instance.registerCandidate(fsc_instance.address, accounts[1], "包子");
    console.log("register result : " + r);
    var res = await voting_instance.getCandidateNames();
    console.log(res);
    var num = await voting_instance.getCandidateVotesByName(res[0]);
    console.log(res[0] + " have vote :" + num);
    console.log(num.toString());
    
    
  });

});
