// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IERC721.sol";

/**
 * @title ApexNFTBridge
 * @notice Verifiable Lock-and-Unlock NFT cross-chain escrow bridge protocol with cryptographic nonce validation.
 */
contract ApexNFTBridge {
    address public owner;
    address public validator;
    bool public paused;

    // nonce => isProcessed
    mapping(bytes32 => bool) public processedNonces;
    // user => locked token counts
    mapping(address => uint256) public userLockedCount;

    event NFTLocked(address indexed user, address indexed nftContract, uint256 indexed tokenId, uint256 targetChainId, bytes32 lockHash);
    event NFTUnlocked(address indexed recipient, address indexed nftContract, uint256 indexed tokenId, bytes32 nonce);
    event ValidatorUpdated(address newValidator);

    modifier onlyOwner() {
        require(msg.sender == owner, "ApexNFTBridge: caller is not owner");
        _;
    }

    modifier onlyValidator() {
        require(msg.sender == validator, "ApexNFTBridge: caller is not validator");
        _;
    }

    constructor(address _validator) {
        owner = msg.sender;
        validator = _validator;
    }

    function lockNFT(address nftContract, uint256 tokenId, uint256 targetChainId) external returns (bytes32 lockHash) {
        require(!paused, "Bridge paused");
        require(nftContract != address(0), "Zero address");

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        userLockedCount[msg.sender] += 1;

        lockHash = keccak256(abi.encodePacked(msg.sender, nftContract, tokenId, targetChainId, block.timestamp));
        emit NFTLocked(msg.sender, nftContract, tokenId, targetChainId, lockHash);
    }

    function unlockNFT(
        address recipient,
        address nftContract,
        uint256 tokenId,
        bytes32 nonce
    ) external onlyValidator {
        require(!processedNonces[nonce], "Nonce already processed");
        require(recipient != address(0), "Invalid recipient");

        processedNonces[nonce] = true;
        IERC721(nftContract).transferFrom(address(this), recipient, tokenId);

        emit NFTUnlocked(recipient, nftContract, tokenId, nonce);
    }

    function setValidator(address newValidator) external onlyOwner {
        require(newValidator != address(0), "Zero address");
        validator = newValidator;
        emit ValidatorUpdated(newValidator);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }
}
