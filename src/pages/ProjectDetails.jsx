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
import axios from 'axios';

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} [longDescription]
 * @property {string|number} price
 * @property {string} image
 * @property {string} category
 * @property {number} rating
 * @property {string[]} [features]
 * @property {string[]} [techStack]
 * @property {Array<{duration: string, price: string, discount?: string, popular?: boolean}>} [pricingPlans]
 * @property {string[]} [systemRequirements]
 * @property {boolean} [isFeatured]
 * @property {number} [stock]
 * @property {string[]} [tags]
 * @property {string} [status]
 * @property {string} [demo]
 * @property {string} [github]
 */

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  /** @type {[Project|null, Function]} */
  const [project, setProject] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(0);

  useEffect(() => {
    if (id) {
      setProject(null);
      axios.get(`/api/products/${id}`)
        .then(res => {
          /** @type {Project} */
          const foundProject = res.data.data;
          setProject(foundProject || null);
          // Auto-select popular plan if available
          if (foundProject?.pricingPlans) {
            const popularIndex = foundProject.pricingPlans.findIndex(plan => plan.popular);
            if (popularIndex !== -1) {
              setSelectedPlan(popularIndex);
            }
          }
        })
        .catch(() => setProject(null));
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading project...</h1>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
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
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
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
        <section className="project-hero py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Project Image */}
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden glass-card">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating price tag */}
                <div className="absolute -top-4 -right-4 glass-button text-2xl font-bold neon-glow">
                  {getCurrentPrice()}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text">{project.title}</span>
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(project.rating)}
                    </div>
                    <span className="text-muted-foreground">
                      ({project.rating}.0 rating)
                    </span>
                  </div>

                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 glass-card text-sm font-medium"
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
                            <div className="absolute -top-2 left-4 px-3 py-1 bg-accent text-background text-xs rounded-full font-semibold">
                              Most Popular
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">{plan.duration}</div>
                              {plan.discount && (
                                <div className="text-sm text-accent font-medium">{plan.discount}</div>
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
                    className="glass-button text-lg group bg-primary/20 border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Lightning size={20} className="mr-2" />
                    Buy Now - {getCurrentPrice()}
                  </button>
                  
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button text-lg group"
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
                      className="glass-button text-lg group"
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
        <section className="project-content py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h2 className="text-3xl font-bold mb-8 gradient-text">
                  Key Features
                </h2>
                <div className="space-y-4">
                  {project.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="feature-item flex items-start gap-3 p-4 glass-card hover:scale-105 transition-transform duration-300"
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
                <h2 className="text-3xl font-bold mb-8 gradient-text">
                  Project Details
                </h2>
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Complete source code</li>
                      <li>• Documentation & setup guide</li>
                      <li>• 30 days of support</li>
                      <li>• Future updates (1 year)</li>
                      <li>• Commercial license</li>
                    </ul>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
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
        <section className="py-16 px-6 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your vision into reality with our premium software solution. 
              Join hundreds of satisfied customers who have elevated their projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleBuyNow}
                className="glass-button text-xl px-8 py-4 group bg-primary/20 border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Lightning size={24} className="mr-3" />
                Buy Now - {getCurrentPrice()}
              </button>
              <button 
                onClick={() => navigate('/#contact')}
                className="glass-button text-xl px-8 py-4 group"
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