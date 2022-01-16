//SPDX-License-Identifier: Unlicensed
pragma solidity 0.7.5;

import "./IERC20.sol";
import "hardhat/console.sol";

/**
@notice This interface is a pathway that converts ETH to Wrapped ETH and vice-versa
@title IWETHGateway is the name of the Gateway
 */
interface IWETHGateway {

    /**
    @notice The interface function takes a deposit on behalf of the sender contract
    @param onBehalfOf is the contract address
    @param referralCode set this to zero.
    */
    function depositETH(address onBehalfOf, uint16 referralCode) external payable;

    /**
    @notice The interface function withdraw's a deposit to the sender contract
    @param amount the amount we seek to withdraw
    @param to the contract's address
    */
    function withdrawETH(uint256 amount, address to) external;
}
/**
@title a contract that allows the caller to deposite ETH into an Aave pool, and earn interest.
@author Gbenga Ajiboye 
@notice This contract is not audited, so it may have vulnerabilities
@dev All functions appear to work as desired, and have been tested in .js file.

 */
contract AaveDeposit {

    uint256 public initialDeposit;
    //uint256 public depositTime;
    mapping(address => uint) public ledgerBalances;
    mapping(address => bool) public hasDeposit;
    mapping(address => uint) private deposited;

    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);


    /**
    @notice The function will allow the user to send funds to the contract
  
    @dev the function is a fallback function. 
    */
    receive() payable external {
        require(msg.value > 0, "You have to send ether");
        initialDeposit = msg.value;
        ledgerBalances[msg.sender] += initialDeposit;
        console.log('Contract address is: ', address(this));
    }    

    /**
    @notice The function moves a users deposit from the contract to Aave's contract. 
    
    */
    function depositInAave() external payable {
        require(ledgerBalances[msg.sender] > 0, "You are not authorized to take this action");
        uint amount = ledgerBalances[msg.sender];
        hasDeposit[msg.sender] = true;
        gateway.depositETH{ value: amount }(address(this), 0); 
        deposited[msg.sender] = ledgerBalances[msg.sender];
        ledgerBalances[msg.sender] = 0;    
    }


    /**
    @notice The function moves a users deposit back from Aave's contract to the contract.
  
    @dev the function uses a private variable mapping called deposited to assist with tracking
     the the total amount a user has contributed.
    */
    function withdrawDepositAndInterest() external {
        require(hasDeposit[msg.sender], "You do not have a deposit in this contract.");
        uint userBalance = aWETH.balanceOf(address(this));
        aWETH.approve(address(gateway), userBalance);
        gateway.withdrawETH(userBalance, address(this));
        uint amount = deposited[msg.sender];
        payable(msg.sender).transfer(amount);
        hasDeposit[msg.sender] = false;
        deposited[msg.sender] = 0;
    }
    
}