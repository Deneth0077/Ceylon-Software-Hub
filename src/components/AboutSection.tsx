import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code, 
  PaintBrush, 
  Rocket, 
  Lightning, 
  Cpu, 
  Globe 
} from 'phosphor-react';
import profileImage from '../assets/profile.jpg';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const skills = [
    { name: 'Frontend Development', icon: Code, color: 'text-primary' },
    { name: 'UI/UX Design', icon: PaintBrush, color: 'text-secondary' },
    { name: 'Performance Optimization', icon: Rocket, color: 'text-accent' },
    { name: 'Real-time Systems', icon: Lightning, color: 'text-neon-cyan' },
    { name: 'AI Integration', icon: Cpu, color: 'text-neon-purple' },
    { name: 'Global Solutions', icon: Globe, color: 'text-neon-pink' }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Main section animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse'
      }
    });

    // Image animation
    tl.fromTo(imageRef.current,
      { 
        opacity: 0, 
        x: -100, 
        rotation: -10 
      },
      { 
        opacity: 1, 
        x: 0, 
        rotation: 0, 
        duration: 1, 
        ease: 'power3.out' 
      }
    );

    // Content animation
    tl.fromTo(contentRef.current,
      { 
        opacity: 0, 
        x: 100 
      },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      },
      '-=0.6'
    );

    // Skills animation
    tl.fromTo('.skill-item',
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'back.out(1.7)' 
      },
      '-=0.4'
    );

    // Profile image hover effect
    const profileImage = imageRef.current;
    if (profileImage) {
      profileImage.addEventListener('mouseenter', () => {
        gsap.to(profileImage, {
          scale: 1.05,
          rotation: 5,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      profileImage.addEventListener('mouseleave', () => {
        gsap.to(profileImage, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    }

  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <div ref={imageRef} className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Glowing frame */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full p-1 animate-rotate-slow">
                <div className="w-full h-full bg-background rounded-full"></div>
              </div>
              
              {/* Profile image */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden glass-card">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating elements around image */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full neon-glow animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full neon-glow-cyan animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">About</span> Our Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We are passionate innovators at the forefront of technology, crafting 
                software solutions that push the boundaries of what's possible. Our mission 
                is to transform ideas into reality through cutting-edge development and 
                immersive digital experiences.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With expertise spanning artificial intelligence, quantum computing, 
                blockchain technology, and immersive reality, we deliver premium 
                software that drives the future forward.
              </p>
            </div>

            {/* Skills Grid */}
            <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name}
                  className="skill-item glass-card p-4 text-center group hover:scale-105 transition-all duration-300"
                >
                  <skill.icon 
                    size={32} 
                    className={`${skill.color} mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`} 
                  />
                  <p className="text-sm font-medium">{skill.name}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100+</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">5+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;