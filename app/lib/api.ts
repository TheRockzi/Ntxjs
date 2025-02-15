import axios from 'axios';
import { format } from 'date-fns';

const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY || '';
const URLSCAN_API_KEY = process.env.NEXT_PUBLIC_URLSCAN_API_KEY || '';

export interface SystemActivity {
  timestamp: string;
  value: number;
}

export interface ThreatData {
  timestamp: string;
  count: number;
  type: string;
}

export const fetchRecentScans = async () => {
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/count?key=${SHODAN_API_KEY}&query=port:22,80,443`);
    return typeof response.data.total === 'number' ? response.data.total : 0;
  } catch (error) {
    console.error('Error fetching scan data:', error);
    return 0;
  }
};

export const fetchDataSources = async () => {
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/ports?key=${SHODAN_API_KEY}`);
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return 0;
  }
};

export const fetchSystemActivity = async (): Promise<SystemActivity[]> => {
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=port:80&facets=port`);
    
    if (!Array.isArray(response.data.matches)) {
      return [];
    }

    return response.data.matches.slice(0, 12).map((match: any, index: number) => {
      const timestamp = match.timestamp ? format(new Date(match.timestamp), 'HH:mm') : format(new Date(), 'HH:mm');
      const ports = Array.isArray(match.ports) ? match.ports.length : 0;
      return {
        timestamp,
        value: ports || index + 1
      };
    });
  } catch (error) {
    console.error('Error fetching system activity:', error);
    return [];
  }
};

export const fetchThreatData = async (): Promise<ThreatData[]> => {
  try {
    const response = await axios.get('https://urlscan.io/api/v1/search/?q=domain:*.com&size=12', {
      headers: {
        'API-Key': URLSCAN_API_KEY
      }
    });
    
    if (!Array.isArray(response.data.results)) {
      return [];
    }

    return response.data.results.map((result: any) => {
      const timestamp = result.task?.time ? 
        format(new Date(result.task.time), 'HH:mm') : 
        format(new Date(), 'HH:mm');
      
      return {
        timestamp,
        count: typeof result.stats?.malicious === 'number' ? result.stats.malicious : 0,
        type: 'malicious'
      };
    });
  } catch (error) {
    console.error('Error fetching threat data:', error);
    return [];
  }
};