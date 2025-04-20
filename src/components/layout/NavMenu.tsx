
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Navigation items configuration
const navItems = [
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

// Nav menu component 
const NavMenu = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = React.useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleSubMouseEnter = (label: string) => {
    setActiveSubDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  return (
    <nav className="hidden md:flex space-x-1 items-center">
      {navItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={item.path}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive(item.path)
                ? "text-white bg-dark-400"
                : "text-gray-300 hover:text-white hover:bg-dark-400"
            )}
          >
            {item.label}
            {item.subItems && (
              <span className="ml-1 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            )}
          </Link>

          {item.subItems && activeDropdown === item.label && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-dark-400 ring-1 ring-black ring-opacity-5 z-50"
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {item.subItems.map((subItem) => (
                  <div key={subItem.path} className="relative">
                    {subItem.subItems ? (
                      <div
                        className="relative"
                        onMouseEnter={() => handleSubMouseEnter(subItem.label)}
                      >
                        <Link
                          to={subItem.path}
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-300 hover:bg-dark-500 hover:text-white",
                            location.pathname === subItem.path
                              ? "bg-dark-500 text-white"
                              : ""
                          )}
                          role="menuitem"
                        >
                          {subItem.label}
                          <span className="float-right mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 6 6 6-6 6" />
                            </svg>
                          </span>
                        </Link>
                        
                        {activeSubDropdown === subItem.label && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-full top-0 w-48 rounded-md shadow-lg bg-dark-400 ring-1 ring-black ring-opacity-5"
                          >
                            <div className="py-1">
                              {subItem.subItems.map((nestedItem) => (
                                <Link
                                  key={nestedItem.path}
                                  to={nestedItem.path}
                                  className={cn(
                                    "block px-4 py-2 text-sm text-gray-300 hover:bg-dark-500 hover:text-white",
                                    location.pathname === nestedItem.path
                                      ? "bg-dark-500 text-white"
                                      : ""
                                  )}
                                >
                                  {nestedItem.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={subItem.path}
                        className={cn(
                          "block px-4 py-2 text-sm text-gray-300 hover:bg-dark-500 hover:text-white",
                          location.pathname === subItem.path
                            ? "bg-dark-500 text-white"
                            : ""
                        )}
                        role="menuitem"
                      >
                        {subItem.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
