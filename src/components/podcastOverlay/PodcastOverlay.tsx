import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import videoBack from '../../assets/increase_stock.mov';

interface Quote {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
}

const OverlayContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: white;
  // background-color: green;
  font-family: 'Roboto Slab', serif;
  font-weight: 500;
  font-size: 30px;
  // background-color: transparent;
`;

const Ticker = styled.div<{ $bottom?: string }>`
  position: absolute;
  bottom: ${(props) => props.$bottom || '0'};
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 0;
  overflow: hidden;
`;

const TopTickerContent = styled.div`
  display: inline-flex;
  white-space: nowrap;
  padding-right: 100%;
  animation: marquee 250s linear infinite; // Увеличили до 150 секунд

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const BottomTickerContent = styled.div`
  display: inline-flex;
  white-space: nowrap;
  padding-right: 100%;
  animation: marquee 90s linear infinite; // Оставили 90 секунд для нижней строки

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const InfoBox = styled.div<{ $right?: boolean }>`
  position: absolute;
  top: 16px;
  ${(props) => (props.$right ? 'right: 16px;' : 'left: 16px;')}
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

const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

//decoder
function decodeHTMLEntities(text: string) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}
// RSS parser
const parseXml = promisify(parseString);
const RSS_FEEDS = ['/rss_bloom', '/rss_yahoo', '/rss_nytimes'];

// Function to fetch RSS feed
const fetchRssFeed = async () => {
  try {
    const allNews = await Promise.any(
      RSS_FEEDS.map(async (feed) => {
        const response = await axios.get(feed);
        const result = await parseXml(response.data);
        return result.rss.channel[0].item.map((item: any) =>
          decodeHTMLEntities(item.title[0]),
        );
      }),
    );
    return allNews.flat();
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
};

// Function to fetch stock quotes
async function fetchQuotes(): Promise<Quote[]> {
  const quotes = [];

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/options/most-active',
    params: { type: 'STOCKS' },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
    },
  };

  const response = await axios.request(options);
  const data = response?.data?.body;

  try {
    for (const sym of data) {
      quotes.push({
        symbol: sym?.symbolName,
        price: sym?.lastPrice,
        change: sym?.percentChange,
      });
    }

    console.log(quotes);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
  }

  //     const data = response.data?.['Global Quote'];
  //     quotes.push({
  //       symbol: data?.['01. symbol'],
  //       price: parseFloat(data?.['05. price']),
  //       change: parseFloat(data?.['10. change percent'].replace('%', ''))
  //     });
  //   } catch (error) {
  //     console.error(`Error fetching data for ${symbol}:`, error);
  //   }
  // }

  return quotes;
}

const PodcastOverlay: React.FC = () => {
  const [news, setNews] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  const debouncedFetchNews = useCallback(
    debounce(() => {
      fetchRssFeed().then(setNews);
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
    debouncedFetchNews();
    debouncedFetchQuotes();

    const newsInterval = setInterval(debouncedFetchNews, 300000); // Обновление каждые 5 минут
    const quotesInterval = setInterval(debouncedFetchQuotes, 60000); // Обновление каждую минуту

    return () => {
      clearInterval(newsInterval);
      clearInterval(quotesInterval);
    };
  }, []);

  const formatTime = (offset: number) => {
    const date = new Date();
    date.setHours(date.getHours() + offset);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <OverlayContainer>
      <video src={videoBack} style={{ opacity: '0.5' }} autoPlay loop muted />

      <Ticker
        $bottom="40px"
        style={{
          marginBottom: '4rem',
          background: 'linear-gradient(3deg, #e6d16c, #16014c)',
        }}
      >
        <TopTickerContent>
          {news.concat(news).map((item: string, index: number) => (
            <div
              key={index}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <span style={{ marginRight: '42px' }}>{item}</span>
              <span style={{ marginRight: '2rem' }}>&#128276;</span>
            </div>
          ))}
        </TopTickerContent>
      </Ticker>

      <Ticker
        style={{
          marginBottom: '2.3rem',
          background: 'linear-gradient(90deg, #cfecd0, #ffc5ca)',
        }}
      >
        <BottomTickerContent>
          {quotes?.map((quote: any, index: number) => (
            <span key={index} style={{ marginRight: '72px', color: 'black' }}>
              {quote.symbol}: ${quote.price || 'N/A'}
              <span
                style={{
                  color: quote.change[0] === '+' ? '#006633' : 'red',
                  marginLeft: '8px',
                }}
              >
                {quote.change[0] === '+' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {quote.change || 'N/A'}
              </span>
            </span>
          ))}
        </BottomTickerContent>
      </Ticker>

      <InfoBox
        $right
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.1)' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          background: `radial-gradient(ellipse farthest-corner at right bottom, #fedb37 0%, #FDB931 8%, #9f7928 30%, #8a6e2f 40%, transparent 80%),
		radial-gradient(ellipse farthest-corner at left top, #ffffff 0%, #ffffac 8%, #d1b464 25%, #5d4a1f 62.5%, #5d4a1f 100%)`,
        }}
      >
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ paddingBottom: 7 }}>
            <Clock size={16} style={{ marginRight: '8px' }} /> New York:{' '}
            {formatTime(-4)}
          </li>
          <li style={{ paddingBottom: 7 }}>
            <Clock size={16} style={{ marginRight: '8px' }} /> London:{' '}
            {formatTime(1)}
          </li>
          <li style={{ paddingBottom: 7 }}>
            <Clock size={16} style={{ marginRight: '8px' }} /> Toronto:{' '}
            {formatTime(-4)}
          </li>
          <li style={{ paddingBottom: 7 }}>
            <Clock size={16} style={{ marginRight: '8px' }} /> Sydney:{' '}
            {formatTime(10)}
          </li>
        </ul>
      </InfoBox>

      {/* <InfoBox>
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
      </InfoBox> */}

      {/* <VideoPlaceholder>
        Video Frame Placeholder
      </VideoPlaceholder> */}
    </OverlayContainer>
  );
};

export default PodcastOverlay;
