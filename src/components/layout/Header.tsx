
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import NavMenu from "./NavMenu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    onMenuToggle();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-500/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors mr-8">
            Dirty Boots
          </Link>
          
          {isMobile ? (
            <div className="flex items-center ml-auto">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white mr-2">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-dark-400 border-dark-300">
                    <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-dark-300" />
                    <DropdownMenuItem onClick={() => navigate('/my-events')} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                      <Heart className="mr-2 h-4 w-4" />
                      Saved Events
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                        <User className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-dark-300" />
                    <DropdownMenuItem onClick={handleLogout} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <button 
                onClick={handleToggleMenu} 
                className="p-2 text-white"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center w-full">
              <NavMenu />
              {user && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-dark-400">
                        <User className="mr-2 h-4 w-4" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-dark-400 border-dark-300">
                      <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-dark-300" />
                      <DropdownMenuItem onClick={() => navigate('/my-events')} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                        <Heart className="mr-2 h-4 w-4" />
                        Saved Events
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                          <User className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-dark-300" />
                      <DropdownMenuItem onClick={handleLogout} className="text-gray-300 cursor-pointer hover:bg-dark-300">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
