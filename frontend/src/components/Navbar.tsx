import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User, PlusCircle, LayoutList } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Car size={26} className="navbar-brand-icon" />
          AuctionCar
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Browse</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-listings" className={isActive('/my-listings')}>
                <LayoutList size={16} />
                My Listings
              </Link>
              <Link to="/add-car" className={isActive('/add-car')}>
                <PlusCircle size={16} />
                List a Car
              </Link>
              <div className="nav-user">
                <User size={15} />
                <span>{user}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
