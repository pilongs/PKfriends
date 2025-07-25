import React from 'react';
import { Link } from 'react-router-dom';
import placeholder from '../../../placeholder.svg';

const Header = () => {
  return (
    <header className="w-full h-16 flex items-center px-6 bg-white border-b shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <img src={placeholder} alt="TDM Friends Logo" className="h-8 w-8" />
        <span className="font-bold text-lg tracking-tight">TDM Friends</span>
      </Link>
    </header>
  );
};

export default Header; 