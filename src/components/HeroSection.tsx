import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Sparkle } from 'phosphor-react';
import SplineScene from './SplineScene';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Hero entrance animations
    tl.fromTo(headlineRef.current, 
      { 
        opacity: 0, 
        y: 50, 
        filter: 'blur(10px)' 
      },
      { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)', 
        duration: 1.2, 
        ease: 'power3.out' 
      }
    )
    .fromTo(subtitleRef.current,
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      },
      '-=0.6'
    )
    .fromTo(ctaRef.current,
      { 
        opacity: 0, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: 'back.out(1.7)' 
      },
      '-=0.4'
    );

    // Floating orbs animation
    gsap.to('.hero-orb', {
      y: -20,
      rotation: 360,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        amount: 2,
        from: 'random'
      }
    });

    // CTA button hover effect setup
    const ctaButton = ctaRef.current;
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }

  }, []);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background */}
      <SplineScene />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb absolute top-1/4 left-1/6 w-8 h-8 bg-primary rounded-full neon-glow opacity-60"></div>
        <div className="hero-orb absolute top-1/3 right-1/6 w-12 h-12 bg-secondary rounded-full neon-glow-cyan opacity-40"></div>
        <div className="hero-orb absolute bottom-1/3 left-1/4 w-6 h-6 bg-accent rounded-full neon-glow-accent opacity-50"></div>
        <div className="hero-orb absolute bottom-1/4 right-1/4 w-10 h-10 bg-neon-pink rounded-full opacity-30"></div>
        <div className="hero-orb absolute top-1/2 left-1/2 w-4 h-4 bg-neon-cyan rounded-full opacity-70"></div>
      </div>

      {/* Hero Content */}
      <div ref={heroRef} className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 
          ref={headlineRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="block">
            <span className="gradient-text">Ceylon</span><span className="text-primary">Software</span>
          </span>
          <span className="block text-2xl md:text-4xl lg:text-5xl mt-2">
            <span className="text-muted-foreground">Premium</span> Software<br />
            <span className="gradient-text">Marketplace</span>
          </span>
        </h1>

        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto font-light leading-relaxed"
        >
          Discover cutting-edge AI tools, games, tracking software, and web applications. 
          Mobile-optimized solutions with flexible subscription plans from 1 month to 1 year.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button 
            ref={ctaRef}
            onClick={() => navigate('/projects')}
            className="group glass-button text-lg font-semibold relative overflow-hidden"
          >
            <span className="flex items-center gap-3">
              Browse Software
              <ArrowRight 
                size={24} 
                className="transition-transform duration-300 group-hover:translate-x-1" 
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </button>
          
          <button 
            onClick={() => navigate('/projects?category=ai-tools')}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 group"
          >
            <span className="flex items-center gap-3">
              Try AI Tools
              <Sparkle 
                size={20} 
                className="group-hover:rotate-12 transition-transform duration-300" 
              />
            </span>
          </button>
        </div>
        
        {/* Quick Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {[
            { name: 'AI Tools', category: 'ai-tools', icon: '🤖' },
            { name: 'Games', category: 'games', icon: '🎮' },
            { name: 'Tracking', category: 'tracking-software', icon: '📊' },
            { name: 'Web Apps', category: 'web-applications', icon: '🌐' },
            { name: 'Mobile', category: 'mobile-apps', icon: '📱' }
          ].map((cat) => (
            <button
              key={cat.category}
              onClick={() => navigate(`/projects?category=${cat.category}`)}
              className="glass-button text-sm group hover:scale-105 transition-all duration-300 p-3"
            >
              <span className="flex flex-col items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs md:text-sm">{cat.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroSection;