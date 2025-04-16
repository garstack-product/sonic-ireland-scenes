import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NavMenu = () => {
  const [showListingsSubmenu, setShowListingsSubmenu] = useState(false);
  const [showReviewsSubmenu, setShowReviewsSubmenu] = useState(false);
  const [showUserSubmenu, setShowUserSubmenu] = useState(false);
  const { user, logout } = useAuth();

  const toggleListingsSubmenu = () => {
    setShowListingsSubmenu(!showListingsSubmenu);
    if (showReviewsSubmenu) setShowReviewsSubmenu(false);
    if (showUserSubmenu) setShowUserSubmenu(false);
  };

  const toggleReviewsSubmenu = () => {
    setShowReviewsSubmenu(!showReviewsSubmenu);
    if (showListingsSubmenu) setShowListingsSubmenu(false);
    if (showUserSubmenu) setShowUserSubmenu(false);
  };

  const toggleUserSubmenu = () => {
    setShowUserSubmenu(!showUserSubmenu);
    if (showListingsSubmenu) setShowListingsSubmenu(false);
    if (showReviewsSubmenu) setShowReviewsSubmenu(false);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8 ml-8">
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
            <div className="relative group">
              <button 
                className="flex items-center justify-between w-full px-4 py-2 text-white hover:bg-dark-400"
                onClick={e => e.preventDefault()}
              >
                <span>Festivals</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-full top-0 w-48 rounded-md shadow-lg bg-dark-300 ring-1 ring-black ring-opacity-5 py-1">
                <NavLink to="/listings/festivals" className="block px-4 py-2">Ireland</NavLink>
                <NavLink to="/listings/festivals/uk" className="block px-4 py-2">UK</NavLink>
              </div>
            </div>
            <NavLink to="/listings/just-announced" className="block px-4 py-2">Just Announced</NavLink>
            <NavLink to="/listings/map" className="block px-4 py-2">Map</NavLink>
            {user && (
              <NavLink to="/listings/my-events" className="block px-4 py-2">My Events</NavLink>
            )}
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
      
      {user ? (
        <div className="relative group">
          <button 
            className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
            onClick={toggleUserSubmenu}
            aria-expanded={showUserSubmenu}
            aria-haspopup="true"
          >
            <span>{user.name.split(' ')[0]}</span>
            {showUserSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showUserSubmenu && (
            <div 
              className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-dark-300 ring-1 ring-black ring-opacity-5 py-1 z-10"
            >
              <NavLink to="/listings/my-events" className="flex items-center px-4 py-2">
                <User size={16} className="mr-2" />
                <span>My Events</span>
              </NavLink>
              {user.isAdmin && (
                <NavLink to="/admin" className="block px-4 py-2">Admin Dashboard</NavLink>
              )}
              <button 
                onClick={logout}
                className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-dark-400 hover:text-gray-300 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
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
