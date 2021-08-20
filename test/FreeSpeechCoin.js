const FreeSpeechCoin = artifacts.require("FreeSpeechCoin");

contract("FreeSpeechCoin", accounts => {
  before(async () =>{
    fscoin = await FreeSpeechCoin.deployed()
  })

  it("deployed FreeSpeechCoin", async () => {
    console.log(fscoin.address);
    let balance = await fscoin.balanceOf(accounts[0]);
    console.log(web3.utils.fromWei(balance.toString(), 'ether'));
  });

  it("can transfer FreeSpeechCoin to another account", async () => {
    let amount = '1000000000000000000';
    // console.log(amount.toString())
    await fscoin.transfer(accounts[1], amount, { from: accounts[0]});
    
    let balance = await fscoin.balanceOf(accounts[1])
    balance = web3.utils.fromWei(balance, 'ether');
    console.log(balance.toString());
    assert.equal(balance.toString(), '1', 'Balance should be 1 token for account[1]!');
  });

});
