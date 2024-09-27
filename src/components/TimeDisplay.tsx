import React from 'react';
import { Clock } from 'lucide-react';
import { InfoBox } from '../styles/OverlayStyles';
import { formatTime } from '../services/timeService';

const TimeDisplay: React.FC = () => (
  <InfoBox $right style={{/* ... */}}>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ paddingBottom: 7 }}><Clock size={16} style={{ marginRight: '8px' }} /> New York: {formatTime(-4)}</li>
      <li style={{ paddingBottom: 7 }}><Clock size={16} style={{ marginRight: '8px' }} /> London: {formatTime(1)}</li>
      <li style={{ paddingBottom: 7 }}><Clock size={16} style={{ marginRight: '8px' }} /> Toronto: {formatTime(-4)}</li>
      <li style={{ paddingBottom: 7 }}><Clock size={16} style={{ marginRight: '8px' }} /> Sydney: {formatTime(10)}</li>
    </ul>
  </InfoBox>
);

export default TimeDisplay;