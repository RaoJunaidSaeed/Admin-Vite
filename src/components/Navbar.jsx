import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, Home, FileText, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const handleLogout = () => {
    logout();
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/login');
  };

  // Auto Logout
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (user) handleLogout();
      }, 1000 * 60 * 60); // 1 hour
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const AdminLinks = () => (
    <>
      <Link to="/admin-dashboard" className="nav-link flex items-center gap-2 px-4 py-2">
        <Home className="w-4 h-4" /> Properties
      </Link>
      <Link to="/admin/users" className="nav-link flex items-center gap-2 px-4 py-2">
        <User className="w-4 h-4" /> Users
      </Link>
      <Link to="/admin/plans" className="nav-link flex items-center gap-2 px-4 py-2">
        <FileText className="w-4 h-4" /> Plans
      </Link>
      <Link to="/admin/payments" className="nav-link flex items-center gap-2 px-4 py-2">
        <CreditCard className="w-4 h-4" /> Payments
      </Link>
      <Link
        to="/profile"
        className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
      >
        <User className="w-4 h-4" />
        Profile
      </Link>
      <Link
        to="/settings"
        className="nav-link flex items-center gap-2 hover-lift px-3 py-2 rounded-xl"
      >
        <User className="w-4 h-4" />
        Settings
      </Link>
    </>
  );

  const UserInfo = () => (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
        {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
      </div>
      <span className="font-medium text-charcoal">{user.firstName || user.email}</span>
    </div>
  );

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-white/30 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full">
        <Link
          to="/"
          className="text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
        >
          RentoFix Admin
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/30"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {user?.role === 'admin' ? (
            <>
              <AdminLinks />
              <UserInfo />
              <button
                onClick={handleLogout}
                className="text-cherry font-semibold hover:bg-cherry/10 px-4 py-2 rounded-xl transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link px-4 py-2 rounded-xl">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-2xl hover:shadow-lg font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden mt-4 flex flex-col gap-4 bg-white/90 rounded-xl p-4 shadow-md transition-all duration-300"
        >
          {user?.role === 'admin' ? (
            <>
              <AdminLinks />
              <UserInfo />
              <button
                onClick={handleLogout}
                className="text-cherry font-semibold hover:bg-cherry/10 px-4 py-2 rounded-xl transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link px-4 py-2 rounded-xl">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-2xl hover:shadow-lg font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
