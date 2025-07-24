import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagnifyingGlass, Funnel, Star, ArrowRight, GridFour, ListBullets } from 'phosphor-react';
import axios from 'axios';
// If you still get a type error, you may need to install types: npm install --save-dev @types/axios

// Define the Project type based on backend structure
type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: string | number;
  image: string;
  category: string;
  rating: number;
  features?: string[];
  techStack?: string[];
  pricingPlans?: Array<{
    duration: string;
    price: string;
    discount?: string;
    popular?: boolean;
  }>;
  systemRequirements?: string[];
  isFeatured?: boolean;
  stock?: number;
  tags?: string[];
  status?: string;
  demo?: string;
  github?: string;
};
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const AllProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  // Fetch projects from backend
  useEffect(() => {
    setLoading(true);
    axios.get<{ data: Project[] }>('/api/products')
      .then(res => {
        setProjects(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load projects');
        setLoading(false);
      });
  }, []);

  // Compute categories from fetched projects
  const categories = useMemo(() => [
    { id: 'all', label: 'All Products', count: projects.length },
    ...Array.from(new Set(projects.map(p => p.category))).map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
      count: projects.filter(p => p.category === cat).length
    }))
  ], [projects]);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = (project.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.techStack || []).some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    // Sort projects
    filtered.sort((a, b) => {
      let aPrice: number, bPrice: number;
      switch (sortBy) {
        case 'price': {
          aPrice = typeof a.price === 'string' ? parseInt(a.price.replace(/[$,]/g, '')) : a.price;
          bPrice = typeof b.price === 'string' ? parseInt(b.price.replace(/[$,]/g, '')) : b.price;
          return aPrice - bPrice;
        }
        case 'rating':
          return b.rating - a.rating;
        default:
          return (a.title || '').localeCompare(b.title || '');
      }
    });
    return filtered;
  }, [projects, searchTerm, selectedCategory, sortBy]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading projects...</h1>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
        </div>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="page-header container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">All</span> Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium software solutions
          </p>
        </div>
      </div>
      {/* Filter Controls */}
      <div className="filter-controls sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <div className="flex border border-border/50 rounded-lg overflow-hidden">
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
      <div className="container mx-auto px-6 py-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
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
                className="project-item group cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 w-10 h-10 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight size={20} className="text-white" />
                      </div>
                      <div className="absolute top-4 left-4 glass-button text-sm font-semibold">
                        {project.price}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(project.rating)}
                        <span className="text-sm text-muted-foreground ml-2">({project.rating}.0)</span>
                      </div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.techStack.slice(0, 2).map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md">
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
                          className="flex-1 py-2 px-3 text-sm border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/checkout/${project.id}`);
                          }}
                          className="flex-1 py-2 px-3 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors font-semibold"
                        >
                          Buy
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // List View
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden rounded-l-lg">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 glass-button text-sm font-semibold">
                          {project.price}
                        </div>
                      </div>
                      <CardContent className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(project.rating)}
                              <span className="text-sm text-muted-foreground ml-2">({project.rating}.0)</span>
                            </div>
                            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                            <p className="text-muted-foreground mb-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.techStack.slice(0, 4).map((tech) => (
                                <span 
                                  key={tech}
                                  className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 4 && (
                                <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md">
                                  +{project.techStack.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/project/${project.id}`);
                              }}
                              className="px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/checkout/${project.id}`);
                              }}
                              className="px-4 py-2 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors font-semibold"
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