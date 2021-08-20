const Voting = artifacts.require("Voting");
const FreeSpeechCoin = artifacts.require("FreeSpeechCoin");

module.exports = function(deployer) {
  deployer.deploy(FreeSpeechCoin, 7 * 10 ** 9);
  deployer.deploy(Voting);
  
};
