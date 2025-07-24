import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, X, Sun, Moon } from 'phosphor-react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.from('.mobile-nav-item', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Software', href: '/projects' },
    { name: 'AI Tools', href: '/projects?category=ai-tools' },
    { name: 'Games', href: '/projects?category=games' }
  ];

  const handleNavigation = (href: string) => {
    if (href === '/') {
      navigate('/');
    } else if (href.includes('?')) {
      navigate(href);
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-background/80' : ''
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="text-xl md:text-2xl font-bold"
            >
              <span className="gradient-text">Ceylon</span><span className="text-primary">Software</span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-300"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                onClick={() => navigate('/projects')}
                className="glass-button text-sm"
              >
                Browse Software
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="mobile-nav-item text-2xl font-medium text-foreground hover:text-primary transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mobile-nav-item flex items-center gap-3 text-xl font-medium text-foreground hover:text-primary transition-colors duration-300"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button 
                onClick={() => navigate('/projects')}
                className="mobile-nav-item glass-button"
              >
                Browse Software
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;