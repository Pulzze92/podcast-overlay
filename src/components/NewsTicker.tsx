import React from 'react';
import { TopTickerContent } from '../styles/TickerStyles';

interface NewsTickerProps {
    news: string[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => (
    <TopTickerContent>
      {news.concat(news).map((item: string, index: number) => (
        <div key={index} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ marginRight: '42px' }}>{item}</span>
          <span style={{ marginRight: '2rem' }}>&#128276;</span>
        </div>
      ))}
    </TopTickerContent>
  );
  
export default NewsTicker;