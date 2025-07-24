import { useEffect } from 'react';

const DarkModeEnforcer = () => {
  useEffect(() => {
    // Force dark mode on page load
    const html = document.documentElement;
    html.classList.add('dark');
    html.classList.remove('light');
    
    // Set color scheme
    html.style.colorScheme = 'dark';
    
    // Override any system preferences
    const observer = new MutationObserver(() => {
      if (!html.classList.contains('dark')) {
        html.classList.add('dark');
        html.classList.remove('light');
      }
    });
    
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return null;
};

export default DarkModeEnforcer;