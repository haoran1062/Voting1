import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import voting_artifacts from '../../build/contracts/Voting.json';

let candidates = {'Alice':'candidate-0', 'Bob':'candidate-1', 'Cary':'candidate-2'};

const App = {
  web3: null,
  account: null,
  meta: null,
  Voting: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log("chain id : " + networkId)
      
      const deployedNetwork = voting_artifacts.networks[networkId];
      // const deployedNetwork = metaCoinArtifact.networks[networkId];
      console.log("deployedNetwork: " + deployedNetwork)

      // this.meta = new web3.eth.Contract(
      //   metaCoinArtifact.abi,
      //   deployedNetwork.address,
      // );

      this.Voting = new web3.eth.Contract(
        voting_artifacts.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      console.log(this.account)

      // this.refreshBalance();
      let candidateNames = Object.keys(candidates);
      console.log(candidateNames)
      const { totalVotesFor } = this.Voting.methods;
      for(let i = 0; i < candidateNames.length; i++){
        let name = candidateNames[i];
        // console.log(typeof(name) + name)
        let nowVote = await totalVotesFor(name).call();
        console.log(name + ' ' + nowVote + ' ' + i)
        $("#candidate-" + i).html(nowVote); 
        
      }
      
    } catch (error) {
      console.error("Could not connect to contract or chain. :" + error);
    }
  },

  voteForCandidateFunction: async function(){
    try{
      let candidateName = $("#candidate").val();
      $('#candidate').val("");
      console.log(this.Voting);
      console.log(candidateName);
      const { totalVotesFor } = this.Voting.methods;
      const { voteForCandidate } = this.Voting.methods;
      const { ValidCandidate } = this.Voting.methods;
      const { getVotes } = this.Voting.methods;
      const { addNumbers } = this.Voting.methods;

      let validUser = await ValidCandidate(candidateName).call();
      console.log()
      console.log(validUser)
      if(validUser){
        let div_id = candidates[candidateName];
        await voteForCandidate(candidateName).send({ from: this.account });
        // let num2 = await addNumbers(1, 2).call();
        // console.log("num2 : " + num2);
        let num1 = await getVotes(candidateName).call();
        // console.log(num1);
        console.log('执行投票后: ' + num1);
        console.log("给" + candidateName + "投票 ");
        let voteNum = await totalVotesFor(candidateName).call();
        console.log(candidateName + "投票数为" + voteNum + typeof(voteNum));
        console.log(candidateName + " id 为" + div_id);
        $("#" + div_id).html(voteNum);
      }
      else{
        alert(candidateName + '不在投票用户组里!')
      }

      // this.Voting.deployed().then(votingInstance=>{
      //   votingInstance.voteForCandidate(candidateName).then(res=>{
      //     let div_id = candidates[candidateName];
      //     votingInstance.totalVotesFor(candidateName).then(res=>{
      //       $("#"+div_id).html(res);
      //     });
      //   });
      // });
    }catch(error){
      console.log(error);
    }
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  

  App.start();
});


// window.voteForCandidate = function(){
//   try{
//     let candidateName = $("#candidate").val();
//     $('#candidate').val("");
//     Voting.deployed().then(votingInstance=>{
//       votingInstance.voteForCandidate(candidateName).then(res=>{
//         let div_id = candidates[candidateName];
//         votingInstance.totalVotesFor(candidateName).then(res=>{
//           $("#"+div_id).html(res);
//         });
//       });
//     });
//   }catch(error){
//     console.log(error);
//   }
// };

// $(document).ready(function () {
//   if(typeof( web3 != 'undefined')){
//     window.web3 = new Web3(web3.currentProvider);
//   }else{
//     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//   }
//   Voting.setProvider(web3.currentProvider);
//   let candidateNames = Object.keys(candidates);
//   for(let i = 0; i < candidateNames.length; i++){
//     let name = candidates[i];
//     Voting.deployed().then(votingInstance=>{
//       votingInstance.totalVotesFor(name).then(res=>{
//         $("#"+name).html(res);
//       });
//     });
//   }
// });

