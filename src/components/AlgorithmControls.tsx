
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface AlgorithmControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (value: number[]) => void;
  disableBackward?: boolean;
  disableForward?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const AlgorithmControls = ({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  disableBackward = false,
  disableForward = false,
  currentStep = 0,
  totalSteps = 0
}: AlgorithmControlsProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-off-white text-sm">Animation Speed</h3>
          <span className="text-sm text-light-gray">{speed}x</span>
        </div>
        <div className="w-full">
          <Slider 
            value={[speed]} 
            min={0.5} 
            max={3} 
            step={0.5} 
            onValueChange={onSpeedChange}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full border border-white/10 bg-slate-900/50 hover:bg-slate-800/60"
            onClick={onStepBackward}
            disabled={disableBackward}
          >
            <SkipBack size={18} />
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 p-0"
              onClick={onPause}
            >
              <Pause size={24} />
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 p-0"
              onClick={onPlay}
            >
              <Play size={24} className="ml-1" />
            </Button>
          )}
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full border border-white/10 bg-slate-900/50 hover:bg-slate-800/60"
            onClick={onStepForward}
            disabled={disableForward}
          >
            <SkipForward size={18} />
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-900/50 hover:bg-slate-800/60 transition-all py-6"
          onClick={onReset}
        >
          <RefreshCw size={16} className="mr-1" />
          <span>Reset</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default AlgorithmControls;
