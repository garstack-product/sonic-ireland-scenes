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
      { label: "Festivals", path: "/listings/festivals" },
      { label: "UK Festivals", path: "/listings/festivals/uk" },
      { label: "Spanish Festivals", path: "/listings/festivals/spain" },
      { label: "French Festivals", path: "/listings/festivals/france" },
      { label: "German Festivals", path: "/listings/festivals/germany" },
      { label: "Dutch Festivals", path: "/listings/festivals/netherlands" },
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
];

// Nav menu component 
const NavMenu = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
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
                  <Link
                    key={subItem.path}
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
