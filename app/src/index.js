import Web3 from "web3";
import FSCoinArtifact from "../../build/contracts/FreeSpeechCoin.json";
import voting_artifacts from '../../build/contracts/Voting.json';


let candidate_table = document.getElementById("candidate-table");
const App = {
  web3: null,
  account: null,
  meta: null,
  Voting: null,
  FSCoin: null,

  
  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log("chain id : " + networkId)
      
      const VotingDeployedNetwork = voting_artifacts.networks[networkId];
      const FSCDeployedNetwork = FSCoinArtifact.networks[networkId];
      // const deployedNetwork = metaCoinArtifact.networks[networkId];
      console.log("Voting deployedNetwork: " + VotingDeployedNetwork);
      console.log(voting_artifacts);
      console.log("FSC deployedNetwork: " + FSCDeployedNetwork);
      console.log(FSCoinArtifact);

      // this.meta = new web3.eth.Contract(
      //   metaCoinArtifact.abi,
      //   deployedNetwork.address,
      // );

      this.Voting = new web3.eth.Contract(
        voting_artifacts.abi,
        VotingDeployedNetwork.address,
      );
      
      this.FSCoin = FSCoinArtifact.networks;
      console.log(this.FSCoin);
      // this.FSCoin = new web3.eth.Contract(
      //   FSCoinArtifact.abi,
      //   FSCDeployedNetwork.address,
      // );
      // this.FSCoin = 

      // get accounts
      const accounts = await ethereum.request({method:'eth_accounts'});
      this.account = accounts[0];
      console.log('目前账户为:' + this.account);
      
      // await web3.eth.getBalance(this.account, (err, balance) => { console.log(this.account + " Balance: ", web3.utils.fromWei(balance)) });
      const {ValidCandidate} = this.Voting.methods;
      const { getCandidateNames } = this.Voting.methods;

      let isValild = await ValidCandidate("Matrix").call();
      console.log(isValild);
      var candidateNames = await getCandidateNames().call();
      console.log(candidateNames);
      
      const { totalVotesFor } = this.Voting.methods;
      for(let i = 0; i < candidateNames.length; i++){
        let name = candidateNames[i];
        let nowVote = await totalVotesFor(name).call();
        console.log(name + ' ' + nowVote + ' ' + i);
        var tab = candidate_table.insertRow(i + 1);
        tab.innerHTML = "<td>" + name + "</td>" + "<td>" + nowVote + "</td>";
        
      }

      var user_address = document.getElementById("user-address");
      user_address.innerHTML = "<td id='user-address'> " + this.account + "</td>";

      var eth_balance = document.getElementById("user-ether-balance");
      var user_eth_balance = await web3.eth.getBalance(this.account);
      user_eth_balance = web3.utils.fromWei(user_eth_balance.toString(), 'ether');
      eth_balance.innerHTML = "<td id='user-ether-balance'> " + user_eth_balance + " eth</td>";
      
    } catch (error) {
      console.error("Could not connect to contract or chain. :" + error);
    }
  },

  
  refreshAccountStatus: async function(){
      var user_address = document.getElementById("user-address");
      user_address.innerHTML = "<td id='user-address'> " + this.account + "</td>";

      var eth_balance = document.getElementById("user-ether-balance");
      var user_eth_balance = web3.eth.getBalance(this.account);
      user_eth_balance = web3.utils.fromWei(user_eth_balance);
      eth_balance.innerHTML = "<td id='user-ether-balance'> " + user_eth_balance + " eth</td>";

      var user_fsc_used_elem = document.getElementById("user-tokens-used");
      var user_fsc_used = await this.Voting.getUsedFSCoin(this.account);
      user_fsc_used = web3.utils.fromWei(user_fsc_used, 'ether');
      user_fsc_used_elem.innerHTML = "<td id='user-tokens-used'> " + user_fsc_used + " eth</td>";

      var user_fsc_total_elem = document.getElementById("user-tokens-total");
      var user_fsc_total = await this.Voting.getBalanceInFSCoin(this.account);
      user_fsc_total = web3.utils.fromWei(user_fsc_total, 'ether');
      user_fsc_total_elem.innerHTML = "<td id='user-tokens-used'> " + user_fsc_used + " eth</td>";
    },

  addCandidatePerson: async function(){
    let candidateName = $("#candidate-name").val();
    $('#candidate-name').val("");
    console.log(candidateName);

    let candidateAddress = $("#candidate-address").val();
    $('#candidate-address').val("");
    console.log(candidateAddress);

    const { registerCandidate } = this.Voting.methods;
    
    console.log(this.account);
    await registerCandidate(candidateAddress, candidateName).send({ from: this.account });
    var table_len = candidate_table.length;
    var tab = candidate_table.insertRow(table_len);
    tab.innerHTML = "<td>" + candidateName + "</td>" + "<td>" + 0 + "</td>";

    await this.refreshAccountStatus().call();

  },



  

  refreshCandidateStatus: async function(){
    const { getCandidateNames } = this.Voting.methods;
    const { totalVotesFor } = this.Voting.methods;

    var candidateNames = await getCandidateNames().call();
    console.log(candidateNames);
    var candidateLen = candidateNames.length;
    for(let i = 0; i < candidateLen; i++){
      let name = candidateNames[i];
      let nowVote = await totalVotesFor(name).call();
      console.log(name + ' ' + nowVote + ' ' + i);
      candidate_table.deleteRow(i+1);
      var tab = candidate_table.insertRow(i+1);
      tab.innerHTML = "<td>" + name + "</td>" + "<td>" + nowVote + "</td>";
      
    }

    await this.refreshAccountStatus().call();

  },

  voteForCandidateFunction: async function(){
    try{
      let candidateName = $("#candidate").val();
      $('#candidate').val("");
      console.log(candidateName);
      const { totalVotesFor } = this.Voting.methods;
      const { voteForCandidate } = this.Voting.methods;
      const { ValidCandidate } = this.Voting.methods;
      const {getVotes} = this.Voting.methods;

      let validUser = await ValidCandidate(candidateName).call();
      console.log(this.account);
      console.log(validUser);
      if(validUser){
        // let div_id = candidates[candidateName];
        await voteForCandidate(candidateName).send({ from: this.account });

        let num1 = await getVotes(candidateName).call();
        console.log('执行投票后: ' + num1);
        console.log("给" + candidateName + "投票 ");
        let voteNum = await totalVotesFor(candidateName).call();
        console.log(candidateName + "投票数为" + voteNum + typeof(voteNum));
        await this.refreshCandidateStatus().call();
        
      }
      else{
        alert(candidateName + '不在投票用户组里!');
      }

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




