import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0);
    }
    if (document.body) {
      document.body.scrollTo(0, 0);
    }

    // Also scroll on the next animation frame to handle any concurrent rendering/mounting delay
    const handle = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTo(0, 0);
      }
      if (document.body) {
        document.body.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  return null;
}
