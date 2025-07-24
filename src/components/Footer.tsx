import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Code } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Footer animation
    gsap.fromTo(footer,
      { 
        opacity: 0, 
        y: 60,
        filter: 'blur(10px)'
      },
      { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Floating particles animation
    gsap.to('.footer-particle', {
      y: -15,
      rotation: 360,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        amount: 2,
        from: 'random'
      }
    });

  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative py-16 px-6 mt-24 overflow-hidden border-t border-glass-border"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="footer-particle absolute top-1/4 left-1/6 w-4 h-4 bg-primary rounded-full neon-glow"></div>
        <div className="footer-particle absolute top-1/2 right-1/4 w-3 h-3 bg-secondary rounded-full neon-glow-cyan"></div>
        <div className="footer-particle absolute bottom-1/4 left-1/3 w-5 h-5 bg-accent rounded-full neon-glow-accent"></div>
        <div className="footer-particle absolute top-3/4 right-1/6 w-2 h-2 bg-neon-pink rounded-full"></div>
        <div className="footer-particle absolute bottom-1/3 right-1/2 w-4 h-4 bg-neon-cyan rounded-full"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold gradient-text mb-4">
                Milad
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Crafting the future with cutting-edge software solutions. 
                Experience innovation through immersive technology.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Navigation
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Ready to start your project?
              </p>
              <button 
                onClick={() => scrollToSection('#contact')}
                className="glass-button text-sm inline-block"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-glass-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>© 2024 Ceylon Software Hub.</span>
              <span className="flex items-center gap-1">
                Made with <Heart size={16} className="text-accent" weight="fill" /> and 
                <Code size={16} className="text-primary" />
              </span>
            </div>

            {/* Tech Stack */}
            <div className="text-sm text-muted-foreground">
              Built with React • GSAP • Tailwind CSS • Spline
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;