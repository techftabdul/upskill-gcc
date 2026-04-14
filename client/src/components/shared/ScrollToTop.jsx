import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A persistent global component to reset scroll position 
 * on route/pathname changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);

  return null; // This component doesn't render any UI
};

export default ScrollToTop;
