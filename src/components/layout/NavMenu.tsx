
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
    <NavigationMenu className="flex-1">
      <NavigationMenuList className="space-x-8">
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/') ? 'text-gray-300' : ''
            }`}
          >
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={`bg-transparent text-white hover:text-gray-300 hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent ${
              isActiveSection(['/listings']) ? 'text-gray-300' : ''
            }`}
            onClick={() => handleMenuToggle('listings')}
          >
            <span className="pointer-events-none">Listings</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-dark-400 border-dark-300 p-4 min-w-[250px]">
            <div className="grid gap-3">
              <Link 
                to="/listings/concerts" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors"
              >
                Concerts
              </Link>
              
              <div className="relative group">
                <div className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors cursor-pointer">
                  Festivals
                </div>
                <div className="absolute left-full top-0 ml-2 hidden group-hover:block bg-dark-400 border border-dark-300 rounded-md p-2 min-w-[180px] z-50">
                  <Link 
                    to="/listings/festivals/ireland" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    Ireland
                  </Link>
                  <Link 
                    to="/listings/festivals/uk" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    United Kingdom
                  </Link>
                  <Link 
                    to="/listings/festivals/france" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    France
                  </Link>
                  <Link 
                    to="/listings/festivals/germany" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    Germany
                  </Link>
                  <Link 
                    to="/listings/festivals/netherlands" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    Netherlands
                  </Link>
                  <Link 
                    to="/listings/festivals/spain" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors whitespace-nowrap"
                  >
                    Spain
                  </Link>
                </div>
              </div>
              
              <Link 
                to="/listings/just-announced" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors"
              >
                Just Announced
              </Link>
              <Link 
                to="/listings/map" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors"
              >
                Map
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={`bg-transparent text-white hover:text-gray-300 hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent ${
              isActiveSection(['/reviews']) ? 'text-gray-300' : ''
            }`}
            onClick={() => handleMenuToggle('reviews')}
          >
            <span className="pointer-events-none">Reviews</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-dark-400 border-dark-300 p-4 min-w-[200px]">
            <div className="grid gap-3">
              <Link 
                to="/reviews/concerts" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors"
              >
                Concert Reviews
              </Link>
              <Link 
                to="/reviews/festivals" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-300 rounded transition-colors"
              >
                Festival Reviews
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link 
            to="/news" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/news') ? 'text-gray-300' : ''
            }`}
          >
            News
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link 
            to="/about" 
            className={`text-white hover:text-gray-300 transition-colors ${
              isActivePath('/about') ? 'text-gray-300' : ''
            }`}
          >
            About
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
