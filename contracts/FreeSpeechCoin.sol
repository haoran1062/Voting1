pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FreeSpeechCoin is ERC20{
    constructor(uint256 initSupply) ERC20("FreeSpeechCoin", "FSC") {
        _mint(msg.sender, initSupply * (10 ** decimals()));
    }
}
