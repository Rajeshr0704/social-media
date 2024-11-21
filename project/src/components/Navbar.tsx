import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, MessageCircle, User, LogOut } from 'lucide-react';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            SocialApp
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link
              to="/chat"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User className="h-6 w-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;