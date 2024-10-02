import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const TickerWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const TickerContent = styled.div`
  display: inline-flex;
  white-space: nowrap;
  padding-right: 100%;
  animation: ticker 1050s linear infinite;

  @keyframes ticker {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

interface NewsTickerProps {
  news: string[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (news.length > 0) {
      setTickerItems(news.concat(news).concat(news)); // Утраиваем контент для гарантии непрерывности
    }
  }, [news]);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const animate = () => {
        if (content.getBoundingClientRect().right < window.innerWidth) {
          content.style.transform = 'translateX(0)';
          setTimeout(() => {
            content.style.transition = 'none';
            content.style.transform = 'translateX(0)';
            setTimeout(() => {
              // content.style.transition = 'transform 120s linear';
              content.style.transform = 'translateX(-100%)';
            }, 50);
          }, 50);
        }
      };

      content.addEventListener('transitionend', animate);
      return () => content.removeEventListener('transitionend', animate);
    }
  }, []);

  return (
    <TickerWrapper>
      <TickerContent ref={contentRef}>
        {tickerItems.map((item, index) => (
          <div
            key={index}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <span style={{ marginRight: '42px' }}>{item}</span>
            <span style={{ marginRight: '2rem' }}>&#128276;</span>
          </div>
        ))}
      </TickerContent>
    </TickerWrapper>
  );
};

export default NewsTicker;
