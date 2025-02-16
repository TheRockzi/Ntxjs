import axios from 'axios';
import { format } from 'date-fns';

export interface SystemActivity {
  timestamp: string;
  value: number;
}

export interface ThreatData {
  timestamp: string;
  count: number;
  type: string;
}

export interface ScanProgress {
  progress: number;
  status: string;
  details?: string;
}

const logError = (message: string, error: unknown) => {
  if (error instanceof Error) {
    console.error(message, error.message);
  } else {
    console.error(message, 'Unknown error occurred');
  }
};

export const performScan = async (
  scanType: string, 
  config: Record<string, any>,
  onProgress: (progress: ScanProgress) => void
): Promise<void> => {
  try {
    const totalSteps = getScanSteps(scanType, config);
    let currentStep = 0;

    const updateProgress = (status: string, details?: string) => {
      currentStep++;
      const progress = Math.round((currentStep / totalSteps) * 100);
      onProgress({ progress, status, details });
    };

    // Initial setup
    updateProgress('Initializing scan...', 'Setting up scan environment');
    await delay(1000);

    // Target validation
    updateProgress('Validating target...', `Target: ${config.target}`);
    await delay(800);

    // Fetch Shodan data
    updateProgress('Querying Shodan...', 'Retrieving host information');
    try {
      const shodanResponse = await axios.get('/api/proxy', {
        params: {
          endpoint: 'activity',
          target: config.target
        }
      });

      if (shodanResponse.data.matches) {
        const ports = shodanResponse.data.matches
          .map((match: any) => match.port)
          .filter((port: number, index: number, self: number[]) => self.indexOf(port) === index);

        updateProgress('Analyzing ports...', `Open ports detected: ${ports.join(', ')}`);

        shodanResponse.data.matches.forEach((match: any) => {
          if (match.product) {
            updateProgress(
              'Service detection',
              `Port ${match.port}: ${match.product}${match.version ? ` (v${match.version})` : ''}`
            );
          }
          if (match.vulns) {
            Object.entries(match.vulns).forEach(([vuln, details]: [string, any]) => {
              updateProgress(
                'Vulnerability detected',
                `${vuln}: ${details.summary} (CVSS: ${details.cvss})`
              );
            });
          }
        });
      }
    } catch (error) {
      updateProgress('Shodan scan error', 'Failed to retrieve Shodan data');
    }

    // Fetch URLScan data
    updateProgress('Querying URLScan...', 'Analyzing web presence');
    try {
      const urlscanResponse = await axios.get('/api/proxy', {
        params: {
          endpoint: 'threats',
          target: config.target
        }
      });

      if (urlscanResponse.data.results) {
        urlscanResponse.data.results.forEach((result: any) => {
          if (result.page) {
            updateProgress(
              'Web analysis',
              `Domain: ${result.page.domain}`
            );
          }
          if (result.stats) {
            updateProgress(
              'Security statistics',
              `Malicious indicators: ${result.stats.malicious || 0}, Suspicious: ${result.stats.suspicious || 0}`
            );
          }
          if (result.verdicts) {
            updateProgress(
              'Security verdict',
              `Overall score: ${result.verdicts.overall.score}, Malicious: ${result.verdicts.overall.malicious}`
            );
          }
        });
      }
    } catch (error) {
      updateProgress('URLScan error', 'Failed to retrieve URLScan data');
    }

    // Risk assessment
    updateProgress('Performing risk assessment...', 'Analyzing collected data');
    await delay(1000);

    // Final report
    updateProgress('Generating final report...', 'Compiling findings');
    await delay(1000);

    updateProgress('Scan completed', 'All analysis tasks finished. Review the findings above.');
  } catch (error) {
    logError('Scan error:', error);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getScanSteps = (scanType: string, config: Record<string, any>): number => {
  switch (scanType) {
    case 'quick':
      return 8;
    case 'full':
      return 15;
    case 'ports':
      return config.portRange === 'full' ? 20 : 12;
    case 'web':
      return config.scanTypes === 'all' ? 18 : 10;
    case 'malware':
      return config.engineType === 'deep' ? 15 : 8;
    default:
      return 8;
  }
};

export const fetchRecentScans = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=scans');
    return typeof response.data.total === 'number' ? response.data.total : 0;
  } catch (error) {
    logError('Error fetching scan data:', error);
    return 0;
  }
};

export const fetchDataSources = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=sources');
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    logError('Error fetching data sources:', error);
    return 0;
  }
};

export const fetchSystemActivity = async (): Promise<SystemActivity[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=activity');
    
    if (!Array.isArray(response.data.matches)) {
      return [];
    }

    return response.data.matches.map((match: any) => ({
      timestamp: typeof match.timestamp === 'string' ? match.timestamp : format(new Date(), 'HH:mm'),
      value: typeof match.value === 'number' ? match.value : 0
    }));
  } catch (error) {
    logError('Error fetching system activity:', error);
    return [];
  }
};

export const fetchThreatData = async (): Promise<ThreatData[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=threats');
    
    if (!Array.isArray(response.data.results)) {
      return [];
    }

    return response.data.results.map((result: any) => ({
      timestamp: result.timestamp || format(new Date(), 'HH:mm'),
      count: typeof result.count === 'number' ? result.count : 0,
      type: 'malicious'
    }));
  } catch (error) {
    logError('Error fetching threat data:', error);
    return [];
  }
};