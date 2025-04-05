
import { useState, useEffect } from 'react';

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
          hasQueen ? 'queen' : '',
          hasQueen && isConflict ? 'invalid' : '',
          hasQueen && !isConflict ? 'valid' : '',
          isCurrentRow && !hasQueen ? 'highlight' : '',
          isClickable ? 'cursor-pointer hover:opacity-80' : ''
        ].filter(Boolean).join(' ');
        
        cells.push(
          <div 
            key={`${row}-${col}`}
            className={cellClassName}
            onClick={() => isClickable && onCellClick && onCellClick(row, col)}
          />
        );
      }
    }
    
    setBoardCells(cells);
  }, [size, queens, currentRow, isManual, onCellClick]);

  return (
    <div 
      className="chess-board" 
      style={{ 
        "--board-size": size,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        border: "2px solid #000000" 
      } as React.CSSProperties}
    >
      {boardCells}
    </div>
  );
};

export default ChessBoard;
