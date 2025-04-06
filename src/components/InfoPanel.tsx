
import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoPanelProps {
  title: string;
  description: string;
  pseudocode: string;
  complexity: {
    time: string;
    space: string;
  };
  applications: string[];
  detailedInfo?: string;
}

const InfoPanel = ({ title, description, pseudocode, complexity, applications, detailedInfo }: InfoPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel shadow-lg backdrop-blur-md bg-midnight-blue/80 border border-white/10 rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-500">
            <Info size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gradient bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{title}</h2>
            <p className="text-light-gray mb-6 leading-relaxed">{description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Algorithm</h3>
            <pre className="algorithm-code overflow-x-auto scrollbar-none">{pseudocode}</pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Complexity Analysis</h3>
            <div className="space-y-2 text-light-gray">
              <p className="flex items-center"><span className="font-medium text-bright-blue w-36">Time Complexity:</span> {complexity.time}</p>
              <p className="flex items-center"><span className="font-medium text-bright-blue w-36">Space Complexity:</span> {complexity.space}</p>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              <h3 className="text-lg font-medium mb-2 text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Applications</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-light-gray">
                {applications.map((app, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-bright-coral"></div>
                    {app}
                  </li>
                ))}
              </ul>
              
              {detailedInfo && (
                <div className="mt-6 text-light-gray prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: detailedInfo }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <button
        className="w-full py-2 px-6 flex items-center justify-center gap-2 bg-dark-blue/30 text-sm text-light-gray hover:text-off-white transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <span>Show Less</span>
            <ChevronUp size={16} />
          </>
        ) : (
          <>
            <span>Show More</span>
            <ChevronDown size={16} />
          </>
        )}
      </button>
    </motion.div>
  );
};

export default InfoPanel;
