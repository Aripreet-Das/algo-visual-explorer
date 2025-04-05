
import { Link, useLocation } from "react-router-dom";
import { Code, FilePresentation } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-midnight-blue/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Code size={24} className="text-bright-coral" />
          <span className="font-poppins font-bold text-xl">BacktrackViz</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`font-medium text-sm transition-all ${isActive('/') ? 'text-bright-coral' : 'text-light-gray hover:text-off-white'}`}
          >
            Home
          </Link>
          <Link 
            to="/n-queens" 
            className={`font-medium text-sm transition-all ${isActive('/n-queens') ? 'text-bright-coral' : 'text-light-gray hover:text-off-white'}`}
          >
            N-Queens
          </Link>
          <Link 
            to="/graph-coloring" 
            className={`font-medium text-sm transition-all ${isActive('/graph-coloring') ? 'text-bright-coral' : 'text-light-gray hover:text-off-white'}`}
          >
            Graph Coloring
          </Link>
          <a 
            href="https://www.canva.com/design/DAGi4kZRnhU/ja-rvrEqkszUAat4In0rcg/edit?utm_content=DAGi4kZRnhU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium text-sm text-light-gray hover:text-off-white transition-all flex items-center gap-1"
          >
            <FilePresentation size={16} />
            PPT
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
