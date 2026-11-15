import { Locale } from '@/types'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  readTime: number
  featured: boolean
  image: string
  seo: SEO
  locale: Locale
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar: string
  role: string
  social: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  locale: Locale
}

export interface SEO {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImage?: string
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalCategories: number
  popularPosts: BlogPost[]
}

// Mock data for development
export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Dr. Alexandru Popescu',
    bio: 'AI Research Lead with 10+ years in machine learning and neural networks.',
    avatar: '/authors/alexandru.jpg',
    role: 'AI Research Lead',
    social: {
      twitter: '@alexpopescu',
      linkedin: '/in/alexandru-popescu'
    }
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    bio: 'Technical Content Manager specializing in AI and automation.',
    avatar: '/authors/sarah.jpg',
    role: 'Content Manager',
    social: {
      twitter: '@sarahjtech',
      linkedin: '/in/sarah-johnson-tech'
    }
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    bio: 'ML Engineer focused on practical AI implementations for businesses.',
    avatar: '/authors/ahmed.jpg', 
    role: 'ML Engineer',
    social: {
      linkedin: '/in/ahmed-hassan-ml'
    }
  }
]

export const mockCategories: Record<Locale, BlogCategory[]> = {
  en: [
    {
      id: '1',
      name: 'AI Trends',
      slug: 'ai-trends',
      description: 'Latest developments in artificial intelligence',
      color: 'blue',
      locale: 'en'
    },
    {
      id: '2',
      name: 'Machine Learning',
      slug: 'machine-learning',
      description: 'Deep dives into ML algorithms and applications',
      color: 'green',
      locale: 'en'
    },
    {
      id: '3',
      name: 'Automation',
      slug: 'automation',
      description: 'Business process automation strategies',
      color: 'purple',
      locale: 'en'
    },
    {
      id: '4',
      name: 'Industry News',
      slug: 'industry-news',
      description: 'Latest news from the AI industry',
      color: 'orange',
      locale: 'en'
    },
    {
      id: '5',
      name: 'Case Studies',
      slug: 'case-studies',
      description: 'Real-world AI implementation examples',
      color: 'red',
      locale: 'en'
    }
  ],
  ro: [
    {
      id: '1',
      name: 'Tendințe AI',
      slug: 'tendinte-ai',
      description: 'Ultimele dezvoltări în inteligența artificială',
      color: 'blue',
      locale: 'ro'
    },
    {
      id: '2',
      name: 'Învățare Automată',
      slug: 'invatare-automata',
      description: 'Analize aprofundate ale algoritmilor ML',
      color: 'green',
      locale: 'ro'
    },
    {
      id: '3',
      name: 'Automatizare',
      slug: 'automatizare',
      description: 'Strategii de automatizare a proceselor de afaceri',
      color: 'purple',
      locale: 'ro'
    }
  ],
  ar: [
    {
      id: '1',
      name: 'اتجاهات الذكاء الاصطناعي',
      slug: 'ai-trends-ar',
      description: 'أحدث التطورات في الذكاء الاصطناعي',
      color: 'blue',
      locale: 'ar'
    },
    {
      id: '2',
      name: 'التعلم الآلي',
      slug: 'machine-learning-ar',
      description: 'تحليل عميق لخوارزميات وتطبيقات التعلم الآلي',
      color: 'green',
      locale: 'ar'
    }
  ]
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '10-ways-ai-transforming-small-business',
    title: '10 Ways AI is Transforming Small Business Operations',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way small businesses operate, from customer service to inventory management.',
    content: `# 10 Ways AI is Transforming Small Business Operations

Small businesses are increasingly leveraging artificial intelligence to streamline operations, reduce costs, and improve customer experiences. Here are 10 key ways AI is making a difference:

## 1. Customer Service Automation
AI-powered chatbots and virtual assistants are handling customer inquiries 24/7, providing instant responses and freeing up human agents for complex issues.

## 2. Predictive Analytics
Small businesses are using AI to analyze customer data and predict future trends, helping them make informed decisions about inventory, marketing, and growth strategies.

## 3. Automated Bookkeeping
AI accounting software automatically categorizes expenses, generates reports, and even identifies potential tax deductions.

## 4. Inventory Management
Smart inventory systems use AI to predict demand, optimize stock levels, and automatically reorder products when needed.

## 5. Marketing Personalization
AI algorithms analyze customer behavior to create personalized marketing campaigns that significantly improve conversion rates.

## 6. Fraud Detection
Advanced AI systems can detect unusual patterns in transactions and flag potential fraud before it impacts the business.

## 7. Supply Chain Optimization
AI helps small businesses optimize their supply chains by predicting demand, identifying bottlenecks, and suggesting improvements.

## 8. Employee Scheduling
AI-powered scheduling tools consider employee preferences, skills, and business needs to create optimal work schedules.

## 9. Quality Control
Computer vision and AI can automatically inspect products for defects, ensuring consistent quality standards.

## 10. Financial Planning
AI financial advisors help small business owners make better financial decisions by analyzing market trends and business data.

The future is bright for small businesses embracing AI technology. Those who start implementing these solutions today will have a significant competitive advantage tomorrow.`,
    author: mockAuthors[0],
    category: 'AI Trends',
    tags: ['Small Business', 'AI', 'Automation', 'Technology'],
    publishedAt: '2024-03-15',
    updatedAt: '2024-03-15',
    readTime: 5,
    featured: true,
    image: '/blog/ai-small-business.jpg',
    seo: {
      metaTitle: '10 Ways AI is Transforming Small Business Operations | Hilyoon',
      metaDescription: 'Discover how artificial intelligence is revolutionizing small business operations. Learn about AI applications in customer service, analytics, and more.',
      keywords: ['AI', 'small business', 'automation', 'artificial intelligence', 'business operations']
    },
    locale: 'en'
  },
  {
    id: '2',
    slug: 'future-automation-beyond-task-management',
    title: 'The Future of Automation: Beyond Simple Task Management',
    excerpt: 'Explore the next generation of business automation that goes beyond basic workflows to intelligent decision-making.',
    content: `# The Future of Automation: Beyond Simple Task Management

Business automation has evolved far beyond simple task management. Today's intelligent automation systems are capable of complex decision-making, learning from data, and adapting to changing business conditions.

## The Evolution of Automation

### First Generation: Rule-Based Automation
Early automation systems followed simple if-then rules. While effective for repetitive tasks, they lacked flexibility and intelligence.

### Second Generation: Workflow Automation
Workflow automation connected multiple systems and processes, creating more sophisticated automated sequences.

### Third Generation: Intelligent Automation
Today's automation combines AI, machine learning, and advanced analytics to create truly intelligent systems.

## Key Capabilities of Modern Automation

### 1. Cognitive Decision Making
Modern automation systems can analyze complex scenarios, weigh multiple factors, and make decisions that previously required human judgment.

### 2. Natural Language Processing
AI-powered automation can understand and process human language, enabling more intuitive interactions and content processing.

### 3. Computer Vision
Automated systems can now "see" and interpret visual information, opening up new possibilities for quality control and monitoring.

### 4. Predictive Analytics
Advanced automation doesn't just react to current conditions—it predicts future scenarios and takes proactive action.

## Industry Applications

### Healthcare
Intelligent automation in healthcare can analyze medical images, predict patient outcomes, and optimize treatment plans.

### Finance
Financial automation now includes fraud detection, risk assessment, and automated investment strategies.

### Manufacturing
Smart manufacturing systems can predict equipment failures, optimize production schedules, and ensure quality control.

### Retail
Retail automation encompasses demand forecasting, dynamic pricing, and personalized customer experiences.

## The Road Ahead

The future of automation will be characterized by:
- Increased autonomy and self-learning capabilities
- Better human-AI collaboration
- More sophisticated decision-making algorithms
- Greater integration across business functions

Organizations that embrace this evolution will find themselves with significant competitive advantages in efficiency, accuracy, and innovation.`,
    author: mockAuthors[1],
    category: 'Automation',
    tags: ['Automation', 'Future Tech', 'AI', 'Business Intelligence'],
    publishedAt: '2024-03-12',
    updatedAt: '2024-03-12',
    readTime: 7,
    featured: true,
    image: '/blog/future-automation.jpg',
    seo: {
      metaTitle: 'The Future of Automation: Beyond Simple Task Management | Hilyoon',
      metaDescription: 'Explore the evolution of business automation from simple tasks to intelligent decision-making systems. Learn about modern automation capabilities.',
      keywords: ['automation', 'intelligent automation', 'AI automation', 'business automation', 'future technology']
    },
    locale: 'en'
  }
]

// Utility functions
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getBlogPostsByCategory(category: string, locale: Locale): BlogPost[] {
  return mockBlogPosts.filter(post => 
    post.category === category && post.locale === locale
  )
}

export function getFeaturedPosts(locale: Locale): BlogPost[] {
  return mockBlogPosts.filter(post => 
    post.featured && post.locale === locale
  )
}

export function searchBlogPosts(query: string, locale: Locale): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return mockBlogPosts.filter(post => 
    post.locale === locale && (
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  )
}

export function getBlogPostBySlug(slug: string, locale: Locale): BlogPost | undefined {
  return mockBlogPosts.find(post => 
    post.slug === slug && post.locale === locale
  )
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return mockBlogPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.locale === currentPost.locale &&
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit)
}
