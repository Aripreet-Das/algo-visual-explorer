
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, RefreshCw } from "lucide-react";

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
  disableForward = false
}: AlgorithmControlsProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-off-white">Animation Speed</h3>
          <span className="text-sm text-light-gray">{speed}x</span>
        </div>
        <div className="relative w-full h-6 flex items-center">
          <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-bright-coral to-bright-blue rounded-full overflow-hidden"></div>
          <Slider 
            value={[speed]} 
            min={0.5} 
            max={3} 
            step={0.5} 
            onValueChange={onSpeedChange} 
            className="relative z-10" 
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full border border-white/20 bg-dark-blue/50 hover:bg-dark-blue/70"
          onClick={onStepBackward}
          disabled={disableBackward}
        >
          <SkipBack size={18} />
        </Button>
        
        {isPlaying ? (
          <Button
            size="lg"
            className="bg-bright-green hover:bg-bright-green/90 h-14 w-14 rounded-full p-0 shadow-lg shadow-bright-green/20"
            onClick={onPause}
          >
            <Pause size={24} />
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-bright-green hover:bg-bright-green/90 h-14 w-14 rounded-full p-0 shadow-lg shadow-bright-green/20"
            onClick={onPlay}
          >
            <Play size={24} className="ml-1" />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full border border-white/20 bg-dark-blue/50 hover:bg-dark-blue/70"
          onClick={onStepForward}
          disabled={disableForward}
        >
          <SkipForward size={18} />
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 rounded-md border border-white/10 bg-dark-blue/30 hover:bg-dark-blue/50 transition-all"
        onClick={onReset}
      >
        <RefreshCw size={16} />
        <span>Reset</span>
      </Button>
    </div>
  );
};

export default AlgorithmControls;
