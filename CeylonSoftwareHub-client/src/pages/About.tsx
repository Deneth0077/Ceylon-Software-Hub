import React from 'react';
import { 
  Shield, 
  Users, 
  Award, 
  Target,
  Heart,
  Globe,
  Zap,
  CheckCircle,
  Code,
  Lightbulb
} from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Software Products', value: '500+', icon: <Code className="w-6 h-6" /> },
    { label: 'Happy Customers', value: '10K+', icon: <Users className="w-6 h-6" /> },
    { label: 'Countries Served', value: '50+', icon: <Globe className="w-6 h-6" /> },
    { label: 'Years Experience', value: '5+', icon: <Award className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
      title: 'Security First',
      description: 'Every software solution we offer is thoroughly tested and verified for security vulnerabilities to protect your business.'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />,
      title: 'Customer Focused',
      description: 'Our customers are at the heart of everything we do. We listen, adapt, and deliver solutions that truly meet your needs.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />,
      title: 'Innovation Driven',
      description: 'We constantly seek out the latest and most innovative software solutions to keep you ahead of the competition.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: 'Quality Assured',
      description: 'Every product in our catalog meets our strict quality standards and comes with comprehensive support.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Perera',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Visionary leader with 15+ years in software industry'
    },
    {
      name: 'Priya Silva',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Technical expert specializing in enterprise solutions'
    },
    {
      name: 'Amal Fernando',
      role: 'Head of Sales',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Customer relationship specialist with proven track record'
    },
    {
      name: 'Nisha Jayawardena',
      role: 'Head of Support',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Dedicated to ensuring exceptional customer experience'
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'Ceylon Software Hub was established with a vision to democratize access to premium software solutions.'
    },
    {
      year: '2020',
      title: 'First 1000 Customers',
      description: 'Reached our first major milestone of serving 1000 satisfied customers across various industries.'
    },
    {
      year: '2021',
      title: 'International Expansion',
      description: 'Expanded our services globally, now serving customers in over 50 countries worldwide.'
    },
    {
      year: '2022',
      title: 'Partnership Program',
      description: 'Launched our partner program, collaborating with leading software vendors and developers.'
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Integrated AI-powered recommendations and support systems to enhance customer experience.'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Became the leading software marketplace in South Asia with 10,000+ active customers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-white">
              About
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                {' '}Ceylon Software Hub
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              We're on a mission to make premium software accessible to everyone. From startups to enterprises, 
              we provide the tools you need to succeed in the digital world.
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute left-10 top-20 w-20 h-20 bg-sky-200 rounded-full opacity-20 animate-pulse dark:bg-sky-800"></div>
        <div className="absolute right-10 bottom-20 w-32 h-32 bg-emerald-200 rounded-full opacity-20 delay-1000 animate-pulse dark:bg-emerald-800"></div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex justify-center items-center mb-4 w-16 h-16 text-white bg-gradient-to-r from-sky-600 to-emerald-600 rounded-2xl transition-transform duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>
                <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 items-center lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
                Our Mission & Vision
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-shrink-0 justify-center items-center w-12 h-12 bg-sky-100 rounded-xl dark:bg-sky-900/20">
                    <Target className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      Our Mission
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                      To democratize access to premium software solutions by providing a secure, 
                      reliable, and user-friendly marketplace where businesses and individuals can 
                      find the tools they need to thrive in the digital age.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex flex-shrink-0 justify-center items-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/20">
                    <Lightbulb className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      Our Vision
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                      To become the world's most trusted software marketplace, known for our 
                      commitment to quality, security, and exceptional customer service. We envision 
                      a future where every business has access to the software they need to succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-20 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              These values guide everything we do and shape how we interact with our customers, 
              partners, and each other.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-gray-50 rounded-2xl transition-all duration-300 transform dark:bg-gray-700 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              Our diverse team of experts is passionate about technology and dedicated to 
              helping you find the perfect software solutions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 transform dark:bg-gray-800 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/20"></div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="mb-3 font-medium text-sky-600 dark:text-sky-400">
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 py-20 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Our Journey
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              From a small startup to a leading software marketplace, here's how we've grown 
              and evolved over the years.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-sky-600 to-emerald-600 rounded-full transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="p-6 bg-gray-50 rounded-2xl shadow-lg transition-shadow duration-300 dark:bg-gray-700 hover:shadow-xl">
                      <div className="mb-2 text-2xl font-bold text-sky-600 dark:text-sky-400">
                        {milestone.year}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                        {milestone.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-6 h-6 bg-white rounded-full border-4 border-sky-600 dark:bg-gray-800"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-sky-600 to-emerald-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Join Our Journey?
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-sky-100">
            Whether you're looking for software solutions or want to partner with us, 
            we'd love to hear from you and explore how we can work together.
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <a
              href="/contact"
              className="px-8 py-4 font-semibold text-sky-600 bg-white rounded-xl transition-colors duration-300 transform hover:bg-gray-100 hover:scale-105"
            >
              Get in Touch
            </a>
            <a
              href="/products"
              className="px-8 py-4 font-semibold text-white rounded-xl border-2 border-white transition-all duration-300 transform hover:bg-white hover:text-sky-600 hover:scale-105"
            >
              Explore Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;