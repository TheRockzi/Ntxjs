import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export function LegalDisclaimer() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <FiShield className="text-4xl text-[#ff0000]" />
        <div>
          <h2 className="text-xl font-semibold text-white">Legal and Ethical Guidelines</h2>
          <p className="text-gray-400">Important considerations for OSINT investigations</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <FiAlertTriangle className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Legal Compliance</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Only collect publicly available information</li>
              <li>• Respect privacy laws and data protection regulations</li>
              <li>• Do not attempt to bypass security measures or access restricted data</li>
              <li>• Comply with platform-specific terms of service</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <FiCheckCircle className="text-[#00e5ff] text-xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Ethical Considerations</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Use information responsibly and professionally</li>
              <li>• Consider the potential impact on individuals and organizations</li>
              <li>• Maintain confidentiality of findings</li>
              <li>• Document sources and methodology</li>
              <li>• Report illegal activities to appropriate authorities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-8">
        <p>
          This tool is intended for legitimate research purposes only. Users are responsible for
          ensuring their investigations comply with all applicable laws and regulations.
        </p>
      </div>
    </div>
  );
}