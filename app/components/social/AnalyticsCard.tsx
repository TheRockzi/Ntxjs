import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    timeframe: string;
  };
  icon: IconType;
  color: string;
  metric?: string;
  tooltipContent?: string;
  onClick?: () => void;
}

export function AnalyticsCard({
  title,
  value,
  trend,
  icon: Icon,
  color,
  metric,
  tooltipContent,
  onClick
}: AnalyticsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          filter: 'blur(8px)'
        }}
      />
      
      <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6
                    hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Background Accent */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-16 -translate-y-16 rounded-full"
          style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="text-xl" style={{ color }} />
            </div>
            <h3 className="text-gray-400 font-medium">{title}</h3>
          </div>
          
          {tooltipContent && (
            <div className="group/tooltip relative">
              <div className="w-1 h-1 rounded-full bg-white/40 group-hover/tooltip:bg-white/60" />
              <div className="absolute right-0 top-6 w-48 p-2 bg-black/90 rounded-lg border border-white/10
                          text-xs text-gray-400 opacity-0 group-hover/tooltip:opacity-100
                          transition-opacity duration-200 pointer-events-none z-10">
                {tooltipContent}
              </div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white">{value}</span>
            {metric && (
              <span className="text-sm text-gray-500">{metric}</span>
            )}
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-2">
            <div 
              className={`flex items-center gap-1 px-2 py-1 rounded text-sm
                       ${trend.isPositive ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}
            >
              {trend.isPositive ? (
                <FiTrendingUp className="text-lg" />
              ) : (
                <FiTrendingDown className="text-lg" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-sm text-gray-500">vs {trend.timeframe}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}