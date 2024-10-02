import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { OverlayContainer, Ticker } from '../styles/OverlayStyles';
import NewsTicker from '../components/NewsTicker';
import StockTicker from '../components/StockTicker';
import TimeDisplay from '../components/TimeDisplay';
import { fetchRssFeed, fetchITNews } from '../services/newsService';
import { fetchQuotes } from '../services/stockService';
import financeVideoBack from '../assets/increase_stock.mov';
import itVideoBack from '../assets/it_background.mp4';
import { Quote } from '../types';
import itQr from '../assets/qr_it.jpg';

const PodcastOverlay: React.FC = () => {
  const [scene, setScene] = useState<'finance' | 'it'>('finance');
  const [news, setNews] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const debouncedFetchFinanceNews = useCallback(
    debounce(() => {
      fetchRssFeed().then(setNews);
    }, 5000),
    [],
  );
  const debouncedFetchITNews = useCallback(
    debounce(() => {
      fetchITNews().then(setNews);
    }, 5000),
    [],
  );
  const debouncedFetchQuotes = useCallback(
    debounce(() => {
      fetchQuotes().then(setQuotes);
    }, 5000),
    [],
  );

  useEffect(() => {
    if (scene === 'finance') {
      debouncedFetchFinanceNews();
      debouncedFetchQuotes();
    } else {
      debouncedFetchITNews();
    }

    const newsInterval = setInterval(
      scene === 'finance' ? debouncedFetchFinanceNews : debouncedFetchITNews,
      300000,
    );
    const quotesInterval =
      scene === 'finance' ? setInterval(debouncedFetchQuotes, 60000) : null;

    return () => {
      clearInterval(newsInterval);
      if (quotesInterval) clearInterval(quotesInterval);
    };
  }, [
    scene,
    debouncedFetchFinanceNews,
    debouncedFetchITNews,
    debouncedFetchQuotes,
  ]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '1') {
        setScene('finance');
      } else if (event.key === '2') {
        setScene('it');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <OverlayContainer>
      <img src={itQr} alt="QR" style={{width: "230px", position: "absolute", top: "2%", left: "2%", borderRadius: "5%"}}/>
      <video
        src={scene === 'finance' ? financeVideoBack : itVideoBack}
        style={{ opacity: '1' }}
        autoPlay
        loop
        muted
      />
      <Ticker
        $bottom="40px"
        style={{
          marginBottom: '4rem',
          background: 'linear-gradient(3deg, #e6d16c, #16014c)',
        }}
      >
        <NewsTicker news={news} />
      </Ticker>
      {scene === 'finance' && (
        <Ticker
          style={{
            marginBottom: '2.3rem',
            background: 'linear-gradient(90deg, #cfecd0, #ffc5ca)',
          }}
        >
          <StockTicker quotes={quotes} />
        </Ticker>
      )}
      <TimeDisplay />
    </OverlayContainer>
  );
};

export default PodcastOverlay;
