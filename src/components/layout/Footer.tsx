
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-500 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">SonicShots</h3>
            <p className="text-gray-400">Music photography and event coverage throughout Ireland.</p>
          </div>
          
          <div>
            <h4 className="text-white text-md font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/listings/concerts" className="text-gray-400 hover:text-white transition-colors">Concerts</Link></li>
              <li><Link to="/listings/festivals" className="text-gray-400 hover:text-white transition-colors">Festivals</Link></li>
              <li><Link to="/listings/map" className="text-gray-400 hover:text-white transition-colors">Map</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-md font-medium mb-4">Reviews</h4>
            <ul className="space-y-2">
              <li><Link to="/reviews/concerts" className="text-gray-400 hover:text-white transition-colors">Concert Reviews</Link></li>
              <li><Link to="/reviews/festivals" className="text-gray-400 hover:text-white transition-colors">Festival Reviews</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-md font-medium mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-4 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SonicShots. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
