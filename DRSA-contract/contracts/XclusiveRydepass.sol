// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract XclusiveRydePass is ERC721, ERC721Enumerable, ERC721Pausable, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;

    uint256 public MINT_PRICE = 10 wei;
    uint256 public MAX_SUPPLY = 10000;

    mapping(address=> uint256[]) private tokenOwnerstoIds;
    


    constructor()
        ERC721("XclusiveRydePass", "XRP")
        Ownable(msg.sender)     
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://xclusiveRydePassBaseURI/";
    }


    function getTokens(address user) public view returns (uint256[] memory) {
        return tokenOwnerstoIds[user];
    }

    function getOwnerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function transferToken(address to, uint256 tokenId) public onlyOwnerOf(tokenId) {
        _transfer(ownerOf(tokenId), to, tokenId);
        uint256[] storage ownerTokenIds = tokenOwnerstoIds[ownerOf(tokenId)];
        for (uint256 i = 0; i < ownerTokenIds.length; i++) {
            if (ownerTokenIds[i] == tokenId) {
                // Remove the transferred token from the owner's list of tokens
                ownerTokenIds[i] = ownerTokenIds[ownerTokenIds.length - 1];
                ownerTokenIds.pop();
                break;
            }
        }
        tokenOwnerstoIds[to].push(tokenId);
    }

    function safeMint(address to) public payable   {
        require(totalSupply() < MAX_SUPPLY, "exceeded max supply, cant mint anymore");
        require(msg.value>=MINT_PRICE, "not enough ethers");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        tokenOwnerstoIds[to].push(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function checkBalance(address user) public view returns (uint256) {
        
        require(msg.sender == owner() || msg.sender == user, "Only the owner or the associated address can check the balance.");
        return address(this).balance;
    }

    function balanceOf(address account) override(ERC721, IERC721) public view  returns (uint256) {
        return super.balanceOf(account);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyOwnerOf(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");
    _;
    }


    function approveAddressForToken(address to, uint256 tokenId) public onlyOwnerOf(tokenId) {
        approve(to, tokenId);
    }

    function _transferToken(address to, uint256 tokenId)  external {
        uint256[] storage ownerTokenIds = tokenOwnerstoIds[ownerOf(tokenId)];
        _transfer(ownerOf(tokenId), to, tokenId);
        for (uint256 i = 0; i < ownerTokenIds.length; i++) {
            if (ownerTokenIds[i] == tokenId) {
                // Remove the transferred token from the owner's list of tokens
                ownerTokenIds[i] = ownerTokenIds[ownerTokenIds.length - 1];
                ownerTokenIds.pop();
                break;
            }
        }
        tokenOwnerstoIds[to].push(tokenId);
    }

    
}
