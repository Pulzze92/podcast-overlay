import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);
const RSS_FEEDS = ['/rss_bloom', '/rss_yahoo', '/rss_nytimes'];

function decodeHTMLEntities(text: string) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export const fetchRssFeed = async () => {
  try {
    const allNews = await Promise.any(
      RSS_FEEDS.map(async (feed) => {
        const response = await axios.get(feed);
        const result = await parseXml(response.data);
        return result.rss.channel[0].item.map((item: any) => decodeHTMLEntities(item.title[0]));
      })
    );
    return allNews.flat();
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
};