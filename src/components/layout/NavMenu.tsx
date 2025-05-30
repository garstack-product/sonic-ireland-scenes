
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const NavMenu = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const isActiveSection = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  const handleMenuToggle = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <nav className="flex-1">
      <ul className="flex space-x-8">
        <li>
          <Link 
            to="/" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/') ? 'text-gray-300' : ''
            }`}
          >
            Home
          </Link>
        </li>

        <li className="relative group">
          <button 
            className={`text-white hover:text-gray-300 transition-colors flex items-center ${
              isActiveSection(['/listings']) ? 'text-gray-300' : ''
            }`}
            onClick={() => handleMenuToggle('listings')}
          >
            Listings
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          <div className={`absolute left-0 top-full mt-2 bg-dark-400 border border-dark-300 rounded-md shadow-lg z-50 min-w-[250px] ${
            openMenu === 'listings' ? 'block' : 'hidden'
          } group-hover:block`}>
            <Link 
              to="/listings/concerts" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
            >
              Concerts
            </Link>
            
            <div className="relative group/festivals">
              <div className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors cursor-pointer">
                Festivals
              </div>
              <div className="absolute left-full top-0 ml-2 hidden group-hover/festivals:block bg-dark-400 border border-dark-300 rounded-md shadow-lg z-50 min-w-[180px]">
                <Link 
                  to="/listings/festivals/ireland" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  Ireland
                </Link>
                <Link 
                  to="/listings/festivals/uk" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  United Kingdom
                </Link>
                <Link 
                  to="/listings/festivals/france" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  France
                </Link>
                <Link 
                  to="/listings/festivals/germany" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  Germany
                </Link>
                <Link 
                  to="/listings/festivals/netherlands" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  Netherlands
                </Link>
                <Link 
                  to="/listings/festivals/spain" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors whitespace-nowrap"
                >
                  Spain
                </Link>
              </div>
            </div>
            
            <Link 
              to="/listings/just-announced" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
            >
              Just Announced
            </Link>
            <Link 
              to="/listings/map" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
            >
              Map
            </Link>
          </div>
        </li>

        <li className="relative group">
          <button 
            className={`text-white hover:text-gray-300 transition-colors flex items-center ${
              isActiveSection(['/reviews']) ? 'text-gray-300' : ''
            }`}
            onClick={() => handleMenuToggle('reviews')}
          >
            Reviews
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          <div className={`absolute left-0 top-full mt-2 bg-dark-400 border border-dark-300 rounded-md shadow-lg z-50 min-w-[200px] ${
            openMenu === 'reviews' ? 'block' : 'hidden'
          } group-hover:block`}>
            <Link 
              to="/reviews/concerts" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
            >
              Concert Reviews
            </Link>
            <Link 
              to="/reviews/festivals" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
            >
              Festival Reviews
            </Link>
          </div>
        </li>

        <li>
          <Link 
            to="/news" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/news') ? 'text-gray-300' : ''
            }`}
          >
            News
          </Link>
        </li>

        <li>
          <Link 
            to="/about" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/about') ? 'text-gray-300' : ''
            }`}
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
