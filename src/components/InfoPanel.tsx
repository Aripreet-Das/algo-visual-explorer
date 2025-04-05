
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfoPanelProps {
  title: string;
  description: string;
  pseudocode: string;
  complexity: {
    time: string;
    space: string;
  };
  applications: string[];
}

const InfoPanel = ({ title, description, pseudocode, complexity, applications }: InfoPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-midnight-blue rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-light-gray mb-6">{description}</p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Algorithm</h3>
            <pre className="algorithm-code">{pseudocode}</pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Complexity Analysis</h3>
            <div className="space-y-2 text-light-gray">
              <p><span className="font-medium text-bright-blue">Time Complexity:</span> {complexity.time}</p>
              <p><span className="font-medium text-bright-blue">Space Complexity:</span> {complexity.space}</p>
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-2">Applications</h3>
            <ul className="list-disc list-inside text-light-gray space-y-1">
              {applications.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
        )}
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
    </div>
  );
};

export default InfoPanel;
