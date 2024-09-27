import styled from 'styled-components';

export const OverlayContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: white;
  font-family: 'Roboto Slab', serif;
  font-weight: 500;
  font-size: 30px;
`;

export const InfoBox = styled.div<{ $right?: boolean }>`
  position: absolute;
  top: 16px;
  ${(props) => (props.$right ? 'right: 16px;' : 'left: 16px;')}
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;
  border-radius: 8px;
`;

export const Ticker = styled.div<{ $bottom?: string }>`
  position: absolute;
  bottom: ${(props) => props.$bottom || '0'};
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 0;
  overflow: hidden;
`;
