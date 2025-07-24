import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate the logo/text entrance
    tl.from('.loading-logo', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    });

    // Progress bar animation
    const progressTween = gsap.to({}, {
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        setProgress(progress);
        
        gsap.set('.progress-fill', {
          width: `${progress}%`
        });
      },
      onComplete: () => {
        // Exit animation
        gsap.to('.preloader', {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: onComplete
        });
      }
    });

    // Floating orbs animation
    gsap.to('.floating-orb', {
      y: -20,
      rotation: 360,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    });

  }, [onComplete]);

  return (
    <div className="preloader loading-screen">
      {/* Background with floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-orb absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full neon-glow opacity-60"></div>
        <div className="floating-orb absolute top-1/3 right-1/4 w-6 h-6 bg-secondary rounded-full neon-glow-cyan opacity-40"></div>
        <div className="floating-orb absolute bottom-1/3 left-1/3 w-3 h-3 bg-accent rounded-full neon-glow-accent opacity-50"></div>
        <div className="floating-orb absolute bottom-1/4 right-1/3 w-5 h-5 bg-neon-pink rounded-full opacity-30"></div>
      </div>

      {/* Main loading content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Brand */}
        <div className="loading-logo mb-12">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4">
           Ceylone
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-center font-light">
            Software Hub
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Loading Experience</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="progress-fill h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out"
              style={{ 
                boxShadow: '0 0 20px hsl(var(--primary))',
                width: '0%' 
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Initializing futuristic experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;