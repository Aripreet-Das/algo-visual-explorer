
export interface NQueensStep {
  queens: number[];
  currentRow: number;
  action: 'place' | 'remove' | 'backtrack' | 'complete';
  message: string;
}

export const solveNQueens = (boardSize: number): NQueensStep[] => {
  const queens: number[] = Array(boardSize).fill(-1);
  const steps: NQueensStep[] = [];
  
  const isSafe = (row: number, col: number): boolean => {
    for (let i = 0; i < row; i++) {
      // Check if queens can attack each other
      if (queens[i] === col || // same column
          queens[i] === col - (row - i) || // diagonal up-left
          queens[i] === col + (row - i)) { // diagonal up-right
        return false;
      }
    }
    return true;
  };
  
  const solve = (row: number): boolean => {
    if (row >= boardSize) {
      steps.push({
        queens: [...queens],
        currentRow: row,
        action: 'complete',
        message: 'Solution found! All queens have been placed successfully.'
      });
      return true;
    }
    
    for (let col = 0; col < boardSize; col++) {
      // Try placing queen in each column of the current row
      if (isSafe(row, col)) {
        // Place queen
        queens[row] = col;
        steps.push({
          queens: [...queens],
          currentRow: row,
          action: 'place',
          message: `Placing queen at row ${row+1}, column ${col+1}`
        });
        
        // Recursively try to place the rest of the queens
        if (solve(row + 1)) {
          return true;
        }
        
        // If placing queen at (row, col) didn't lead to a solution, backtrack
        queens[row] = -1;
        steps.push({
          queens: [...queens],
          currentRow: row,
          action: 'remove',
          message: `Removing queen from row ${row+1}, column ${col+1}`
        });
      }
    }
    
    // Backtrack to the previous row
    steps.push({
      queens: [...queens],
      currentRow: row - 1,
      action: 'backtrack',
      message: `No valid placement found in row ${row+1}, backtracking to row ${row}`
    });
    
    return false;
  };
  
  // Initialize the board with empty queens array
  steps.push({
    queens: [...queens],
    currentRow: 0,
    action: 'place',
    message: 'Starting the N-Queens algorithm'
  });
  
  solve(0);
  
  return steps;
};

export const countNQueensSolutions = (n: number): number => {
  let count = 0;
  const queens: number[] = Array(n).fill(-1);
  
  const isSafe = (row: number, col: number): boolean => {
    for (let i = 0; i < row; i++) {
      if (queens[i] === col || 
          queens[i] === col - (row - i) || 
          queens[i] === col + (row - i)) {
        return false;
      }
    }
    return true;
  };
  
  const backtrack = (row: number): void => {
    if (row === n) {
      count++;
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        queens[row] = col;
        backtrack(row + 1);
        queens[row] = -1;
      }
    }
  };
  
  backtrack(0);
  return count;
};
