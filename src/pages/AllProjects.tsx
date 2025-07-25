import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagnifyingGlass, Funnel, Star, ArrowRight, GridFour, ListBullets } from 'phosphor-react';
import { projects, Project } from '../data/projects';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const AllProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Products', count: projects.length },
    { id: 'ai-tools', label: 'AI Tools', count: projects.filter(p => p.category === 'ai-tools').length },
    { id: 'games', label: 'Games', count: projects.filter(p => p.category === 'games').length },
    { id: 'tracking-software', label: 'Tracking Software', count: projects.filter(p => p.category === 'tracking-software').length },
    { id: 'web-applications', label: 'Web Apps', count: projects.filter(p => p.category === 'web-applications').length },
    { id: 'mobile-apps', label: 'Mobile Apps', count: projects.filter(p => p.category === 'mobile-apps').length },
  ];

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[$,]/g, '')) - parseInt(b.price.replace(/[$,]/g, ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    // Page entrance animation
    gsap.fromTo('.page-header',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo('.filter-controls',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo('.project-item',
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out'
      }
    );
  }, [filteredProjects]);

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

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div ref={pageRef} className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="container px-6 py-12 mx-auto page-header">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            <span className="gradient-text">All</span> Projects
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Explore our complete collection of premium software solutions
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="sticky top-0 z-40 border-b backdrop-blur-md filter-controls bg-background/80 border-border/50">
        <div className="container px-6 py-4 mx-auto">
          <div className="flex flex-col gap-4 justify-between items-center lg:flex-row">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border bg-muted/30 border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="px-3 py-2 text-sm rounded-lg border bg-muted/30 border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>

              <div className="flex overflow-hidden rounded-lg border border-border/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}
                >
                  <GridFour size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}
                >
                  <ListBullets size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="container px-6 py-8 mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-bold">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="cursor-pointer project-item group"
                onClick={() => handleProjectClick(project.id)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <Card className="h-full transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                    <div className="overflow-hidden relative h-48 rounded-t-lg">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-background/80 via-background/20 group-hover:opacity-100"></div>
                      <div className="flex absolute top-4 right-4 justify-center items-center w-10 h-10 rounded-full opacity-0 backdrop-blur-sm transition-all duration-300 bg-primary/80 group-hover:opacity-100">
                        <ArrowRight size={20} className="text-white" />
                      </div>
                      <div className="absolute top-4 left-4 text-sm font-semibold glass-button">
                        {project.price}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex gap-1 items-center mb-2">
                        {renderStars(project.rating)}
                        <span className="ml-2 text-sm text-muted-foreground">({project.rating}.0)</span>
                      </div>
                      <CardTitle className="mb-2 text-lg transition-colors group-hover:text-primary">
                        {project.title}
                      </CardTitle>
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.techStack.slice(0, 2).map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 2 && (
                          <span className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground">
                            +{project.techStack.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${project.id}`);
                          }}
                          className="flex-1 px-3 py-2 text-sm rounded-lg border transition-colors border-border/50 hover:bg-muted/50"
                        >
                          Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/checkout/${project.id}`);
                          }}
                          className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors bg-primary hover:bg-primary/80 text-primary-foreground"
                        >
                          Buy
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // List View
                  <Card className="transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row">
                      <div className="overflow-hidden relative w-full h-32 rounded-l-lg md:w-48 md:h-auto">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 left-2 text-sm font-semibold glass-button">
                          {project.price}
                        </div>
                      </div>
                      <CardContent className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col justify-between md:flex-row md:items-center">
                          <div className="flex-1">
                            <div className="flex gap-1 items-center mb-2">
                              {renderStars(project.rating)}
                              <span className="ml-2 text-sm text-muted-foreground">({project.rating}.0)</span>
                            </div>
                            <CardTitle className="mb-2 text-xl transition-colors group-hover:text-primary">
                              {project.title}
                            </CardTitle>
                            <p className="mb-3 text-muted-foreground">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.techStack.slice(0, 4).map((tech) => (
                                <span 
                                  key={tech}
                                  className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 4 && (
                                <span className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground">
                                  +{project.techStack.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 md:flex-col md:mt-0 md:ml-6">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/project/${project.id}`);
                              }}
                              className="px-4 py-2 text-sm rounded-lg border transition-colors border-border/50 hover:bg-muted/50"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/checkout/${project.id}`);
                              }}
                              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-primary hover:bg-primary/80 text-primary-foreground"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;