import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { OverlayContainer, Ticker } from '../styles/OverlayStyles';
import NewsTicker from '../components/NewsTicker';
import StockTicker from '../components/StockTicker';
import TimeDisplay from '../components/TimeDisplay';
import { fetchRssFeed } from '../services/newsService';
import { fetchQuotes, subscribeToQuotes, initializeWebSocket } from '../services/stockService';
import videoBack from '../assets/increase_stock.mov';
import { Quote } from '../types';

const PodcastOverlay: React.FC = () => {
  const [news, setNews] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const debouncedFetchNews = useCallback(debounce(() => { fetchRssFeed().then(setNews); }, 5000), []);
  const debouncedFetchQuotes = useCallback(debounce(() => { fetchQuotes().then(setQuotes); }, 5000), []);

  useEffect(() => {
    debouncedFetchNews();
    debouncedFetchQuotes();

    const newsInterval = setInterval(debouncedFetchNews, 300000);
    const quotesInterval = setInterval(debouncedFetchQuotes, 60000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(quotesInterval);
    };
  }, [debouncedFetchNews, debouncedFetchQuotes]);

  return (
    <OverlayContainer>
      <video src={videoBack} style={{ opacity: '0.8' }} autoPlay loop muted />
      <Ticker $bottom="40px" style={{ marginBottom: '4rem', background: 'linear-gradient(3deg, #e6d16c, #16014c)' }}>
        <NewsTicker news={news} />
      </Ticker>
      <Ticker style={{ marginBottom: '2.3rem', background: 'linear-gradient(90deg, #cfecd0, #ffc5ca)' }}>
        <StockTicker quotes={quotes} />
      </Ticker>
      <TimeDisplay />
    </OverlayContainer>
  );
};

export default PodcastOverlay;