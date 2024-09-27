import PodcastOverlay from './components/podcastOverlay/PodcastOverlay';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <PodcastOverlay></PodcastOverlay>
    </>
  );
}

export default App;
