
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import GraphCanvas from '@/components/GraphCanvas';
import InfoPanel from '@/components/InfoPanel';
import { 
  colorGraph, 
  generateExampleGraphs, 
  type Graph, 
  type Node, 
  type Edge, 
  type GraphStep 
} from '@/utils/graphColoringAlgorithm';
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Edit3, 
  Trash2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw 
} from 'lucide-react';

const GraphColoring = () => {
  const { toast } = useToast();
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [numColors, setNumColors] = useState<number>(3);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [exampleGraphs, setExampleGraphs] = useState<{[key: string]: Graph}>({});
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [colors] = useState<string[]>([
    '#E94560', // coral
    '#47B5FF', // blue
    '#4CAF50', // green
    '#FFC107', // amber
    '#9C27B0', // purple
    '#FF9800', // orange
  ]);
  const [animationTimerId, setAnimationTimerId] = useState<number | null>(null);
  
  useEffect(() => {
    // Initialize with example graphs
    const examples = generateExampleGraphs();
    setExampleGraphs(examples);
    
    // Set default graph
    setGraph(examples.complete4);
    setSelectedExample('complete4');
  }, []);
  
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const timerId = window.setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / speed);
      
      setAnimationTimerId(timerId);
      return () => {
        if (timerId) clearTimeout(timerId);
      };
    }
  }, [isPlaying, currentStepIndex, steps, speed]);
  
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      
      // Update node colors
      const updatedNodes = graph.nodes.map((node, index) => ({
        ...node,
        color: step.nodeColors[index]
      }));
      
      setGraph(prev => ({
        ...prev,
        nodes: updatedNodes
      }));
      
      // Show toast for significant steps
      if (step.action === 'complete') {
        toast({
          title: "Solution Found!",
          description: "Successfully colored all nodes of the graph.",
          variant: "default"
        });
      }
    }
  }, [steps, currentStepIndex]);
  
  const handleExampleSelect = (example: string) => {
    if (exampleGraphs[example]) {
      resetVisualization();
      setGraph(exampleGraphs[example]);
      setSelectedExample(example);
    }
  };
  
  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    
    if (animationTimerId) {
      clearTimeout(animationTimerId);
      setAnimationTimerId(null);
    }
    
    // Reset node colors
    const resetNodes = graph.nodes.map(node => ({
      ...node,
      color: -1
    }));
    
    setGraph(prev => ({
      ...prev,
      nodes: resetNodes
    }));
    
    if (!isEditMode) {
      const newSteps = colorGraph(graph, numColors);
      setSteps(newSteps);
    } else {
      setSteps([]);
    }
  };
  
  const handleAddNode = (x: number, y: number) => {
    if (!isEditMode) return;
    
    const newNode: Node = {
      id: graph.nodes.length,
      x,
      y,
      color: -1
    };
    
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    
    toast({
      description: `Node ${newNode.id + 1} added`,
    });
  };
  
  const handleAddEdge = (source: number, target: number) => {
    if (!isEditMode) return;
    
    // Check if edge already exists
    const edgeExists = graph.edges.some(
      edge => (edge.source === source && edge.target === target) || 
             (edge.source === target && edge.target === source)
    );
    
    if (edgeExists) {
      toast({
        title: "Edge already exists",
        description: `Edge between nodes ${source + 1} and ${target + 1} already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    const newEdge: Edge = { source, target };
    
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }));
    
    toast({
      description: `Edge added between nodes ${source + 1} and ${target + 1}`,
    });
  };
  
  const handleClearGraph = () => {
    setGraph({ nodes: [], edges: [] });
    setSelectedExample('');
    resetVisualization();
    
    toast({
      description: "Graph cleared",
    });
  };
  
  const handleRunAlgorithm = () => {
    if (graph.nodes.length === 0) {
      toast({
        title: "No nodes",
        description: "Please create or select a graph first.",
        variant: "destructive"
      });
      return;
    }
    
    resetVisualization();
    const newSteps = colorGraph(graph, numColors);
    setSteps(newSteps);
    
    toast({
      title: "Algorithm Ready",
      description: `Graph coloring algorithm prepared with ${numColors} colors.`,
    });
  };
  
  const progressPercentage = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        <span className="text-gradient-primary bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Graph Coloring</span> Problem
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left panel - Settings and info */}
        <div className="space-y-8">
          <div className="glass-panel shadow-lg border border-white/10 rounded-lg p-6 backdrop-blur-md bg-midnight-blue/80">
            <h2 className="text-xl font-semibold mb-4 text-gradient bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Settings</h2>
            <div className="space-y-6">
              <Tabs defaultValue="examples" className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="examples" className="data-[state=active]:bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 data-[state=active]:text-white">Examples</TabsTrigger>
                  <TabsTrigger value="custom" className="data-[state=active]:bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 data-[state=active]:text-white">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="examples" className="space-y-4 pt-2 focus-visible:outline-none">
                  <div className="space-y-2">
                    <Label className="text-light-gray">Example Graphs</Label>
                    <Select 
                      value={selectedExample} 
                      onValueChange={handleExampleSelect}
                    >
                      <SelectTrigger className="bg-dark-blue/30 border-white/10">
                        <SelectValue placeholder="Select a graph" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete4">Complete Graph (K4)</SelectItem>
                        <SelectItem value="star5">Star Graph (5 nodes)</SelectItem>
                        <SelectItem value="petersen">Petersen Graph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4 pt-2 focus-visible:outline-none">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-mode" 
                      checked={isEditMode}
                      onCheckedChange={setIsEditMode}
                      disabled={isPlaying}
                      className="data-[state=checked]:bg-gradient-to-r from-rose-500 to-purple-500"
                    />
                    <Label htmlFor="edit-mode" className="text-light-gray">Edit Mode</Label>
                  </div>
                  
                  {isEditMode && (
                    <div className="neo-blur rounded-md p-4 space-y-3">
                      <p className="text-sm text-light-gray">
                        <strong>To add a node:</strong> Click on the canvas
                      </p>
                      <p className="text-sm text-light-gray">
                        <strong>To add an edge:</strong> Click first node, then click second node
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full mt-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all"
                        onClick={handleClearGraph}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear Graph
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2">
                <Label className="text-light-gray">Number of Colors</Label>
                <Select 
                  value={numColors.toString()} 
                  onValueChange={(value) => setNumColors(parseInt(value))}
                >
                  <SelectTrigger className="bg-dark-blue/30 border-white/10">
                    <SelectValue placeholder="Select number of colors" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Colors
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 hover:from-rose-600 hover:via-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/20 transition-all"
                  onClick={handleRunAlgorithm}
                  disabled={isPlaying || isEditMode}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Run Algorithm
                </Button>
              </motion.div>
            </div>
          </div>
          
          <InfoPanel 
            title="Graph Coloring Problem"
            description="Assign colors to vertices of a graph such that no two adjacent vertices share the same color. The goal is to minimize the number of colors used."
            pseudocode={`function colorGraph(graph, numColors):
  function isSafe(node, color):
    for each neighbor of node:
      if color of neighbor == color:
        return false
    return true
    
  function colorNode(nodeIndex):
    if nodeIndex == graph.length:
      return true # All nodes colored
      
    for color in 0 to numColors-1:
      if isSafe(nodeIndex, color):
        set node color to color
        
        if colorNode(nodeIndex + 1):
          return true # Solution found
          
        set node color to no-color # Backtrack
        
    return false # No solution with current colors
    
  colorNode(0)`}
            complexity={{
              time: "O(M^N) where M is colors and N is nodes",
              space: "O(N)"
            }}
            applications={[
              "Map coloring",
              "Scheduling problems",
              "Register allocation in compilers",
              "Frequency assignment in mobile networks",
              "Pattern matching and image segmentation"
            ]}
          />
        </div>
        
        {/* Center panel - Graph Canvas */}
        <div className="lg:col-span-2">
          <div className="glass-panel shadow-xl backdrop-blur-md bg-midnight-blue/80 border border-white/10 rounded-lg p-6 overflow-hidden">
            {steps.length > 0 && !isEditMode && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-light-gray">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <span className="text-sm text-light-gray">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                
                <Progress value={progressPercentage} className="h-2.5 bg-slate-800/50" 
                  style={{
                    backgroundImage: 'linear-gradient(to right, #e94560, #9c27b0, #47b5ff)',
                    backgroundSize: `${progressPercentage}% 100%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                
                <div className="neo-blur rounded-md p-4 mt-4 border border-white/10">
                  <p className="font-medium text-off-white">
                    {steps[currentStepIndex].message}
                  </p>
                </div>
              </div>
            )}
            
            {isEditMode && (
              <div className="mb-6 neo-blur rounded-md p-4 flex items-center gap-2 border border-bright-blue/30">
                <Edit3 className="text-bright-blue h-5 w-5" />
                <p className="text-sm">
                  Edit Mode: {graph.nodes.length} nodes, {graph.edges.length} edges
                </p>
              </div>
            )}
            
            <div className="w-full aspect-video bg-[#0f172b] rounded-lg overflow-hidden border border-white/5 shadow-inner shadow-black/40">
              <GraphCanvas 
                nodes={graph.nodes}
                edges={graph.edges}
                currentNode={steps[currentStepIndex]?.currentNode}
                colors={colors.slice(0, numColors)}
                isEditing={isEditMode}
                onAddNode={handleAddNode}
                onAddEdge={handleAddEdge}
              />
            </div>
            
            {!isEditMode && steps.length > 0 && (
              <div className="mt-8 px-2">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-off-white text-sm">Animation Speed</h3>
                      <span className="text-sm text-light-gray">{speed}x</span>
                    </div>
                    <Slider 
                      value={[speed]} 
                      min={0.5} 
                      max={3} 
                      step={0.5} 
                      onValueChange={([newSpeed]) => setSpeed(newSpeed)}
                      className="w-full"
                    />
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
                        onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                        disabled={currentStepIndex === 0}
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
                          onClick={() => setIsPlaying(false)}
                        >
                          <Pause size={24} />
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 p-0"
                          onClick={() => setIsPlaying(true)}
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
                        onClick={() => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
                        disabled={currentStepIndex === steps.length - 1}
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
                      onClick={resetVisualization}
                    >
                      <RotateCcw size={16} className="mr-1" />
                      <span>Reset</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphColoring;
