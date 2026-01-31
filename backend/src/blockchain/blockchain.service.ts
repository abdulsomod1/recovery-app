import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();

  constructor() {
    // Initialize providers for different networks
    this.providers.set('ethereum', new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'));
    this.providers.set('polygon', new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com'));
    this.providers.set('bsc', new ethers.JsonRpcProvider(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org'));
  }

  getProvider(network: string = 'ethereum'): ethers.JsonRpcProvider {
    return this.providers.get(network) || this.providers.get('ethereum')!;
  }

  async getBalance(address: string, network: string = 'ethereum'): Promise<string> {
    const provider = this.getProvider(network);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendTransaction(
    privateKey: string,
    to: string,
    amount: string,
    network: string = 'ethereum'
  ): Promise<any> {
    const provider = this.getProvider(network);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to,
      value: ethers.parseEther(amount),
    };

    const transaction = await wallet.sendTransaction(tx);
    return await transaction.wait();
  }

  async getTransaction(hash: string, network: string = 'ethereum'): Promise<any> {
    const provider = this.getProvider(network);
    return await provider.getTransaction(hash);
  }

  generateWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  async estimateGas(to: string, data?: string, network: string = 'ethereum'): Promise<string> {
    const provider = this.getProvider(network);
    const gasEstimate = await provider.estimateGas({
      to,
      data: data || '0x',
    });
    return gasEstimate.toString();
  }
}
