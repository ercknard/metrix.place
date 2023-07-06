/*
 * Copyright 2020 Cryptech Services
 *
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import axios from 'axios';

export default class CoinGeckoHelper {
  private supportedCoinsMap: {id: string; symbol: string; name: string}[];
  private supportedCoins: string[];
  private supportedVsCoins: string[];

  constructor() {
    this.supportedCoinsMap = [];
    this.supportedCoins = [];
    this.supportedVsCoins = [];
  }

  public async init() {
    let vscoins = await axios.get(
      'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
    );
    this.supportedVsCoins = vscoins.data as string[];
    let coins = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
    this.supportedCoinsMap = coins.data;
  }

  public getSupportedCoins(): any[] {
    return this.supportedCoinsMap;
  }

  public getSupportedCoinBySymbol(
    symbol: string
  ): {id: string; symbol: string; name: string} | undefined {
    for (let i = 0; i < this.supportedCoinsMap.length; i++) {
      if (this.supportedCoinsMap[i].symbol === symbol.toLowerCase()) {
        return this.supportedCoinsMap[i];
      }
    }
    return undefined;
  }

  public getSupportedCoinByName(
    name: string
  ): {id: string; symbol: string; name: string} | undefined {
    for (let i = 0; i < this.supportedCoinsMap.length; i++) {
      if (this.supportedCoinsMap[i].name.toLowerCase() === name.toLowerCase()) {
        return this.supportedCoinsMap[i];
      }
    }
    return undefined;
  }
  public getSupportedCoinById(
    id: string
  ): {id: string; symbol: string; name: string} | undefined {
    for (let i = 0; i < this.supportedCoinsMap.length; i++) {
      if (this.supportedCoinsMap[i].id === id.toLowerCase()) {
        return this.supportedCoinsMap[i];
      }
    }
    return undefined;
  }
  public getSupportedVsCoins(): string[] {
    return this.supportedVsCoins;
  }

  public isSupportedCoin(coin: string): boolean {
    return this.supportedCoins.includes(coin);
  }

  public isSupportedVsCoin(coin: string): boolean {
    return this.supportedVsCoins.includes(coin);
  }

  public async getPrice(coinA: string = 'bitcoin', coinB: string[] = ['usd']) {
    let regex: RegExp = /^0x[0-9a-fA-F]{40}$/;
    if (regex.test(coinA)) {
      return this.getTokenPrice(coinA, coinB);
    }
    let coin: {id: string; symbol: string; name: string} | undefined =
      this.getSupportedCoinById(coinA);
    if (!coin) {
      coin = this.getSupportedCoinBySymbol(coinA);
      if (!coin) {
        coin = this.getSupportedCoinByName(coinA);
        if (!coin) {
          return {error: `unsupported coin ${coinA}`};
        }
      }
    }

    for (let i = 0; i < coinB.length; i++) {
      if (!this.getSupportedVsCoins().includes(coinB[i])) {
        return {error: `unsupported vs coin ${coinB[i]}`};
      }
    }

    let vs_params: string = '';
    coinB.map((coin) => {
      vs_params += coin + '%2C';
    });
    vs_params = vs_params.substring(0, vs_params.length - 3);
    const price = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${vs_params}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=false`
    );
    return price.data;
  }

  public async getTokenPrice(contract: string, coinB: string[] = ['usd']) {
    for (let i = 0; i < coinB.length; i++) {
      if (!this.getSupportedVsCoins().includes(coinB[i])) {
        return {error: `unsupported vs coin ${coinB[i]}`};
      }
    }

    let vs_params: string = '';
    coinB.map((coin) => {
      vs_params += coin + '%2C';
    });
    vs_params = vs_params.substring(0, vs_params.length - 3);
    const price = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contract}&vs_currencies=${vs_params}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=false`
    );
    return price.data;
  }
}
