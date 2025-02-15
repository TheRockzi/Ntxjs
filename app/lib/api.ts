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
    // Simulate different scan durations based on scan type and configuration
    const totalSteps = getScanSteps(scanType, config);
    let currentStep = 0;

    const updateProgress = (status: string, details?: string) => {
      currentStep++;
      const progress = Math.round((currentStep / totalSteps) * 100);
      onProgress({ progress, status, details });
    };

    // Initial setup
    updateProgress('Initializing scan...');
    await delay(1000);

    // Configuration validation
    updateProgress('Validating configuration...');
    await delay(800);

    // Target resolution
    updateProgress('Resolving target...');
    await delay(1200);

    // Main scan process
    switch (scanType) {
      case 'quick':
        await simulateQuickScan(config, updateProgress);
        break;
      case 'full':
        await simulateFullScan(config, updateProgress);
        break;
      case 'ports':
        await simulatePortScan(config, updateProgress);
        break;
      case 'web':
        await simulateWebScan(config, updateProgress);
        break;
      case 'malware':
        await simulateMalwareScan(config, updateProgress);
        break;
    }

    // Finalizing
    updateProgress('Generating report...');
    await delay(1000);

    updateProgress('Scan completed', 'Check the results in the dashboard');
  } catch (error) {
    logError('Scan error:', error);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getScanSteps = (scanType: string, config: Record<string, any>): number => {
  switch (scanType) {
    case 'quick':
      return 5;
    case 'full':
      return 10;
    case 'ports':
      return config.portRange === 'full' ? 15 : 8;
    case 'web':
      return config.scanTypes === 'all' ? 12 : 6;
    case 'malware':
      return config.engineType === 'deep' ? 10 : 5;
    default:
      return 5;
  }
};

const simulateQuickScan = async (
  config: Record<string, any>,
  updateProgress: (status: string, details?: string) => void
) => {
  updateProgress('Performing quick vulnerability check...');
  await delay(1500);
  updateProgress('Analyzing surface vulnerabilities...', 'Found 2 potential issues');
  await delay(1000);
};

const simulateFullScan = async (
  config: Record<string, any>,
  updateProgress: (status: string, details?: string) => void
) => {
  updateProgress('Initiating deep scan...');
  await delay(1000);
  updateProgress('Checking system vulnerabilities...', 'Scanning ports 1-1024');
  await delay(1500);
  updateProgress('Analyzing security configurations...', 'Reviewing settings');
  await delay(1500);
  updateProgress('Running exploit detection...', 'Testing known vulnerabilities');
  await delay(1500);
};

const simulatePortScan = async (
  config: Record<string, any>,
  updateProgress: (status: string, details?: string) => void
) => {
  const portRanges = {
    common: '1-1024',
    extended: '1-10000',
    full: '1-65535'
  };
  const range = portRanges[config.portRange as keyof typeof portRanges];
  
  updateProgress('Starting port scan...', `Range: ${range}`);
  await delay(1000);
  updateProgress('Scanning TCP ports...', 'Found 3 open ports');
  await delay(1500);
  
  if (config.scanType !== 'tcp') {
    updateProgress('Scanning UDP ports...', 'Found 1 open port');
    await delay(1500);
  }
};

const simulateWebScan = async (
  config: Record<string, any>,
  updateProgress: (status: string, details?: string) => void
) => {
  updateProgress('Crawling website...', `Depth: ${config.crawlDepth}`);
  await delay(1500);
  updateProgress('Checking for vulnerabilities...', 'Testing injection points');
  await delay(1500);
  updateProgress('Analyzing responses...', 'Processing security headers');
  await delay(1500);
};

const simulateMalwareScan = async (
  config: Record<string, any>,
  updateProgress: (status: string, details?: string) => void
) => {
  updateProgress('Initializing malware scan...', `Engine: ${config.engineType}`);
  await delay(1000);
  updateProgress('Scanning for known signatures...', 'Checked 1000 patterns');
  await delay(1500);
  if (config.engineType === 'deep') {
    updateProgress('Performing behavioral analysis...', 'Analyzing patterns');
    await delay(1500);
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