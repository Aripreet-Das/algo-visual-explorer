
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Crown, Code, Search } from "lucide-react";

const Index = () => {
  const [showMore, setShowMore] = useState(false);
  
  const nQueensDetailedInfo = `
    <h3 class="text-xl font-bold mb-4">N-Queens Problem</h3>
    <p>The N-Queens problem is a classic combinatorial puzzle that asks how to place N chess queens on an N×N chessboard so that no two queens threaten each other. In chess, a queen can attack any piece that lies on the same row, column, or diagonal.</p>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Problem Details</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>Goal: Place N queens on an N×N chessboard so that no queen can attack another queen.</li>
      <li>Constraints: No two queens can share the same row, column, or diagonal.</li>
      <li>Historical Significance: Originally proposed for the standard 8×8 chess board as the Eight Queens Puzzle by chess composer Max Bezzel in 1848.</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Mathematical Properties</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>For N=1, there is 1 solution.</li>
      <li>For N=2 and N=3, there are no solutions.</li>
      <li>For N=4, there are 2 distinct solutions.</li>
      <li>For N=8 (standard chessboard), there are 92 distinct solutions.</li>
      <li>The number of solutions increases rapidly with N.</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Computational Complexity</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>The problem is NP-hard in its generalized form.</li>
      <li>Backtracking is an efficient algorithm to solve it compared to brute force approaches.</li>
      <li>The time complexity using backtracking is still exponential: O(N!), but much better than checking all possible board configurations.</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Solving Process with Backtracking</h4>
    <ol class="list-decimal pl-5 space-y-2">
      <li>Start placing queens one row at a time.</li>
      <li>When placing a queen in a row, check if it conflicts with any previously placed queens.</li>
      <li>If a conflict is found, try the next position in the same row.</li>
      <li>If no conflict-free position exists in a row, backtrack to the previous row and try a different position for the queen there.</li>
      <li>Continue until all N queens are placed (solution found) or all possibilities are exhausted.</li>
    </ol>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Real-world Applications</h4>
    <p>The N-Queens problem serves as an excellent teaching example for:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Constraint satisfaction problems</li>
      <li>Backtracking algorithms</li>
      <li>Optimization techniques</li>
    </ul>
    
    <p class="mt-4">Similar placement constraint problems appear in:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Circuit board design</li>
      <li>Scheduling problems</li>
      <li>Resource allocation</li>
    </ul>
  `;
  
  const graphColoringDetailedInfo = `
    <h3 class="text-xl font-bold mb-4">Graph Coloring Problem</h3>
    <p>The Graph Coloring Problem involves assigning colors to elements of a graph subject to certain constraints. The most common variant is vertex coloring, where adjacent vertices must have different colors.</p>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Problem Details</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>Goal: Assign colors to each vertex of a graph so that no two adjacent vertices share the same color.</li>
      <li>Optimization Goal: Minimize the number of colors used.</li>
      <li>Chromatic Number: The minimum number of colors needed to color a graph G is called its chromatic number, χ(G).</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Graph Types and Their Properties</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>Complete Graph (Kn): Requires exactly n colors (all vertices are adjacent).</li>
      <li>Bipartite Graph: Requires exactly 2 colors (vertices can be divided into two independent sets).</li>
      <li>Planar Graphs: Require at most 4 colors (Four Color Theorem).</li>
      <li>Cycle Graphs:
        <ul class="list-disc pl-5 mt-1">
          <li>Even-length cycles need 2 colors.</li>
          <li>Odd-length cycles need 3 colors.</li>
        </ul>
      </li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Computational Complexity</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>Determining if a graph can be colored with k colors is NP-complete for k ≥ 3.</li>
      <li>Finding the chromatic number of a graph is NP-hard.</li>
      <li>Even approximating the chromatic number within certain factors is NP-hard.</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Solving Process with Backtracking</h4>
    <ol class="list-decimal pl-5 space-y-2">
      <li>Start by assigning the first color to the first vertex.</li>
      <li>Move to the next vertex and assign the first available color that doesn't conflict with its neighbors.</li>
      <li>If no color is available, backtrack to the previous vertex and try a different color.</li>
      <li>Continue until all vertices are colored (solution found) or all possibilities are exhausted.</li>
      <li>To find the minimum number of colors, solve repeatedly with a decreasing number of allowed colors.</li>
    </ol>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Heuristic Approaches</h4>
    <p>Several heuristics exist for approximate solutions:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Greedy Coloring: Process vertices in a specific order, assigning the lowest possible color index at each step.</li>
      <li>DSatur (Degree of Saturation): Prioritize vertices with more differently-colored neighbors.</li>
      <li>Welsh-Powell Algorithm: Sort vertices by degree and color them in that order.</li>
    </ul>
    
    <h4 class="text-lg font-semibold mt-6 mb-2">Real-world Applications</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li>Scheduling Problems: Assigning time slots without conflicts (e.g., exam scheduling).</li>
      <li>Register Allocation: Optimizing variable storage in computer programs.</li>
      <li>Frequency Assignment: Allocating frequencies to radio transmitters to avoid interference.</li>
      <li>Map Coloring: Ensuring adjacent regions have different colors.</li>
      <li>Pattern Recognition: Separating different regions in image processing.</li>
      <li>Sudoku Puzzles: Can be formulated as graph coloring problems.</li>
    </ul>
  `;
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn <span className="text-bright-coral">Backtracking</span> Algorithms Through Interactive Visualization
          </h1>
          <p className="text-light-gray text-lg max-w-xl">
            Explore and understand complex backtracking algorithms through step-by-step interactive visualizations. Perfect for students, educators, and algorithm enthusiasts.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md aspect-square relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-bright-coral to-bright-blue opacity-20 rounded-lg"></div>
            <div className="glass-panel h-full flex items-center justify-center">
              <div className="chess-board" style={{"--board-size": 8} as React.CSSProperties}>
                {Array(8 * 8).fill(0).map((_, idx) => {
                  const row = Math.floor(idx / 8);
                  const col = idx % 8;
                  const isBlack = (row + col) % 2 === 1;
                  const hasQueen = row === col;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`chess-cell ${isBlack ? 'dark' : 'light'} ${hasQueen ? 'queen' : ''}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Interactive Learning Experience</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* N-Queens Feature */}
          <div className="card flex flex-col items-center text-center p-8 hover:shadow-xl transition-all">
            <div className="bg-bright-coral/10 p-4 rounded-full mb-6">
              <Crown className="text-bright-coral w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">N-Queens Problem</h3>
            <p className="text-light-gray mb-6">
              Place N queens on an N×N chessboard so that no two queens threaten each other.
            </p>
            <button 
              onClick={() => document.getElementById('n-queens-details')?.scrollIntoView({ behavior: 'smooth' })} 
              className="text-bright-coral hover:text-bright-coral/80 flex items-center gap-1 mt-auto"
            >
              Learn More <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Graph Coloring Feature */}
          <div className="card flex flex-col items-center text-center p-8 hover:shadow-xl transition-all">
            <div className="bg-bright-blue/10 p-4 rounded-full mb-6">
              <Search className="text-bright-blue w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Graph Coloring</h3>
            <p className="text-light-gray mb-6">
              Assign colors to graph vertices such that no adjacent vertices share the same color.
            </p>
            <button 
              onClick={() => document.getElementById('graph-coloring-details')?.scrollIntoView({ behavior: 'smooth' })} 
              className="text-bright-blue hover:text-bright-blue/80 flex items-center gap-1 mt-auto"
            >
              Learn More <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Backtracking Overview */}
          <div className="card flex flex-col items-center text-center p-8 hover:shadow-xl transition-all">
            <div className="bg-bright-green/10 p-4 rounded-full mb-6">
              <Code className="text-bright-green w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Backtracking Fundamentals</h3>
            <p className="text-light-gray mb-6">
              Understand the core concepts of backtracking algorithms and their applications.
            </p>
            <button 
              onClick={() => setShowMore(!showMore)} 
              className="text-bright-green hover:text-bright-green/80 flex items-center gap-1 mt-auto"
            >
              Learn More <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
      
      {/* Backtracking Info Section (Conditionally Rendered) */}
      {showMore && (
        <section className="py-8 animate-fade-in">
          <div className="card p-8">
            <h3 className="text-2xl font-semibold mb-4">What is Backtracking?</h3>
            <p className="text-light-gray mb-6">
              Backtracking is an algorithmic technique that builds a solution incrementally, abandoning a path as soon as it determines that the path cannot lead to a valid solution, and then "backtracks" to explore alternative paths.
            </p>
            
            <div className="my-6 algorithm-code">
              <pre>{`function backtrack(candidate):
    if reject(candidate):
        return
    
    if accept(candidate):
        output(candidate)
        return
    
    for next_candidate in extensions(candidate):
        backtrack(next_candidate)`}</pre>
            </div>
            
            <h4 className="text-xl font-semibold mb-3">Key Applications</h4>
            <ul className="list-disc list-inside text-light-gray space-y-2 mb-6">
              <li>Combinatorial problems (N-Queens, Sudoku)</li>
              <li>Constraint satisfaction problems (Graph Coloring)</li>
              <li>Parsing expressions (Compiler design)</li>
              <li>Finding paths (Maze solving, Hamiltonian Path)</li>
              <li>Game playing (Chess, Checkers)</li>
            </ul>
          </div>
        </section>
      )}
      
      {/* N-Queens Detailed Section */}
      <section id="n-queens-details" className="py-16">
        <div className="card p-8">
          <div dangerouslySetInnerHTML={{ __html: nQueensDetailedInfo }} className="prose prose-invert max-w-none" />
          <div className="mt-8">
            <Link to="/n-queens" className="btn-primary inline-flex items-center gap-2">
              Interactive N-Queens Demo <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Graph Coloring Detailed Section */}
      <section id="graph-coloring-details" className="py-16">
        <div className="card p-8">
          <div dangerouslySetInnerHTML={{ __html: graphColoringDetailedInfo }} className="prose prose-invert max-w-none" />
          <div className="mt-8">
            <Link to="/graph-coloring" className="btn-primary inline-flex items-center gap-2">
              Interactive Graph Coloring Demo <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
