
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
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.innerHTML = '';
    
    // Create SVG element with gradient background
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible'; // Allow nodes to overflow for effects
    
    // Add a subtle grid pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', '30');
    pattern.setAttribute('height', '30');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const gridLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gridLine1.setAttribute('d', 'M 30 0 L 0 0 0 30');
    gridLine1.setAttribute('fill', 'none');
    gridLine1.setAttribute('stroke', '#ffffff10');
    gridLine1.setAttribute('stroke-width', '0.5');
    
    pattern.appendChild(gridLine1);
    
    // Add definitions section for gradients and filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Drop shadow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'node-shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '0');
    feDropShadow.setAttribute('dy', '3');
    feDropShadow.setAttribute('stdDeviation', '3');
    feDropShadow.setAttribute('flood-color', '#000');
    feDropShadow.setAttribute('flood-opacity', '0.5');
    
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    
    // Add colors gradients
    colors.forEach((color, i) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      gradient.setAttribute('id', `node-gradient-${i}`);
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', color);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', adjustBrightness(color, -20));
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });
    
    svg.appendChild(defs);
    
    // Add pattern rect
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(bgRect);
    
    // Create edges first (to be below nodes)
    edges.forEach((edge, index) => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (!source || !target) return;
      
      const edgeId = `edge-${edge.source}-${edge.target}`;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('id', edgeId);
      line.setAttribute('x1', source.x.toString());
      line.setAttribute('y1', source.y.toString());
      line.setAttribute('x2', target.x.toString());
      line.setAttribute('y2', target.y.toString());
      
      const classes = ['graph-edge'];
      if (hoveredEdge === edgeId) classes.push('highlight');
      
      line.setAttribute('class', classes.join(' '));
      
      // Add event listeners for edge hover effects
      line.addEventListener('mouseover', () => {
        setHoveredEdge(edgeId);
      });
      
      line.addEventListener('mouseout', () => {
        setHoveredEdge(null);
      });
      
      svg.appendChild(line);
    });
    
    // Create nodes
    nodes.forEach(node => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('class', 'node-group');
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '20');
      
      // Apply styling based on node state
      const classes = ['graph-node'];
      if (node.id === currentNode) classes.push('selected');
      if (node.id === selectedNode) classes.push('selected');
      if (node.id === hoveredNode) classes.push('hover');
      
      circle.setAttribute('class', classes.join(' '));
      circle.setAttribute('filter', 'url(#node-shadow)');
      
      // Set color if assigned
      if (node.color !== -1 && colors[node.color]) {
        circle.setAttribute('fill', `url(#node-gradient-${node.color})`);
      } else {
        circle.setAttribute('fill', '#47B5FF');
      }
      
      // Add glow effect for selected/hovered node
      if (node.id === selectedNode || node.id === hoveredNode || node.id === currentNode) {
        const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle.setAttribute('cx', node.x.toString());
        glowCircle.setAttribute('cy', node.y.toString());
        glowCircle.setAttribute('r', '24');
        glowCircle.setAttribute('fill', 'none');
        glowCircle.setAttribute('stroke', node.id === currentNode ? '#E94560' : '#ffffff');
        glowCircle.setAttribute('stroke-width', '2');
        glowCircle.setAttribute('stroke-dasharray', '4,4');
        glowCircle.setAttribute('class', 'node-glow');
        nodeGroup.appendChild(glowCircle);
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
      
      // Add event listeners for hover effects
      circle.addEventListener('mouseover', () => {
        setHoveredNode(node.id);
      });
      
      circle.addEventListener('mouseout', () => {
        setHoveredNode(null);
      });
      
      nodeGroup.appendChild(circle);
      
      // Add node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', node.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', 'bold');
      text.textContent = (node.id + 1).toString();
      nodeGroup.appendChild(text);
      
      svg.appendChild(nodeGroup);
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
      
      // Add edit mode indicator
      if (isEditing) {
        const editText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        editText.setAttribute('x', '10');
        editText.setAttribute('y', '20');
        editText.setAttribute('fill', '#E94560');
        editText.setAttribute('font-size', '12px');
        editText.textContent = 'Edit Mode: Click to add nodes, click two nodes to connect';
        svg.appendChild(editText);
      }
    }
    
    canvas.appendChild(svg);
    
    return () => {
      // Clean up event listeners if needed
    };
  }, [nodes, edges, currentNode, colors, selectedNode, hoveredNode, hoveredEdge, isEditing, isDragging, onNodeClick, onAddNode, onAddEdge]);

  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00FF) + percent;
    const b = (num & 0x0000FF) + percent;
    
    const newR = r > 255 ? 255 : (r < 0 ? 0 : r);
    const newG = g > 255 ? 255 : (g < 0 ? 0 : g);
    const newB = b > 255 ? 255 : (b < 0 ? 0 : b);
    
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
  };

  return (
    <div 
      ref={canvasRef} 
      className="graph-canvas w-full h-full rounded-lg"
    ></div>
  );
};

export default GraphCanvas;
