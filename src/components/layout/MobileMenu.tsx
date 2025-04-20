
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mobile navigation items configuration
const mobileNavItems = [
  { label: "Home", path: "/" },
  {
    label: "Listings",
    path: "/listings",
    subItems: [
      { label: "Concerts", path: "/listings/concerts" },
      { 
        label: "Festivals", 
        path: "/listings/festivals",
        subItems: [
          { label: "Ireland", path: "/listings/festivals/ireland" },
          { label: "UK", path: "/listings/festivals/uk" },
          { label: "France", path: "/listings/festivals/france" },
          { label: "Spain", path: "/listings/festivals/spain" },
          { label: "Germany", path: "/listings/festivals/germany" },
          { label: "Netherlands", path: "/listings/festivals/netherlands" },
        ]
      },
      { label: "Just Announced", path: "/listings/just-announced" },
      { label: "Map", path: "/listings/map" },
    ],
  },
  {
    label: "Reviews",
    path: "/reviews",
    subItems: [
      { label: "Concerts", path: "/reviews/concerts" },
      { label: "Festivals", path: "/reviews/festivals" },
    ],
  },
  { label: "News", path: "/news" },
  { label: "About", path: "/about" },
  { label: "Admin", path: "/admin" }, // Ensuring Admin link is present
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [expandedSubItems, setExpandedSubItems] = React.useState<string[]>([]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) 
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const toggleSubExpand = (label: string) => {
    setExpandedSubItems((prev) =>
      prev.includes(label) 
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // When the route changes, close the mobile menu
  React.useEffect(() => {
    onClose();
  }, [location, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-dark-900 bg-opacity-95 z-50 overflow-y-auto"
        >
          <div className="flex flex-col p-6 space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {mobileNavItems.map((item) => (
                <div key={item.label}>
                  {item.subItems ? (
                    <div>
                      <button 
                        className={cn(
                          "flex justify-between items-center w-full px-4 py-2 text-left rounded-md",
                          isActive(item.path) 
                            ? "bg-dark-700 text-white" 
                            : "text-gray-300 hover:bg-dark-700 hover:text-white"
                        )}
                        onClick={() => toggleExpand(item.label)}
                      >
                        {item.label}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className={cn(
                            "transition-transform", 
                            expandedItems.includes(item.label) ? "rotate-180" : ""
                          )}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.includes(item.label) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 ml-2 border-l border-dark-700 mt-1 space-y-1">
                              {item.subItems.map((subItem) => (
                                <div key={subItem.path}>
                                  {subItem.subItems ? (
                                    <div>
                                      <button
                                        className={cn(
                                          "flex justify-between items-center w-full px-4 py-2 text-left text-sm rounded-md",
                                          location.pathname.startsWith(subItem.path)
                                            ? "bg-dark-700 text-white"
                                            : "text-gray-400 hover:bg-dark-700 hover:text-white"
                                        )}
                                        onClick={() => toggleSubExpand(subItem.label)}
                                      >
                                        {subItem.label}
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          width="16" 
                                          height="16" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                          className={cn(
                                            "transition-transform", 
                                            expandedSubItems.includes(subItem.label) ? "rotate-180" : ""
                                          )}
                                        >
                                          <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                      </button>
                                      
                                      <AnimatePresence>
                                        {expandedSubItems.includes(subItem.label) && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="pl-4 ml-2 border-l border-dark-700 mt-1 space-y-1">
                                              {subItem.subItems.map((nestedItem) => (
                                                <Link
                                                  key={nestedItem.path}
                                                  to={nestedItem.path}
                                                  className={cn(
                                                    "block px-4 py-2 text-sm rounded-md",
                                                    location.pathname === nestedItem.path
                                                      ? "bg-dark-700 text-white"
                                                      : "text-gray-400 hover:bg-dark-700 hover:text-white"
                                                  )}
                                                >
                                                  {nestedItem.label}
                                                </Link>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ) : (
                                    <Link
                                      to={subItem.path}
                                      className={cn(
                                        "block px-4 py-2 text-sm rounded-md",
                                        location.pathname === subItem.path
                                          ? "bg-dark-700 text-white"
                                          : "text-gray-400 hover:bg-dark-700 hover:text-white"
                                      )}
                                    >
                                      {subItem.label}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "block px-4 py-2 rounded-md",
                        isActive(item.path)
                          ? "bg-dark-700 text-white"
                          : "text-gray-300 hover:bg-dark-700 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
