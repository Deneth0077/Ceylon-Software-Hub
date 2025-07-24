export interface PricingPlan {
  duration: string;
  price: string;
  discount?: string;
  popular?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  price: string;
  pricingPlans?: PricingPlan[];
  rating: number;
  image: string;
  techStack: string[];
  longDescription: string;
  features: string[];
  category: 'ai-tools' | 'games' | 'tracking-software' | 'web-applications' | 'mobile-apps';
  subscriptionType: 'one-time' | 'subscription' | 'both';
  demo?: string;
  github?: string;
}

import project1Image from '../assets/project-1.jpg';
import project2Image from '../assets/project-2.jpg';
import project3Image from '../assets/project-3.jpg';
import project4Image from '../assets/project-4.jpg';
import project5Image from '../assets/project-5.jpg';
import project6Image from '../assets/project-6.jpg';

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'AI ChatBot Pro',
    description: 'Advanced AI chatbot with natural language processing and multi-language support.',
    price: 'From $29/month',
    pricingPlans: [
      { duration: '1 Month', price: '$49', popular: false },
      { duration: '3 Months', price: '$129', discount: '12% off', popular: true },
      { duration: '1 Year', price: '$399', discount: '32% off' }
    ],
    rating: 5,
    image: project1Image,
    techStack: ['React', 'TypeScript', 'OpenAI', 'Node.js', 'MongoDB'],
    longDescription: 'A comprehensive AI chatbot solution that provides natural language processing, multi-language support, and advanced conversation management. Perfect for businesses looking to automate customer support and engagement.',
    features: [
      'Natural language processing',
      'Multi-language support',
      'Custom training capabilities',
      'Analytics dashboard',
      '24/7 customer support',
      'API integration'
    ],
    category: 'ai-tools',
    subscriptionType: 'subscription',
    demo: 'https://demo.ceylonsoftware.com',
    github: 'https://github.com/ceylonsoftware'
  },
  {
    id: 'project-2',
    title: 'GameTracker Pro',
    description: 'Advanced gaming performance analytics and player tracking system.',
    price: 'From $19/month',
    pricingPlans: [
      { duration: '1 Month', price: '$29' },
      { duration: '3 Months', price: '$69', discount: '20% off', popular: true },
      { duration: '1 Year', price: '$199', discount: '43% off' }
    ],
    rating: 5,
    image: project2Image,
    techStack: ['Unity', 'C#', 'Node.js', 'MongoDB', 'WebGL'],
    longDescription: 'A comprehensive gaming analytics platform that tracks player performance, game statistics, and provides detailed insights for competitive gaming and esports.',
    features: [
      'Real-time performance tracking',
      'Advanced analytics dashboard',
      'Player statistics history',
      'Team collaboration tools',
      'Custom reporting system',
      'Multi-game support'
    ],
    category: 'tracking-software',
    subscriptionType: 'subscription'
  },
  {
    id: 'project-3',
    title: 'E-Commerce Builder',
    description: 'Complete e-commerce website builder with payment integration.',
    price: '$2,999',
    rating: 5,
    image: project3Image,
    techStack: ['React', 'Node.js', 'Stripe', 'MongoDB', 'Tailwind'],
    longDescription: 'A powerful e-commerce platform builder that enables businesses to create professional online stores with integrated payment processing and inventory management.',
    features: [
      'Drag & drop store builder',
      'Payment gateway integration',
      'Inventory management',
      'Customer analytics',
      'Mobile responsive design',
      'SEO optimization tools'
    ],
    category: 'web-applications',
    subscriptionType: 'one-time'
  },
  {
    id: 'project-4',
    title: 'Adventure Quest Mobile',
    description: 'Immersive mobile RPG with real-time multiplayer battles.',
    price: '$49.99',
    rating: 5,
    image: project4Image,
    techStack: ['Unity', 'C#', 'Photon', 'Firebase', 'AdMob'],
    longDescription: 'An engaging mobile RPG featuring real-time multiplayer battles, character customization, and an expansive fantasy world to explore.',
    features: [
      'Real-time multiplayer battles',
      'Character customization',
      'Quest system',
      'Guild mechanics',
      'In-app purchases',
      'Cross-platform play'
    ],
    category: 'games',
    subscriptionType: 'one-time'
  },
  {
    id: 'project-5',
    title: 'FitTracker Mobile App',
    description: 'Comprehensive fitness tracking mobile application.',
    price: 'From $9.99/month',
    pricingPlans: [
      { duration: '1 Month', price: '$14.99' },
      { duration: '3 Months', price: '$39.99', discount: '11% off' },
      { duration: '1 Year', price: '$99.99', discount: '44% off', popular: true }
    ],
    rating: 5,
    image: project5Image,
    techStack: ['React Native', 'Firebase', 'HealthKit', 'Google Fit'],
    longDescription: 'A comprehensive fitness tracking app that monitors workouts, nutrition, and health metrics with personalized coaching and social features.',
    features: [
      'Workout tracking',
      'Nutrition monitoring',
      'Progress analytics',
      'Social challenges',
      'Personal trainer AI',
      'Wearable device sync'
    ],
    category: 'mobile-apps',
    subscriptionType: 'subscription'
  },
  {
    id: 'project-6',
    title: 'Smart Analytics AI',
    description: 'AI-powered business analytics and prediction platform.',
    price: 'From $99/month',
    pricingPlans: [
      { duration: '1 Month', price: '$149' },
      { duration: '3 Months', price: '$399', discount: '11% off', popular: true },
      { duration: '1 Year', price: '$1299', discount: '27% off' }
    ],
    rating: 5,
    image: project6Image,
    techStack: ['Python', 'TensorFlow', 'React', 'PostgreSQL', 'Docker'],
    longDescription: 'An AI-powered analytics platform that provides intelligent business insights, predictive modeling, and automated reporting for data-driven decision making.',
    features: [
      'Predictive analytics',
      'Automated reporting',
      'Data visualization',
      'Custom AI models',
      'Real-time insights',
      'API integration'
    ],
    category: 'ai-tools',
    subscriptionType: 'subscription'
  }
];