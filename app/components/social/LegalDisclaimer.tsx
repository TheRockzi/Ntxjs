import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export function LegalDisclaimer() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-[#00ff41]/10 mb-4"
        >
          <FiShield className="text-3xl text-[#00ff41]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Legal Guidelines</h2>
        <p className="text-gray-400">Important considerations for OSINT investigations</p>
      </div>

      {/* Legal Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-xl blur-xl opacity-0 
                      group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                     group-hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <FiAlertTriangle className="text-2xl text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Legal Compliance</h3>
          </div>
          
          <ul className="space-y-4">
            {[
              'Only collect publicly available information',
              'Respect privacy laws and data protection regulations',
              'Do not attempt to bypass security measures or access restricted data',
              'Comply with platform-specific terms of service'
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-300"
              >
                <div className="p-1 rounded bg-yellow-500/10 mt-1">
                  <FiAlertTriangle className="text-sm text-yellow-500" />
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Ethical Considerations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff]/20 to-transparent rounded-xl blur-xl opacity-0 
                      group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                     group-hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-[#00e5ff]/10">
              <FiCheckCircle className="text-2xl text-[#00e5ff]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Ethical Considerations</h3>
          </div>
          
          <ul className="space-y-4">
            {[
              'Use information responsibly and professionally',
              'Consider the potential impact on individuals and organizations',
              'Maintain confidentiality of findings',
              'Document sources and methodology',
              'Report illegal activities to appropriate authorities'
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-300"
              >
                <div className="p-1 rounded bg-[#00e5ff]/10 mt-1">
                  <FiCheckCircle className="text-sm text-[#00e5ff]" />
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/20 to-transparent rounded-xl blur-xl opacity-0 
                      group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                     group-hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-[#00ff41]/10">
              <FiShield className="text-2xl text-[#00ff41]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Important Notice</h3>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              This tool is intended for legitimate research purposes only. Users are responsible for
              ensuring their investigations comply with all applicable laws and regulations. Unauthorized
              use of this tool for malicious purposes is strictly prohibited and may result in legal
              consequences.
            </p>
            
            <div className="mt-6 p-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-lg">
              <p className="text-sm text-[#00ff41] font-medium">
                By using this tool, you acknowledge and agree to abide by these guidelines and
                accept full responsibility for your actions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}