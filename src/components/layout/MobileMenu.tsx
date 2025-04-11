
import { Link } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [showListingsSubmenu, setShowListingsSubmenu] = useState(false);
  const [showReviewsSubmenu, setShowReviewsSubmenu] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-dark-500/95 md:hidden animate-fade-in">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        <nav className="px-6 py-8 flex flex-col space-y-6 text-lg">
          <MobileNavLink to="/" onClick={onClose}>Home</MobileNavLink>
          
          <div>
            <button 
              className="flex items-center justify-between w-full text-white py-2"
              onClick={() => setShowListingsSubmenu(!showListingsSubmenu)}
            >
              <span>Listings</span>
              {showListingsSubmenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showListingsSubmenu && (
              <div className="ml-4 mt-2 border-l-2 border-gray-700 pl-4 flex flex-col space-y-4 animate-fade-in">
                <MobileNavLink to="/listings/concerts" onClick={onClose}>Concerts</MobileNavLink>
                <MobileNavLink to="/listings/festivals" onClick={onClose}>Festivals</MobileNavLink>
                <MobileNavLink to="/listings/just-announced" onClick={onClose}>Just Announced</MobileNavLink>
                <MobileNavLink to="/listings/map" onClick={onClose}>Map</MobileNavLink>
              </div>
            )}
          </div>
          
          <div>
            <button 
              className="flex items-center justify-between w-full text-white py-2"
              onClick={() => setShowReviewsSubmenu(!showReviewsSubmenu)}
            >
              <span>Reviews</span>
              {showReviewsSubmenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showReviewsSubmenu && (
              <div className="ml-4 mt-2 border-l-2 border-gray-700 pl-4 flex flex-col space-y-4 animate-fade-in">
                <MobileNavLink to="/reviews/concerts" onClick={onClose}>Concerts</MobileNavLink>
                <MobileNavLink to="/reviews/festivals" onClick={onClose}>Festivals</MobileNavLink>
              </div>
            )}
          </div>
          
          <MobileNavLink to="/news" onClick={onClose}>News</MobileNavLink>
          <MobileNavLink to="/about" onClick={onClose}>About</MobileNavLink>
          <MobileNavLink to="/login" onClick={onClose}>Login</MobileNavLink>
        </nav>
      </div>
    </div>
  );
};

const MobileNavLink = ({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="text-white hover:text-gray-300 transition-colors py-2" 
    onClick={onClick}
  >
    {children}
  </Link>
);

export default MobileMenu;
