import React, { useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BottomTickerContent } from '../styles/TickerStyles';
import { Quote } from '../types';

interface StockTickerProps {
  quotes: Quote[];
}

const StockTicker: React.FC<StockTickerProps> = ({ quotes }) => {
  const contentRef = useRef<HTMLDivElement>(null); // Добавлена ref для контента

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const width = content.offsetWidth;
      const parentWidth = content.parentElement?.offsetWidth || 0;
      const duration = (width / parentWidth) * 10; // Расчет длительности анимации
      content.style.animationDuration = `${duration}s`;
    }
  }, [quotes]); // Эффект для динамического расчета длительности анимации

  const renderQuotes = () =>
    quotes?.map((quote: Quote, index: number) => (
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
    ));

  return (
    <BottomTickerContent ref={contentRef}>
      {renderQuotes()}
      {renderQuotes()} {/* Дублирование контента для бесшовной анимации */}
    </BottomTickerContent>
  );
};

export default StockTicker;
