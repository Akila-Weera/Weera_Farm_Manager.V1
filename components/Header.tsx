
import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <i className="fa-solid fa-seedling text-white"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">Weera Farm</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Management Pro</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
