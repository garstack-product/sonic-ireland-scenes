
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-green-400"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark-200 border-t border-gray-700 z-50">
          <div className="px-4 py-2 space-y-2">
            <Link 
              to="/" 
              className="block py-2 text-sm text-gray-300 hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            <div className="py-2">
              <div className="text-sm font-medium text-gray-300 mb-2">Listings</div>
              <div className="pl-4 space-y-2">
                <Link 
                  to="/listings/concerts" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Concerts
                </Link>
                <Link 
                  to="/listings/festivals" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Festivals
                </Link>
                <Link 
                  to="/listings/just-announced" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Just Announced
                </Link>
                <Link 
                  to="/listings/presales" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Pre Sales
                </Link>
                <Link 
                  to="/listings/map" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Map
                </Link>
              </div>
            </div>
            
            <div className="py-2">
              <div className="text-sm font-medium text-gray-300 mb-2">Reviews</div>
              <div className="pl-4 space-y-2">
                <Link 
                  to="/reviews/concerts" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Concerts
                </Link>
                <Link 
                  to="/reviews/festivals" 
                  className="block py-1 text-sm text-gray-400 hover:text-green-400"
                  onClick={() => setIsOpen(false)}
                >
                  Festivals
                </Link>
              </div>
            </div>
            
            <Link 
              to="/news" 
              className="block py-2 text-sm text-gray-300 hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            
            <Link 
              to="/about" 
              className="block py-2 text-sm text-gray-300 hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
