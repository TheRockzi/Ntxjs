import { FiUsers, FiActivity, FiGlobe, FiAlertCircle } from 'react-icons/fi';
import { AnalyticsCard } from './AnalyticsCard';

interface AnalyticsData {
  profiles: number;
  activity: number;
  reach: number;
  risks: number;
  trends: {
    profiles: number;
    activity: number;
    reach: number;
    risks: number;
  };
}

interface AnalyticsGridProps {
  data: AnalyticsData;
}

export function AnalyticsGrid({ data }: AnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        title="Active Profiles"
        value={data.profiles}
        trend={{
          value: data.trends.profiles,
          isPositive: data.trends.profiles > 0,
          timeframe: 'last month'
        }}
        icon={FiUsers}
        color="#ff0000"
        tooltipContent="Total number of active social media profiles detected"
      />

      <AnalyticsCard
        title="Activity Score"
        value={data.activity}
        trend={{
          value: data.trends.activity,
          isPositive: data.trends.activity > 0,
          timeframe: 'last week'
        }}
        icon={FiActivity}
        color="#00e5ff"
        metric="points"
        tooltipContent="Engagement and activity level across all platforms"
      />

      <AnalyticsCard
        title="Digital Reach"
        value={data.reach.toLocaleString()}
        trend={{
          value: data.trends.reach,
          isPositive: data.trends.reach > 0,
          timeframe: 'last month'
        }}
        icon={FiGlobe}
        color="#bc13fe"
        tooltipContent="Estimated total reach across all platforms"
      />

      <AnalyticsCard
        title="Risk Factors"
        value={data.risks}
        trend={{
          value: data.trends.risks,
          isPositive: data.trends.risks < 0,
          timeframe: 'last week'
        }}
        icon={FiAlertCircle}
        color="#ff003c"
        tooltipContent="Identified security and privacy risk factors"
      />
    </div>
  );
}