import axios from 'axios';
import { Quote } from '../types';

const apiKeyYahoo = import.meta.env.VITE_FINNHUB_API_KEY;
const apiKeyMarketStack = import.meta.env.MARKET_STACK_API_KEY;
const BASE_URL_MS = 'http://api.marketstack.com/v1';

const SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', // Голубые фишки
  'EURUSD', 'GBPUSD', 'USDJPY', // Валюты
  'GOLD', 'SILVER', 'OIL', // Товары
  'BTCUSD', 'ETHUSD' // Криптовалюты
];

interface Quote {
  symbol: string;
  price: number;
  change: number;
}

const cachedQuotes: Quote[] = [];

// export const fetchQuotesMS = async (): Promise<Quote[]> => {
//   if (cachedQuotes.length > 0) {
//     return cachedQuotes;
//   }

//   try {
//     const response = await axios.get(${BASE_URL_MS}/eod/latest, {
//       params: {
//         access_key: apiKeyMarketStack,
//         symbols: SYMBOLS.join(',')
//       }
//     });

//     if (response.data && response.data.data) {
//       cachedQuotes = response.data.data.map((item: any) => ({
//         symbol: item.symbol,
//         price: item.close,
//         change: ((item.close - item.open) / item.open) * 100
//       }));
//     }

//     return cachedQuotes;
//   } catch (error) {
//     console.error('Error fetching quotes:', error);
//     return [];
//   }
// }

export const fetchQuotes = async (): Promise<Quote[]> => {
  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/options/most-active',
    params: { type: 'STOCKS' },
    headers: {
      'x-rapidapi-key': apiKeyYahoo,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const data = response?.data?.body;

    return data.map((sym: any) => ({
      symbol: sym?.symbolName,
      price: sym?.lastPrice,
      change: sym?.percentChange,
    }));
  } catch (error) {
    console.error('Error fetching stock quotes:', error);
    return [];
  }
};