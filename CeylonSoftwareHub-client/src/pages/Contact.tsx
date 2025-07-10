import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle,
  Clock,
  Shield,
  CheckCircle,
  User,
  Building
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        company: ''
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      details: 'support@ceylonsoftwarehub.com',
      description: 'Send us an email anytime',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      details: '+94 77 123 4567',
      description: 'Mon-Fri from 8am to 6pm',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Us',
      details: 'Colombo, Sri Lanka',
      description: 'Come say hello at our office',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      details: 'Mon - Fri: 8AM - 6PM',
      description: 'Saturday: 9AM - 4PM',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-sky-600 dark:text-sky-400" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock support team.'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />,
      title: 'Secure Communication',
      description: 'All communications are encrypted and your data is kept completely secure.'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      title: 'Quick Response',
      description: 'We typically respond to all inquiries within 24 hours or less.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                {' '}Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about our software? Need technical support? Want to partner with us? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200 dark:bg-sky-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-200 dark:border-gray-700"
              >
                <div className={`${info.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  {info.details}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Features & Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Contact Us?
                </h2>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      How quickly do you respond?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We typically respond within 24 hours, often much sooner during business hours.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Do you offer phone support?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Yes! Call us during business hours for immediate assistance with urgent matters.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Can I schedule a demo?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Absolutely! Contact us to schedule a personalized demo of our software solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;