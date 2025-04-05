
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
    <div className="flex flex-col gap-6 bg-midnight-blue rounded-lg p-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-off-white">Animation Speed</h3>
          <span className="text-sm text-light-gray">{speed}x</span>
        </div>
        <Slider 
          value={[speed]} 
          min={0.5} 
          max={3} 
          step={0.5} 
          onValueChange={onSpeedChange} 
          className="w-full" 
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full"
          onClick={onStepBackward}
          disabled={disableBackward}
        >
          <SkipBack size={18} />
        </Button>
        
        {isPlaying ? (
          <Button
            size="lg"
            className="bg-bright-coral hover:bg-bright-coral/90 h-12 w-12 rounded-full p-0"
            onClick={onPause}
          >
            <Pause size={20} />
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-bright-green hover:bg-bright-green/90 h-12 w-12 rounded-full p-0"
            onClick={onPlay}
          >
            <Play size={20} />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full"
          onClick={onStepForward}
          disabled={disableForward}
        >
          <SkipForward size={18} />
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={onReset}
      >
        <RefreshCw size={16} />
        <span>Reset</span>
      </Button>
    </div>
  );
};

export default AlgorithmControls;
