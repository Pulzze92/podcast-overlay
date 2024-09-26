import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as Parser from 'rss-parser';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

// Styled components (остаются без изменений)
const OverlayContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  color: white;
  font-family: Arial, sans-serif;
  background-color: transparent;
`;

const Ticker = styled.div<{ $bottom?: string }>`
  position: absolute;
  bottom: ${props => props.$bottom || '0'};
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 0;
  overflow: hidden;
`;

const TickerContent = styled.div`
  white-space: nowrap;
  animation: marquee 60s linear infinite;

  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const InfoBox = styled.div<{ $right?: boolean }>`
  position: absolute;
  top: 16px;
  ${props => props.$right ? 'right: 16px;' : 'left: 16px;'}
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;
  border-radius: 8px;
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640px;
  height: 360px;
  border: 2px dashed white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

// RSS parser

// Function to fetch RSS feed
const fetchRssFeed = async () => {
    const parser = new Parser();
    const feed = await parser.parseURL('https://feeds.bloomberg.com/markets/news.rss');
    return feed.items.map(item => item.title);
};

// Function to fetch stock quotes
const fetchQuotes = async () => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
  const quotes = [];

  for (const symbol of symbols) {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=YOUR_ALPHA_VANTAGE_API_KEY`);
      const data = response.data['Global Quote'];
      quotes.push({
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['10. change percent'].replace('%', ''))
      });
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  return quotes;
};

const PodcastOverlay: React.FC = () => {
  const [news, setNews] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const newsItems = await fetchRssFeed();
      setNews(newsItems);
    };

    const fetchStockQuotes = async () => {
      const quoteData = await fetchQuotes();
      setQuotes(quoteData);
    };

    fetchNews();
    fetchStockQuotes();

    const newsInterval = setInterval(fetchNews, 300000); // Обновление каждые 5 минут
    const quotesInterval = setInterval(fetchStockQuotes, 60000); // Обновление каждую минуту

    return () => {
      clearInterval(newsInterval);
      clearInterval(quotesInterval);
    };
  }, []);

  const formatTime = (offset: number) => {
    const date = new Date();
    date.setHours(date.getHours() + offset);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <OverlayContainer>
      <Ticker $bottom="40px">
        <TickerContent>
          {news.map((item: string, index: number) => (
            <span key={index} style={{ marginRight: '32px' }}>{item}</span>
          ))}
        </TickerContent>
      </Ticker>

      <Ticker>
        <TickerContent>
          {quotes.map((quote: any, index: number) => (
            <span key={index} style={{ marginRight: '32px' }}>
              {quote.symbol}: ${quote.price.toFixed(2)} 
              <span style={{ color: quote.change >= 0 ? 'lightgreen' : 'salmon', marginLeft: '8px' }}>
                {quote.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {quote.change.toFixed(2)}%
              </span>
            </span>
          ))}
        </TickerContent>
      </Ticker>

      <InfoBox $right>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Current Time</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Clock size={16} style={{ marginRight: '8px' }} /> New York: {formatTime(-4)}</li>
          <li><Clock size={16} style={{ marginRight: '8px' }} /> London: {formatTime(1)}</li>
          <li><Clock size={16} style={{ marginRight: '8px' }} /> Toronto: {formatTime(-4)}</li>
          <li><Clock size={16} style={{ marginRight: '8px' }} /> Sydney: {formatTime(10)}</li>
        </ul>
      </InfoBox>

      <InfoBox>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Market Summary</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {quotes.map((quote: any, index: number) => (
            <li key={index} style={{ marginBottom: '4px' }}>
              {quote.symbol}: ${quote.price.toFixed(2)} 
              <span style={{ color: quote.change >= 0 ? 'lightgreen' : 'salmon', marginLeft: '8px' }}>
                {quote.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {quote.change.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </InfoBox>

      <VideoPlaceholder>
        Video Frame Placeholder
      </VideoPlaceholder>
    </OverlayContainer>
  );
};

export default PodcastOverlay;