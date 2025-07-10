import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-sky-400" />
              <span className="text-xl font-bold">Ceylon Software Hub</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for premium software solutions. Quality guaranteed with instant access and 24/7 support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-sky-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=software%20&%20apps" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Software & Apps
                </Link>
              </li>
              <li>
                <Link to="/products?category=MS%20office%20keys" className="text-gray-300 hover:text-sky-400 transition-colors">
                  MS Office Keys
                </Link>
              </li>
              <li>
                <Link to="/products?category=Windows%20Keys" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Windows Keys
                </Link>
              </li>
              <li>
                <Link to="/products?category=PC%20games" className="text-gray-300 hover:text-sky-400 transition-colors">
                  PC Games
                </Link>
              </li>
              <li>
                <Link to="/products?category=Cracked" className="text-gray-300 hover:text-sky-400 transition-colors">
                  Cracked
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">support@ceylonsoftwarehub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">+94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Ceylon Software Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;