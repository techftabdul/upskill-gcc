import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <BookOpen className="logo-icon" size={28} />
          <span className="logo-text">Upskill</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-links navbar-links--desktop">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#testimonials" className="nav-link">Testimonials</a>
          {currentUser && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/history" className="nav-link">History</Link>
            </>
          )}
          <Link to="/toolkit" className="nav-link">AI Tools</Link>
          <Link to="/bootcamps" className="nav-link">Bootcamps</Link>
        </nav>

        <div className="navbar-actions navbar-actions--desktop">
          {currentUser ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Button variant="outline" onClick={handleLogout} className="sign-in-btn">Log Out</Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="sign-in-btn">Sign In</Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>
                <Button variant="accent" className="join-btn">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobile}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <a href="/#features" className="mobile-menu__link" onClick={closeMobile}>Features</a>
            <a href="/#testimonials" className="mobile-menu__link" onClick={closeMobile}>Testimonials</a>
            {currentUser && (
              <>
                <Link to="/dashboard" className="mobile-menu__link" onClick={closeMobile}>Dashboard</Link>
                <Link to="/history" className="mobile-menu__link" onClick={closeMobile}>History</Link>
              </>
            )}
            <Link to="/toolkit" className="mobile-menu__link" onClick={closeMobile}>AI Tools</Link>
            <Link to="/bootcamps" className="mobile-menu__link" onClick={closeMobile}>Bootcamps</Link>

            <div className="mobile-menu__divider" />

            {currentUser ? (
              <>
                <Link to="/profile" className="mobile-menu__link" onClick={closeMobile}>Profile</Link>
                <button className="mobile-menu__link mobile-menu__link--logout" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu__link" onClick={closeMobile}>Sign In</Link>
                <Link to="/signup" onClick={closeMobile} style={{ textDecoration: 'none' }}>
                  <Button variant="accent" className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
