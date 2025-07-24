import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'phosphor-react';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section title animation
    gsap.fromTo('.projects-title',
      { 
        opacity: 0, 
        y: 50,
        filter: 'blur(10px)'
      },
      { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Project cards animation
    gsap.fromTo('.project-card',
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Horizontal scroll for mobile
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer && window.innerWidth < 768) {
      gsap.to(projectsContainer, {
        x: () => -(projectsContainer.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: projectsContainer,
          pin: true,
          scrub: 1,
          end: () => `+=${projectsContainer.scrollWidth}`
        }
      });
    }

  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        weight={i < rating ? 'fill' : 'regular'}
        className={i < rating ? 'text-accent' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-8xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="projects-title text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Featured</span> Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our premium software solutions that push the boundaries of technology
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-container">
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card group cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <ArrowRight size={20} className="text-white" />
                  </div>

                  {/* Price tag */}
                  <div className="absolute top-4 left-4 glass-button text-sm font-semibold">
                    {project.price}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(project.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({project.rating}.0)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md">
                        +{project.techStack.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/project/${project.id}`);
                      }}
                      className="flex-1 py-2 px-3 text-sm border border-border/50 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/checkout/${project.id}`);
                      }}
                      className="flex-1 py-2 px-3 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors duration-300 font-semibold"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/projects')}
            className="glass-button text-lg group"
          >
            <span className="flex items-center gap-3">
              View All Projects
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300" 
              />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;