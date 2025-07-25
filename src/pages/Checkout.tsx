import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ArrowLeft, MessageCircle } from 'lucide-react';
import { projects } from '@/data/projects';
import gsap from 'gsap';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const project = projects.find(p => p.id === id);
  
  useEffect(() => {
    // Auto-select popular plan if available
    if (project?.pricingPlans) {
      const popularIndex = project.pricingPlans.findIndex(plan => plan.popular);
      if (popularIndex !== -1) {
        setSelectedPlan(popularIndex);
      }
    }
  }, [project]);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo('.checkout-container', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo('.form-field',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, delay: 0.3 }
    );
  }, []);

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Project Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleWhatsAppRedirect = () => {
    const selectedPrice = project?.pricingPlans ? project.pricingPlans[selectedPlan] : null;
    const finalPrice = selectedPrice ? selectedPrice.price : project?.price;
    const planDetails = selectedPrice ? `Plan: ${selectedPrice.duration}` : '';
    
    const message = `Hi! I would like to purchase "${project?.title}".

My Details:
Name: ${formData.name}
Email: ${formData.email}
Contact: ${formData.contact}

Purchase Details:
Project: ${project?.title}
${planDetails}
Price: ${finalPrice}
${selectedPrice?.discount ? `Discount: ${selectedPrice.discount}` : ''}

I have uploaded the payment slip and would like to proceed with the purchase.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const isFormValid = formData.name && formData.email && formData.contact && uploadedFile;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="overflow-hidden fixed inset-0 pointer-events-none">
        <div className="absolute left-10 top-20 w-64 h-64 rounded-full blur-3xl bg-primary/10 animate-float" />
        <div className="absolute right-10 bottom-20 w-96 h-96 rounded-full blur-3xl bg-accent/10 animate-float-delayed" />
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Projects
        </Button>

        <div className="mx-auto max-w-4xl checkout-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Project Details */}
            <Card className="card-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-48 rounded-lg"
                />
                <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Pricing Plans */}
                {project.pricingPlans ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Choose Your Plan:</h4>
                    <div className="grid gap-3">
                      {project.pricingPlans.map((plan, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPlan(index)}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                            selectedPlan === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-2 left-4 px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                              Popular
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-foreground">{plan.duration}</div>
                              {plan.discount && (
                                <div className="text-sm text-primary">{plan.discount}</div>
                              )}
                            </div>
                            <div className="text-xl font-bold text-primary">{plan.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total Price:</span>
                      <span className="text-2xl font-bold text-primary">{project.price}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="card-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Purchase Information</CardTitle>
                <p className="text-muted-foreground">
                  Please fill in your details and upload payment slip
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bank Details */}
                <div className="p-4 rounded-lg border bg-muted/50 border-border/50">
                  <h4 className="mb-2 font-semibold text-foreground">Bank Transfer Details:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Bank:</strong> Ceylon Commercial Bank</p>
                    <p><strong>Account:</strong> 8001234567890</p>
                    <p><strong>Name:</strong> CeylonSoftware (Pvt) Ltd</p>
                    <p><strong>Amount:</strong> {project.pricingPlans ? project.pricingPlans[selectedPlan]?.price : project.price}</p>
                    {project.pricingPlans && project.pricingPlans[selectedPlan]?.discount && (
                      <p className="text-primary"><strong>Discount:</strong> {project.pricingPlans[selectedPlan].discount}</p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2 form-field">
                  <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="input-glass"
                    required
                  />
                </div>

                <div className="space-y-2 form-field">
                  <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="input-glass"
                    required
                  />
                </div>

                <div className="space-y-2 form-field">
                  <Label htmlFor="contact" className="text-foreground">Contact Number *</Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    className="input-glass"
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2 form-field">
                  <Label htmlFor="slip" className="text-foreground">Upload Payment Slip *</Label>
                  <div className="relative">
                    <Input
                      id="slip"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="input-glass file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                      required
                    />
                    {uploadedFile && (
                      <div className="p-2 mt-2 rounded-lg border bg-primary/10 border-primary/20">
                        <div className="flex gap-2 items-center text-sm text-primary">
                          <Upload className="w-4 h-4" />
                          {uploadedFile.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleWhatsAppRedirect}
                  disabled={!isFormValid}
                  className="py-6 w-full text-lg btn-glow"
                  size="lg"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Continue on WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By clicking continue, you'll be redirected to WhatsApp to complete your purchase
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;