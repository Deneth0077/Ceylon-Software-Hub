import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  GithubLogo, 
  ShoppingCart,
  Check,
  Lightning
} from 'phosphor-react';
import { projects, Project, PricingPlan } from '../data/projects';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  useEffect(() => {
    if (id) {
      const foundProject = projects.find(p => p.id === id);
      setProject(foundProject || null);
      
      // Auto-select popular plan if available
      if (foundProject?.pricingPlans) {
        const popularIndex = foundProject.pricingPlans.findIndex(plan => plan.popular);
        if (popularIndex !== -1) {
          setSelectedPlan(popularIndex);
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      // Page entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo('.project-hero',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.project-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo('.feature-item',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      );
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Project not found</h1>
          <button 
            onClick={() => navigate('/')}
            className="glass-button"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={20} 
        weight={i < rating ? 'fill' : 'regular'}
        className={i < rating ? 'text-accent' : 'text-muted-foreground'}
      />
    ));
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${project?.id}`);
  };

  const getCurrentPrice = () => {
    if (project?.pricingPlans && project.pricingPlans[selectedPlan]) {
      return project.pricingPlans[selectedPlan].price;
    }
    return project?.price || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-xl bg-background/80 border-glass-border">
        <div className="container px-6 py-4 mx-auto">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex gap-2 items-center transition-colors text-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            <div className="text-xl font-bold gradient-text">
              CeylonSoftware
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-6 py-16 project-hero">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-12 items-center lg:grid-cols-2">
              {/* Project Image */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl aspect-video glass-card">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* Floating price tag */}
                <div className="absolute -top-4 -right-4 text-2xl font-bold glass-button neon-glow">
                  {getCurrentPrice()}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    <span className="gradient-text">{project.title}</span>
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex gap-2 items-center mb-4">
                    <div className="flex gap-1 items-center">
                      {renderStars(project.rating)}
                    </div>
                    <span className="text-muted-foreground">
                      ({project.rating}.0 rating)
                    </span>
                  </div>

                  <p className="text-xl leading-relaxed text-muted-foreground">
                    {project.longDescription}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 text-sm font-medium glass-card"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing Plans */}
                {project.pricingPlans && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Choose Your Plan:</h3>
                    <div className="grid gap-3">
                      {project.pricingPlans.map((plan, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPlan(index)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left glass-card ${
                            selectedPlan === index
                              ? 'border-primary bg-primary/10 scale-105'
                              : 'border-glass-border hover:border-primary/50'
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-2 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-accent text-background">
                              Most Popular
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-foreground">{plan.duration}</div>
                              {plan.discount && (
                                <div className="text-sm font-medium text-accent">{plan.discount}</div>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-primary">{plan.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleBuyNow}
                    className="text-lg glass-button group bg-primary/20 border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Lightning size={20} className="mr-2" />
                    Buy Now - {getCurrentPrice()}
                  </button>
                  
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg glass-button group"
                    >
                      <Eye size={20} className="mr-2" />
                      Live Demo
                    </a>
                  )}
                  
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg glass-button group"
                    >
                      <GithubLogo size={20} className="mr-2" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 project-content">
          <div className="container mx-auto max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Features */}
              <div>
                <h2 className="mb-8 text-3xl font-bold gradient-text">
                  Key Features
                </h2>
                <div className="space-y-4">
                  {project.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex gap-3 items-start p-4 transition-transform duration-300 feature-item glass-card hover:scale-105"
                    >
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h2 className="mb-8 text-3xl font-bold gradient-text">
                  Project Details
                </h2>
                <div className="space-y-6">
                  <div className="p-6 glass-card">
                    <h3 className="mb-4 text-xl font-semibold">What's Included</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Complete source code</li>
                      <li>• Documentation & setup guide</li>
                      <li>• 30 days of support</li>
                      <li>• Future updates (1 year)</li>
                      <li>• Commercial license</li>
                    </ul>
                  </div>

                  <div className="p-6 glass-card">
                    <h3 className="mb-4 text-xl font-semibold">Requirements</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Node.js 18+ or compatible runtime</li>
                      <li>• Modern web browser</li>
                      <li>• Basic programming knowledge</li>
                      <li>• Development environment setup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold gradient-text">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Transform your vision into reality with our premium software solution. 
              Join hundreds of satisfied customers who have elevated their projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleBuyNow}
                className="px-8 py-4 text-xl glass-button group bg-primary/20 border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Lightning size={24} className="mr-3" />
                Buy Now - {getCurrentPrice()}
              </button>
              <button 
                onClick={() => navigate('/#contact')}
                className="px-8 py-4 text-xl glass-button group"
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail;