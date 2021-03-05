import Web3 from 'web3';

import UberHausMinionAbi from '../contracts/uberHausMinion.json';
import { chainByID } from '../utils/chain';

export const UberHausMinionService = ({ web3, chainID, uberHausMinion }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = UberHausMinionAbi;
  const contract = new web3.eth.Contract(abi, uberHausMinion);
  return (service) => {
    if (service === 'proposeAction') {
      return async ({ args, from, poll, onTxHash }) => {
        console.log({ args, from, poll, onTxHash });
        console.log(contract);
        try {
          console.log(args, from);
          const tx = await contract.methods[service](...args);
          return tx
            .send({ from })
            .on('transactionHash', (txHash) => {
              if (poll) {
                onTxHash(txHash);
                poll(txHash);
              }
            })
            .on('error', (error) => {
              console.error(error);
            });
        } catch (error) {
          return error;
        }
      };
    }
  };
};
