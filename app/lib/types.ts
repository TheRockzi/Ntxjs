export interface SocialProfile {
  id: string;
  username: string;
  platform: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar: string;
  url: string;
  lastActive: string;
  connections?: number;
}

export interface ImageAnalysisResult {
  exif?: {
    dateTaken?: string;
    location?: string;
    camera?: string;
    settings?: {
      aperture?: string;
      exposure?: string;
      iso?: number;
    };
  };
  reverseSearch?: {
    title: string;
    url: string;
    domain: string;
    thumbnail: string;
    dateFound: string;
  }[];
}

export interface TimelineEvent {
  date: string;
  description: string;
  platform: string;
  type: string;
}

export interface CorrelationData {
  timeline: TimelineEvent[];
  connections: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      type: string;
    }>;
  };
}