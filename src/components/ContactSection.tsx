import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  PaperPlaneTilt, 
  GithubLogo, 
  LinkedinLogo, 
  TwitterLogo,
  EnvelopeSimple,
  User,
  ChatCircle
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });

    // Title animation
    tl.fromTo('.contact-title',
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
        ease: 'power3.out'
      }
    );

    // Form inputs animation
    tl.fromTo('.form-input',
      { 
        opacity: 0, 
        x: -50 
      },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power2.out' 
      },
      '-=0.6'
    );

    // Social icons animation
    tl.fromTo('.social-icon',
      { 
        opacity: 0, 
        scale: 0,
        rotation: 180
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 0.5, 
        stagger: 0.1, 
        ease: 'back.out(1.7)' 
      },
      '-=0.4'
    );

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success animation
    gsap.to('.submit-button', {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });

    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const socialLinks = [
    { icon: GithubLogo, href: '#', label: 'GitHub', color: 'hover:text-foreground' },
    { icon: LinkedinLogo, href: '#', label: 'LinkedIn', color: 'hover:text-primary' },
    { icon: TwitterLogo, href: '#', label: 'Twitter', color: 'hover:text-secondary' },
    { icon: EnvelopeSimple, href: '#', label: 'Email', color: 'hover:text-accent' }
  ];

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="contact-title text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Get In</span> Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your ideas into reality? Let's discuss your next project
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="form-input space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <div className="relative">
                  <User 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 glass-card border-0 focus:ring-2 focus:ring-primary rounded-xl text-foreground placeholder-muted-foreground transition-all duration-300"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-input space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeSimple 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 glass-card border-0 focus:ring-2 focus:ring-primary rounded-xl text-foreground placeholder-muted-foreground transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="form-input space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <div className="relative">
                  <ChatCircle 
                    size={20} 
                    className="absolute left-4 top-4 text-muted-foreground" 
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 glass-card border-0 focus:ring-2 focus:ring-primary rounded-xl text-foreground placeholder-muted-foreground resize-none transition-all duration-300"
                    placeholder="Tell us about your project..."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button w-full glass-button text-lg font-semibold group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <PaperPlaneTilt 
                        size={20} 
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" 
                      />
                    </>
                  )}
                </span>
                
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                Let's Connect
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We're always excited to discuss new projects and opportunities. 
                  Whether you need a complete software solution or want to enhance 
                  your existing platform, we're here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Response time:</span> Within 24 hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Project consultation:</span> Free
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`social-icon w-12 h-12 glass-card flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;