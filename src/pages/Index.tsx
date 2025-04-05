
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Crown, Code, Search } from "lucide-react";

const Index = () => {
  const [showMore, setShowMore] = useState(false);
  
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
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/n-queens" className="btn-primary flex items-center gap-2">
              Explore N-Queens <ChevronRight size={20} />
            </Link>
            <Link to="/graph-coloring" className="btn-secondary flex items-center gap-2">
              Try Graph Coloring <ChevronRight size={20} />
            </Link>
          </div>
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
            <Link to="/n-queens" className="text-bright-coral hover:text-bright-coral/80 flex items-center gap-1 mt-auto">
              Learn More <ChevronRight size={16} />
            </Link>
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
            <Link to="/graph-coloring" className="text-bright-blue hover:text-bright-blue/80 flex items-center gap-1 mt-auto">
              Learn More <ChevronRight size={16} />
            </Link>
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
            
            <div className="flex justify-center">
              <div className="flex gap-4">
                <Link to="/n-queens" className="btn-primary">
                  Try N-Queens
                </Link>
                <Link to="/graph-coloring" className="btn-secondary">
                  Try Graph Coloring
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl glass-panel">
          <h2 className="text-3xl font-bold mb-6">Ready to Master Backtracking?</h2>
          <p className="text-light-gray mb-8 max-w-xl mx-auto">
            Dive into our interactive visualizations and understand these powerful algorithms through hands-on learning.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/n-queens" className="btn-primary">
              Start with N-Queens
            </Link>
            <Link to="/graph-coloring" className="btn-secondary">
              Explore Graph Coloring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
