import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
  // TODO: Implement price fetching from CoinGecko API
  async getPrices() {
    // Mock implementation
    return {
      BTC: 45000,
      ETH: 3000,
      BNB: 300,
    };
  }
}
