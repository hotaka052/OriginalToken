import { ethers } from 'ethers';
import { soaTokenAbi } from './soa-token-abi';

export default () => {
  const contractAddress =
    process.env.CONNECT_GOERLI === 'true'
      ? process.env.GOERLI_CONTRACT_ADDRESS
      : process.env.LOCAL_CONTRACT_ADDRESS;

  const ownerPrivateKey =
    process.env.CONNECT_GOERLI === 'true'
      ? process.env.GOERLI_PRIVATE_KEY
      : process.env.LOCAL_PRIVATE_KEY;

  const network =
    process.env.CONNECT_GOERLI === 'true'
      ? `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : '';

  const provider = new ethers.providers.JsonRpcProvider(network);

  const owner = new ethers.Wallet(ownerPrivateKey, provider);

  return {
    soaTokenContract: new ethers.Contract(contractAddress, soaTokenAbi, owner),
  };
};
