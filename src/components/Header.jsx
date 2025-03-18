import React, { useState } from "react";
import { Menu, Sun, Moon, User, Settings, LogOut } from "lucide-react";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-primary text-white shadow-md bg-black">
      {/* Left: Logo & Title */}
      <div className="flex items-center space-x-3">
        <img src="/assets/magnify.png" alt="Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-bold transition-transform duration-300 hover:scale-105">
          Whole Slide Image Viewer
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-opacity-20">
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-opacity-20 flex items-center space-x-2"
          >
            <User size={20} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40  dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-lg overflow-hidden z-10">
              <button className="w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center">
                <Settings size={18} className="mr-2" /> Settings
              </button>
              <button className="w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center">
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;
