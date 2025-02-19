import axios from 'axios';
import { format } from 'date-fns';

export interface SystemActivity {
  timestamp: string;
  value: number;
  port?: number;
  product?: string;
  version?: string;
  vulns?: Record<string, any>;
}

export interface ThreatData {
  timestamp: string;
  count: number;
  type: string;
  domain?: string;
  score?: number;
  malicious?: boolean;
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

    // Inicialización
    updateProgress('Inicializando análisis...', 'Preparando consultas a APIs');
    await delay(500);

    // Análisis Shodan
    updateProgress('Consultando Shodan...', `Analizando objetivo: ${config.target}`);
    try {
      const shodanResponse = await axios.get('/api/proxy', {
        params: {
          endpoint: 'activity',
          target: config.target
        }
      });

      if (shodanResponse.data.matches) {
        // Procesar puertos encontrados
        const ports = shodanResponse.data.matches
          .map((match: any) => match.port)
          .filter((port: number, index: number, self: number[]) => self.indexOf(port) === index);

        updateProgress('Análisis de puertos', `Puertos detectados: ${ports.join(', ')}`);

        // Procesar servicios y vulnerabilidades
        for (const match of shodanResponse.data.matches) {
          if (match.product) {
            updateProgress(
              'Detección de servicios',
              `Puerto ${match.port}: ${match.product}${match.version ? ` (v${match.version})` : ''}`
            );
          }
          if (match.vulns) {
            for (const [vuln, details] of Object.entries(match.vulns)) {
              updateProgress(
                'Vulnerabilidad detectada',
                `${vuln}: ${(details as any).summary} (CVSS: ${(details as any).cvss})`
              );
            }
          }
        }
      }
    } catch (error) {
      updateProgress('Error en Shodan', 'No se pudo obtener información de Shodan');
      console.error('Error en consulta Shodan:', error);
    }

    // Análisis URLScan
    updateProgress('Consultando URLScan...', 'Analizando presencia web');
    try {
      const urlscanResponse = await axios.get('/api/proxy', {
        params: {
          endpoint: 'threats',
          target: config.target
        }
      });

      if (urlscanResponse.data.results) {
        for (const result of urlscanResponse.data.results) {
          if (result.page) {
            updateProgress(
              'Análisis web',
              `Dominio analizado: ${result.page.domain}`
            );
          }
          if (result.stats) {
            updateProgress(
              'Estadísticas de seguridad',
              `Indicadores maliciosos: ${result.stats.malicious || 0}, Sospechosos: ${result.stats.suspicious || 0}`
            );
          }
          if (result.verdicts?.overall) {
            const verdict = result.verdicts.overall;
            updateProgress(
              'Veredicto de seguridad',
              `Puntuación: ${verdict.score}/100, Malicioso: ${verdict.malicious ? 'Sí' : 'No'}`
            );
          }
        }
      }
    } catch (error) {
      updateProgress('Error en URLScan', 'No se pudo obtener información de URLScan');
      console.error('Error en consulta URLScan:', error);
    }

    updateProgress('Análisis completado', 'Recopilación de información finalizada');
  } catch (error) {
    logError('Error en el análisis:', error);
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getScanSteps = (scanType: string, config: Record<string, any>): number => {
  switch (scanType) {
    case 'quick':
      return 10;
    case 'full':
      return 15;
    case 'ports':
      return config.portRange === 'full' ? 20 : 
             config.portRange === 'extended' ? 15 : 10;
    case 'web':
      return config.scanTypes === 'all' ? 18 : 12;
    case 'malware':
      return config.engineType === 'deep' ? 15 : 8;
    default:
      return 10;
  }
};

export const fetchRecentScans = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=scans');
    return response.data.total || 0;
  } catch (error) {
    logError('Error al obtener datos de escaneos:', error);
    return 0;
  }
};

export const fetchDataSources = async () => {
  try {
    const response = await axios.get('/api/proxy?endpoint=sources');
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    logError('Error al obtener fuentes de datos:', error);
    return 0;
  }
};

export const fetchSystemActivity = async (): Promise<SystemActivity[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=activity');
    
    if (!response.data.matches) {
      return [];
    }

    return response.data.matches.map((match: any) => ({
      timestamp: match.timestamp || format(new Date(), 'HH:mm'),
      value: match.port || 0,
      port: match.port,
      product: match.product,
      version: match.version,
      vulns: match.vulns
    }));
  } catch (error) {
    logError('Error al obtener actividad del sistema:', error);
    return [];
  }
};

export const fetchThreatData = async (): Promise<ThreatData[]> => {
  try {
    const response = await axios.get('/api/proxy?endpoint=threats');
    
    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((result: any) => ({
      timestamp: format(new Date(result.task?.time || Date.now()), 'HH:mm'),
      count: result.stats?.malicious || 0,
      type: result.verdicts?.overall?.malicious ? 'malicious' : 'suspicious',
      domain: result.page?.domain,
      score: result.verdicts?.overall?.score,
      malicious: result.verdicts?.overall?.malicious
    }));
  } catch (error) {
    logError('Error al obtener datos de amenazas:', error);
    return [];
  }
};