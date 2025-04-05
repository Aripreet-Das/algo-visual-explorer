
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChessBoardProps {
  size: number;
  queens: number[];
  currentRow?: number;
  onCellClick?: (row: number, col: number) => void;
  isManual?: boolean;
}

const ChessBoard = ({ size, queens, currentRow = -1, onCellClick, isManual = false }: ChessBoardProps) => {
  const [boardCells, setBoardCells] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const cells: JSX.Element[] = [];
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isBlack = (row + col) % 2 === 1;
        const hasQueen = queens[row] === col;
        const isCurrentRow = row === currentRow;
        const isClickable = isManual && (queens[row] === -1 || hasQueen);
        
        // Check if queen placement is valid
        let isConflict = false;
        if (hasQueen) {
          for (let i = 0; i < row; i++) {
            if (queens[i] === col || // Same column
                queens[i] === col + (row - i) || // Diagonal down-right
                queens[i] === col - (row - i)) { // Diagonal down-left
              isConflict = true;
              break;
            }
          }
        }
        
        const cellClassName = [
          'chess-cell',
          isBlack ? 'dark' : 'light',
          isCurrentRow && !hasQueen ? 'highlight' : '',
          isClickable ? 'cursor-pointer hover:opacity-80' : ''
        ].filter(Boolean).join(' ');
        
        cells.push(
          <div 
            key={`${row}-${col}`}
            className={cellClassName}
            onClick={() => isClickable && onCellClick && onCellClick(row, col)}
          >
            {hasQueen && (
              <motion.div 
                className={`queen-piece ${isConflict ? 'invalid' : 'valid'}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L8 10L3 7L5 14H19L21 7L16 10L12 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 17V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
            
            {isCurrentRow && !hasQueen && (
              <motion.div 
                className="highlight-indicator"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </div>
        );
      }
    }
    
    setBoardCells(cells);
  }, [size, queens, currentRow, isManual, onCellClick]);

  return (
    <motion.div 
      className="chess-board" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        "--board-size": size,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        border: "2px solid #202538",
        borderRadius: "8px",
        overflow: "hidden"
      } as React.CSSProperties}
    >
      {/* Current Row Indicator */}
      {currentRow >= 0 && currentRow < size && (
        <motion.div 
          className="current-row-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            position: "absolute", 
            top: `calc(${currentRow} * 100% / ${size})`, 
            left: 0, 
            width: "100%", 
            height: `calc(100% / ${size})`,
            background: "rgba(59, 130, 246, 0.2)", 
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      )}
      
      {boardCells}
    </motion.div>
  );
};

export default ChessBoard;
