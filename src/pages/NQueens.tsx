import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import ChessBoard from '@/components/ChessBoard';
import AlgorithmControls from '@/components/AlgorithmControls';
import InfoPanel from '@/components/InfoPanel';
import { solveNQueens, countNQueensSolutions, NQueensStep } from '@/utils/nQueensAlgorithm';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const NQueens = () => {
  const { toast } = useToast();
  const [boardSize, setBoardSize] = useState<number>(8);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [queens, setQueens] = useState<number[]>(Array(boardSize).fill(-1));
  const [steps, setSteps] = useState<NQueensStep[]>([]);
  const [solutionsCount, setSolutionsCount] = useState<number | null>(null);
  const [currentRow, setCurrentRow] = useState<number>(-1);
  const animationRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    resetBoard();
    
    const count = countNQueensSolutions(boardSize);
    setSolutionsCount(count);
    
    toast({
      title: `N-Queens (${boardSize}×${boardSize})`,
      description: `This board has ${count} possible solution${count !== 1 ? 's' : ''}.`,
    });
  }, [boardSize]);
  
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) lastStepTimeRef.current = timestamp;
        
        const elapsed = timestamp - lastStepTimeRef.current;
        const stepDuration = 1000 / speed;
        
        if (elapsed >= stepDuration) {
          lastStepTimeRef.current = timestamp;
          
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }
        
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, steps, currentStepIndex, speed]);
  
  useEffect(() => {
    if (steps.length > 0) {
      setProgress((currentStepIndex / (steps.length - 1)) * 100);
      
      if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setQueens(step.queens);
        setCurrentRow(step.currentRow);
        
        if (step.action === 'complete') {
          toast({
            title: "Solution Found!",
            description: "Successfully placed all queens on the board.",
            variant: "default"
          });
        }
      }
    }
  }, [steps, currentStepIndex]);
  
  const resetBoard = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    const emptyBoard = Array(boardSize).fill(-1);
    setQueens(emptyBoard);
    setCurrentRow(0);
    
    if (!isManualMode) {
      const newSteps = solveNQueens(boardSize);
      setSteps(newSteps);
      setProgress(0);
    } else {
      setSteps([]);
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    lastStepTimeRef.current = 0;
  };
  
  const handleCellClick = (row: number, col: number) => {
    if (!isManualMode) return;
    
    const newQueens = [...queens];
    
    newQueens[row] = newQueens[row] === col ? -1 : col;
    setQueens(newQueens);
    
    const isSolved = checkBoardSolution(newQueens);
    if (isSolved) {
      toast({
        title: "Congratulations!",
        description: "You've successfully solved the N-Queens problem!",
        variant: "default"
      });
    }
  };
  
  const checkBoardSolution = (queenPositions: number[]): boolean => {
    if (queenPositions.includes(-1)) return false;
    
    for (let i = 0; i < queenPositions.length; i++) {
      for (let j = i + 1; j < queenPositions.length; j++) {
        const row1 = i;
        const col1 = queenPositions[i];
        const row2 = j;
        const col2 = queenPositions[j];
        
        if (col1 === col2) return false;
        
        if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) return false;
      }
    }
    
    return true;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        <span className="text-bright-coral">N-Queens</span> Problem
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Board Size</Label>
                <Select 
                  value={boardSize.toString()} 
                  onValueChange={(value) => setBoardSize(parseInt(value))}
                  disabled={isPlaying}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select board size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} × {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="manual-mode" 
                  checked={isManualMode}
                  onCheckedChange={setIsManualMode}
                  disabled={isPlaying}
                />
                <Label htmlFor="manual-mode">Manual Mode</Label>
              </div>
              
              {solutionsCount !== null && (
                <div className="bg-dark-blue/30 rounded-md p-4">
                  <p className="text-sm">
                    Total possible solutions: 
                    <span className="font-semibold text-bright-coral ml-1">
                      {solutionsCount}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <InfoPanel 
            title="N-Queens Problem"
            description="Place N queens on an N×N chessboard so that no two queens threaten each other. A solution requires that no two queens share the same row, column, or diagonal."
            pseudocode={`function solveNQueens(row, n):
  if row == n:
    return true # All queens are placed
    
  for column in 0 to n-1:
    if isSafe(row, column):
      place queen at (row, column)
      
      if solveNQueens(row+1, n):
        return true # Found a solution
        
      remove queen from (row, column) # Backtrack
      
  return false # No solution in this path`}
            complexity={{
              time: "O(N!)",
              space: "O(N)"
            }}
            applications={[
              "Chess and similar games",
              "Circuit design and testing",
              "VLSI testing",
              "Parallel memory storage schemes",
              "Network routing algorithms"
            ]}
          />
        </div>
        
        <div className="lg:col-span-2">
          <motion.div 
            className="card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {steps.length > 0 && !isManualMode && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-light-gray">
                    Step {currentStepIndex + 1} of {steps.length}
                  </h3>
                  <span className="text-xs bg-slate-800 rounded-full px-2 py-0.5">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-1.5 mb-4" 
                />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-dark-blue/30 rounded-md p-4"
                  >
                    <p className="font-medium text-off-white">
                      {steps[currentStepIndex].message}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            
            <ChessBoard 
              size={boardSize}
              queens={queens}
              currentRow={!isManualMode ? currentRow : -1}
              onCellClick={handleCellClick}
              isManual={isManualMode}
            />
            
            {!isManualMode && (
              <div className="mt-8">
                <AlgorithmControls 
                  isPlaying={isPlaying}
                  speed={speed}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onReset={resetBoard}
                  onStepForward={() => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
                  onStepBackward={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  onSpeedChange={([newSpeed]) => setSpeed(newSpeed)}
                  disableBackward={currentStepIndex === 0}
                  disableForward={currentStepIndex === steps.length - 1}
                  currentStep={currentStepIndex + 1}
                  totalSteps={steps.length}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NQueens;
