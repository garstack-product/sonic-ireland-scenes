
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const NavMenu = () => {
  const [showListingsSubmenu, setShowListingsSubmenu] = useState(false);
  const [showReviewsSubmenu, setShowReviewsSubmenu] = useState(false);

  const toggleListingsSubmenu = () => {
    setShowListingsSubmenu(!showListingsSubmenu);
    if (showReviewsSubmenu) setShowReviewsSubmenu(false);
  };

  const toggleReviewsSubmenu = () => {
    setShowReviewsSubmenu(!showReviewsSubmenu);
    if (showListingsSubmenu) setShowListingsSubmenu(false);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavLink to="/">Home</NavLink>
      
      <div className="relative group">
        <button 
          className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
          onClick={toggleListingsSubmenu}
          aria-expanded={showListingsSubmenu}
          aria-haspopup="true"
        >
          <span>Listings</span>
          {showListingsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showListingsSubmenu && (
          <div 
            className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-dark-300 ring-1 ring-black ring-opacity-5 py-1 z-10"
          >
            <NavLink to="/listings/concerts" className="block px-4 py-2">Concerts</NavLink>
            <NavLink to="/listings/festivals" className="block px-4 py-2">Festivals</NavLink>
            <NavLink to="/listings/just-announced" className="block px-4 py-2">Just Announced</NavLink>
            <NavLink to="/listings/map" className="block px-4 py-2">Map</NavLink>
          </div>
        )}
      </div>
      
      <div className="relative group">
        <button 
          className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
          onClick={toggleReviewsSubmenu}
          aria-expanded={showReviewsSubmenu}
          aria-haspopup="true"
        >
          <span>Reviews</span>
          {showReviewsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showReviewsSubmenu && (
          <div 
            className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-dark-300 ring-1 ring-black ring-opacity-5 py-1 z-10"
          >
            <NavLink to="/reviews/concerts" className="block px-4 py-2">Concerts</NavLink>
            <NavLink to="/reviews/festivals" className="block px-4 py-2">Festivals</NavLink>
          </div>
        )}
      </div>
      
      <NavLink to="/news">News</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
};

const NavLink = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => (
  <Link 
    to={to} 
    className={`text-white hover:text-gray-300 transition-colors ${className}`}
  >
    {children}
  </Link>
);

export default NavMenu;
