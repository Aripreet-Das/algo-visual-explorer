
export interface Node {
  id: number;
  x: number;
  y: number;
  color: number; // -1 means no color
}

export interface Edge {
  source: number;
  target: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface GraphStep {
  nodeColors: number[];
  currentNode: number;
  action: 'color' | 'backtrack' | 'complete' | 'conflict';
  message: string;
}

export const colorGraph = (graph: Graph, numColors: number): GraphStep[] => {
  const { nodes, edges } = graph;
  const steps: GraphStep[] = [];
  const colors: number[] = Array(nodes.length).fill(-1);
  
  // Build adjacency list for efficient neighbor checking
  const adjacencyList: number[][] = Array(nodes.length).fill(null).map(() => []);
  edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    adjacencyList[edge.target].push(edge.source);
  });
  
  const isSafe = (node: number, color: number): boolean => {
    // Check if any adjacent node has the same color
    return !adjacencyList[node].some(neighbor => colors[neighbor] === color);
  };
  
  const colorNode = (nodeIndex: number): boolean => {
    if (nodeIndex >= nodes.length) {
      steps.push({
        nodeColors: [...colors],
        currentNode: -1,
        action: 'complete',
        message: 'Graph coloring complete! All nodes have been assigned colors.'
      });
      return true;
    }
    
    for (let color = 0; color < numColors; color++) {
      if (isSafe(nodeIndex, color)) {
        // Assign the color
        colors[nodeIndex] = color;
        steps.push({
          nodeColors: [...colors],
          currentNode: nodeIndex,
          action: 'color',
          message: `Coloring node ${nodeIndex + 1} with color ${color + 1}`
        });
        
        // Recursively color the rest of the nodes
        if (colorNode(nodeIndex + 1)) {
          return true;
        }
        
        // If this color doesn't lead to a solution, try another color
        colors[nodeIndex] = -1;
        steps.push({
          nodeColors: [...colors],
          currentNode: nodeIndex,
          action: 'backtrack',
          message: `Color ${color + 1} doesn't work for node ${nodeIndex + 1}, trying another color`
        });
      } else {
        steps.push({
          nodeColors: [...colors],
          currentNode: nodeIndex,
          action: 'conflict',
          message: `Cannot color node ${nodeIndex + 1} with color ${color + 1} due to conflicts`
        });
      }
    }
    
    // If no color works, backtrack
    steps.push({
      nodeColors: [...colors],
      currentNode: nodeIndex - 1,
      action: 'backtrack',
      message: `No valid color found for node ${nodeIndex + 1}, backtracking`
    });
    
    return false;
  };
  
  // Initialize with all nodes having no color
  steps.push({
    nodeColors: [...colors],
    currentNode: 0,
    action: 'color',
    message: 'Starting the graph coloring algorithm'
  });
  
  colorNode(0);
  
  return steps;
};

// Predefined example graphs
export const generateExampleGraphs = (): { [key: string]: Graph } => {
  // Helper to generate circle positions
  const generateCirclePositions = (count: number, radius: number, centerX: number = 400, centerY: number = 300) => {
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      nodes.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        color: -1
      });
    }
    return nodes;
  };

  return {
    complete4: {
      nodes: generateCirclePositions(4, 150),
      edges: [
        {source: 0, target: 1},
        {source: 0, target: 2},
        {source: 0, target: 3},
        {source: 1, target: 2},
        {source: 1, target: 3},
        {source: 2, target: 3}
      ]
    },
    star5: {
      nodes: [
        ...generateCirclePositions(4, 150),
        {id: 4, x: 400, y: 300, color: -1}
      ],
      edges: [
        {source: 0, target: 4},
        {source: 1, target: 4},
        {source: 2, target: 4},
        {source: 3, target: 4}
      ]
    },
    petersen: {
      nodes: [
        ...generateCirclePositions(5, 150),
        ...generateCirclePositions(5, 75)
      ],
      edges: [
        // Outer pentagon
        {source: 0, target: 1},
        {source: 1, target: 2},
        {source: 2, target: 3},
        {source: 3, target: 4},
        {source: 4, target: 0},
        // Connecting inner and outer
        {source: 0, target: 5},
        {source: 1, target: 6},
        {source: 2, target: 7},
        {source: 3, target: 8},
        {source: 4, target: 9},
        // Inner star
        {source: 5, target: 7},
        {source: 6, target: 8},
        {source: 7, target: 9},
        {source: 8, target: 5},
        {source: 9, target: 6}
      ]
    }
  };
};
