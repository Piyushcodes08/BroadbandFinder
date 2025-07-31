import React from "react";
import logo from "../assets/logo.png"; // Adjust the path as necessary
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="w-full absolute top-0 z-50  backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4  flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-20" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
