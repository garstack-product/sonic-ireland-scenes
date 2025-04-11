
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NavMenu from "./NavMenu";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    onMenuToggle();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-500/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {isMobile && (
            <button 
              onClick={handleToggleMenu} 
              className="p-2 text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            Dirty Boots
          </Link>

          {!isMobile && <NavMenu />}
          
          {isMobile && <div />} {/* Empty div to maintain flexbox spacing */}
        </div>
      </div>
    </header>
  );
};

export default Header;
