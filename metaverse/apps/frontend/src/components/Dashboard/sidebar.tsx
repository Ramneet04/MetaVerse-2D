import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, Settings, Play, Grid } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State for toggling sidebar size
  const location = useLocation();

  const menuItems = [
    { icon: <User />, label: 'Profile', to: '/dashboard/my-profile' },
    { icon: <Grid />, label: 'My Spaces', to: '/my-spaces' },
    { icon: <Play />, label: 'Play', to: '/play' },
    { icon: <Settings />, label: 'Settings', to: '/dashboard/settings' }
  ];

  // Determine if the current item is the selected one
  const isSelected = (path: string) => location.pathname === path;

  return (
    <div className={`h-screen ${isSidebarExpanded ? 'w-64' : 'w-20'} bg-purple-900 text-white font-bold
      transition-all duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0`}>
      
      <div className="pt-2 flex justify-between items-center">
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="p-2 text-white border rounded-md hover:bg-purple-700"
        >
          {isSidebarExpanded ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center p-3 hover:bg-purple-700 transition-colors relative ${
              isSelected(item.to) ? 'bg-purple-800 border-l-4 border-purple-500' : ''
            }`}
          >
            {item.icon}
            {isSidebarExpanded && (
              <span className={`ml-3 ${isSelected(item.to) ? 'font-semibold text-purple-300' : ''}`}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-purple-800/70 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
