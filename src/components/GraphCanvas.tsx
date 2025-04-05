
import { useRef, useEffect, useState } from 'react';
import { type Node, type Edge } from '../utils/graphColoringAlgorithm';

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  currentNode?: number;
  onNodeClick?: (nodeId: number) => void;
  colors?: string[];
  isEditing?: boolean;
  onAddNode?: (x: number, y: number) => void;
  onAddEdge?: (source: number, target: number) => void;
}

const DEFAULT_COLORS = [
  '#E94560', // coral
  '#47B5FF', // blue
  '#4CAF50', // green
  '#FFC107', // amber
  '#9C27B0', // purple
  '#FF9800', // orange
];

const GraphCanvas = ({ 
  nodes, 
  edges, 
  currentNode = -1, 
  onNodeClick,
  colors = DEFAULT_COLORS,
  isEditing = false,
  onAddNode,
  onAddEdge
}: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    canvas.appendChild(svg);
    
    // Create edges first (to be below nodes)
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (!source || !target) return;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', source.x.toString());
      line.setAttribute('y1', source.y.toString());
      line.setAttribute('x2', target.x.toString());
      line.setAttribute('y2', target.y.toString());
      line.setAttribute('class', 'graph-edge');
      svg.appendChild(line);
    });
    
    // Create nodes
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '20');
      
      // Apply styling based on node state
      const classes = ['graph-node'];
      if (node.id === currentNode) classes.push('selected');
      if (node.id === selectedNode) classes.push('selected');
      
      circle.setAttribute('class', classes.join(' '));
      
      // Set color if assigned
      if (node.color !== -1 && colors[node.color]) {
        circle.setAttribute('fill', colors[node.color]);
      }
      
      // Add event listener for node click
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isEditing && selectedNode !== null && selectedNode !== node.id) {
          // Create an edge
          onAddEdge && onAddEdge(selectedNode, node.id);
          setSelectedNode(null);
        } else {
          setSelectedNode(node.id);
          onNodeClick && onNodeClick(node.id);
        }
      });
      
      svg.appendChild(circle);
      
      // Add node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', node.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12px');
      text.textContent = (node.id + 1).toString();
      svg.appendChild(text);
    });
    
    // Add click handler for adding nodes in edit mode
    if (isEditing) {
      svg.addEventListener('click', (e: MouseEvent) => {
        if (isDragging) {
          setIsDragging(false);
          return;
        }
        
        // Get click coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        onAddNode && onAddNode(x, y);
        setSelectedNode(null);
      });
      
      // Add handlers for drag detection
      svg.addEventListener('mousedown', () => {
        setIsDragging(false);
      });
      
      svg.addEventListener('mousemove', () => {
        setIsDragging(true);
      });
    }
    
    return () => {
      // Clean up event listeners if needed
    };
  }, [nodes, edges, currentNode, colors, selectedNode, isEditing, isDragging, onNodeClick, onAddNode, onAddEdge]);

  return (
    <div 
      ref={canvasRef} 
      className="graph-canvas w-full h-full rounded-lg"
    ></div>
  );
};

export default GraphCanvas;
