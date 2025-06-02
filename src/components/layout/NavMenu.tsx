
import { Link, useLocation } from "react-router-dom";

const NavMenu = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors hover:text-green-400 ${
          isActive("/") ? "text-green-400" : "text-gray-300"
        }`}
      >
        Home
      </Link>
      
      <div className="relative group">
        <span className={`text-sm font-medium transition-colors hover:text-green-400 cursor-pointer ${
          isActive("/listings") ? "text-green-400" : "text-gray-300"
        }`}>
          Listings
        </span>
        <div className="absolute top-full left-0 mt-2 w-48 bg-dark-200 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <Link to="/listings/concerts" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Concerts
          </Link>
          <Link to="/listings/festivals" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Festivals
          </Link>
          <Link to="/listings/just-announced" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Just Announced
          </Link>
          <Link to="/listings/presales" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Pre Sales
          </Link>
          <Link to="/listings/map" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Map
          </Link>
        </div>
      </div>
      
      <div className="relative group">
        <span className={`text-sm font-medium transition-colors hover:text-green-400 cursor-pointer ${
          isActive("/reviews") ? "text-green-400" : "text-gray-300"
        }`}>
          Reviews
        </span>
        <div className="absolute top-full left-0 mt-2 w-48 bg-dark-200 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <Link to="/reviews/concerts" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Concerts
          </Link>
          <Link to="/reviews/festivals" className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-dark-300">
            Festivals
          </Link>
        </div>
      </div>
      
      <Link 
        to="/news" 
        className={`text-sm font-medium transition-colors hover:text-green-400 ${
          isActive("/news") ? "text-green-400" : "text-gray-300"
        }`}
      >
        News
      </Link>
      
      <Link 
        to="/about" 
        className={`text-sm font-medium transition-colors hover:text-green-400 ${
          isActive("/about") ? "text-green-400" : "text-gray-300"
        }`}
      >
        About
      </Link>
    </nav>
  );
};

export default NavMenu;
