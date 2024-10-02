import styled from 'styled-components';

export const Ticker = styled.div<{ $bottom?: string }>`
  position: absolute;
  bottom: ${(props) => props.$bottom || '0'};
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 0;
  overflow: hidden;
`;

export const BottomTickerContent = styled.div`
  display: inline-flex;
  white-space: nowrap;
  padding-right: 100%;
  animation: marquee linear infinite;

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
