
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
    
    // Create SVG element with dark background
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible'; // Allow nodes to overflow for effects
    
    // Add a grid pattern for background
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', '30');
    pattern.setAttribute('height', '30');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const gridLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gridLine1.setAttribute('d', 'M 30 0 L 0 0 0 30');
    gridLine1.setAttribute('fill', 'none');
    gridLine1.setAttribute('stroke', '#ffffff08');
    gridLine1.setAttribute('stroke-width', '0.5');
    
    pattern.appendChild(gridLine1);
    
    // Add definitions section for gradients and filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(pattern);
    
    // Drop shadow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'node-shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '0');
    feDropShadow.setAttribute('dy', '4');
    feDropShadow.setAttribute('stdDeviation', '4');
    feDropShadow.setAttribute('flood-color', '#000');
    feDropShadow.setAttribute('flood-opacity', '0.5');
    
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    
    // Glow filter for selected nodes
    const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glowFilter.setAttribute('id', 'node-glow');
    glowFilter.setAttribute('x', '-50%');
    glowFilter.setAttribute('y', '-50%');
    glowFilter.setAttribute('width', '200%');
    glowFilter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'blur');
    
    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-color', '#47B5FF');
    feFlood.setAttribute('flood-opacity', '0.7');
    feFlood.setAttribute('result', 'color');
    
    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'blur');
    feComposite.setAttribute('result', 'glow');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'glow');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    glowFilter.appendChild(feGaussianBlur);
    glowFilter.appendChild(feFlood);
    glowFilter.appendChild(feComposite);
    glowFilter.appendChild(feMerge);
    defs.appendChild(glowFilter);
    
    // Add color gradients for nodes
    colors.forEach((color, i) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      gradient.setAttribute('id', `node-gradient-${i}`);
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', lightenColor(color, 20));
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', color);
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });
    
    // Add white outline gradient for nodes
    const whiteOutline = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    whiteOutline.setAttribute('id', 'white-outline');
    
    const whiteStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    whiteStop1.setAttribute('offset', '0%');
    whiteStop1.setAttribute('stop-color', 'rgba(255, 255, 255, 0.9)');
    
    const whiteStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    whiteStop2.setAttribute('offset', '100%');
    whiteStop2.setAttribute('stop-color', 'rgba(255, 255, 255, 0.5)');
    
    whiteOutline.appendChild(whiteStop1);
    whiteOutline.appendChild(whiteStop2);
    defs.appendChild(whiteOutline);
    
    svg.appendChild(defs);
    
    // Add pattern rect as background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(bgRect);
    
    // Create edges first (to be below nodes)
    edges.forEach((edge) => {
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
      
      const isHighlighted = hoveredEdge === edgeId;
      const isActive = currentNode === source.id || currentNode === target.id;
      
      // Style edges based on their state
      if (isHighlighted) {
        line.setAttribute('stroke', '#E94560');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', '5,5');
      } else if (isActive) {
        line.setAttribute('stroke', 'rgba(255,255,255,0.7)');
        line.setAttribute('stroke-width', '2.5');
      } else {
        line.setAttribute('stroke', 'rgba(255,255,255,0.4)');
        line.setAttribute('stroke-width', '2');
      }
      
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
      circle.setAttribute('r', '24');
      
      // White outline for all nodes
      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outline.setAttribute('cx', node.x.toString());
      outline.setAttribute('cy', node.y.toString());
      outline.setAttribute('r', '26');
      outline.setAttribute('fill', 'none');
      outline.setAttribute('stroke', 'url(#white-outline)');
      outline.setAttribute('stroke-width', '2');
      nodeGroup.appendChild(outline);
      
      // Apply styling based on node state
      if (node.id === currentNode) {
        circle.setAttribute('filter', 'url(#node-glow)');
      } else {
        circle.setAttribute('filter', 'url(#node-shadow)');
      }
      
      // Set color if assigned
      if (node.color !== -1 && colors[node.color]) {
        circle.setAttribute('fill', `url(#node-gradient-${node.color})`);
      } else if (node.id === currentNode) {
        // Highlight current node with a different color if not colored yet
        circle.setAttribute('fill', '#E94560');
      } else {
        circle.setAttribute('fill', '#2c3e50');
      }
      
      // Add glow effect for selected/hovered node
      if (node.id === hoveredNode || node.id === selectedNode) {
        const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle.setAttribute('cx', node.x.toString());
        glowCircle.setAttribute('cy', node.y.toString());
        glowCircle.setAttribute('r', '28');
        glowCircle.setAttribute('fill', 'none');
        glowCircle.setAttribute('stroke', '#ffffff');
        glowCircle.setAttribute('stroke-width', '2');
        glowCircle.setAttribute('stroke-dasharray', '4,4');
        nodeGroup.appendChild(glowCircle);
        
        // Animate dasharray for selected node
        if (node.id === selectedNode) {
          const animateStroke = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
          animateStroke.setAttribute('attributeName', 'stroke-dashoffset');
          animateStroke.setAttribute('from', '0');
          animateStroke.setAttribute('to', '8');
          animateStroke.setAttribute('dur', '1s');
          animateStroke.setAttribute('repeatCount', 'indefinite');
          glowCircle.appendChild(animateStroke);
        }
      }
      
      // Add pulsing animation for current node
      if (node.id === currentNode) {
        const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulseCircle.setAttribute('cx', node.x.toString());
        pulseCircle.setAttribute('cy', node.y.toString());
        pulseCircle.setAttribute('r', '28');
        pulseCircle.setAttribute('fill', 'none');
        pulseCircle.setAttribute('stroke', '#E94560');
        pulseCircle.setAttribute('stroke-width', '3');
        
        const animatePulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animatePulse.setAttribute('attributeName', 'r');
        animatePulse.setAttribute('from', '24');
        animatePulse.setAttribute('to', '32');
        animatePulse.setAttribute('dur', '1.5s');
        animatePulse.setAttribute('repeatCount', 'indefinite');
        
        const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateOpacity.setAttribute('attributeName', 'opacity');
        animateOpacity.setAttribute('from', '0.8');
        animateOpacity.setAttribute('to', '0');
        animateOpacity.setAttribute('dur', '1.5s');
        animateOpacity.setAttribute('repeatCount', 'indefinite');
        
        pulseCircle.appendChild(animatePulse);
        pulseCircle.appendChild(animateOpacity);
        nodeGroup.appendChild(pulseCircle);
      }
      
      nodeGroup.appendChild(circle);
      
      // Add node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x.toString());
      text.setAttribute('y', node.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '14px');
      text.setAttribute('font-weight', 'bold');
      text.textContent = (node.id + 1).toString();
      nodeGroup.appendChild(text);
      
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
  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00FF) + amt;
    const b = (num & 0x0000FF) + amt;
    
    const newR = Math.min(255, Math.max(0, r));
    const newG = Math.min(255, Math.max(0, g));
    const newB = Math.min(255, Math.max(0, b));
    
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
  };

  return (
    <div 
      ref={canvasRef} 
      className="graph-canvas w-full h-full rounded-lg border border-white/10"
      style={{
        boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.4)"
      }}
    ></div>
  );
};

export default GraphCanvas;
