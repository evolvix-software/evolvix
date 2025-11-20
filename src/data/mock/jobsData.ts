/**
 * Mock Jobs Data for LinkedIn-style Job Portal
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  remote: boolean;
  salary?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  fullDescription: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  postedAt: string;
  applicants: number;
  easyApply: boolean;
  promoted: boolean;
  viewed?: boolean;
  reviewTime?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  companyInfo: {
    followers: number;
    employees: string;
    industry: string;
    description: string;
    website?: string;
  };
  matchScore?: number; // Profile match percentage
}

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'Tecosys',
    companyLogo: undefined,
    location: 'Pune, Maharashtra, India',
    type: 'full-time',
    remote: true,
    salary: '₹8,00,000 - ₹12,00,000',
    salaryRange: { min: 800000, max: 1200000, currency: 'INR' },
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces using React and modern web technologies.',
    fullDescription: `**About the job**

This is a full-time remote position for a Frontend Developer. The Frontend Developer will design and develop user-focused web interfaces, implement responsive web designs, and collaborate with backend developers to integrate APIs.

**Company Description**

At Tecosys, we are transforming the future of enterprise AI by building responsible, sustainable, and cost-efficient solutions for industries like healthcare and finance. We're not just another IT services company. We are an AI product company, creating advanced AI models and autonomous agents. Our flagship product, Nutaan AI, is an enterprise-grade language model with advanced reasoning, multi-step understanding, and real-time data search capabilities. We aim to democratize ethical and impactful AI.

**Role Description**

This is a full-time remote position for a Frontend Developer. The Frontend Developer will design and develop user-focused web interfaces, implement responsive web designs, and collaborate with backend developers to integrate APIs.

**Responsibilities:**
- Design and develop user interfaces using React, TypeScript, and modern CSS frameworks
- Implement responsive web designs that work across all devices
- Collaborate with backend developers to integrate RESTful APIs
- Write clean, maintainable, and well-documented code
- Participate in code reviews and contribute to team best practices
- Optimize applications for maximum speed and scalability
- Stay up-to-date with emerging technologies and industry trends

**Requirements:**
- 3+ years of React experience
- Strong JavaScript and TypeScript skills
- Experience with modern CSS frameworks (Tailwind CSS, Styled Components)
- Knowledge of state management libraries (Redux, Zustand)
- Experience with testing frameworks (Jest, React Testing Library)
- Strong attention to detail, problem-solving skills, and the ability to work independently in a remote environment
- Bachelor's degree in Computer Science, Information Technology, or a related field is preferred
- Experience with AI, machine learning models, or data visualization tools is a plus`,
    requirements: [
      '3+ years of React experience',
      'Strong JavaScript and TypeScript skills',
      'Experience with modern CSS frameworks',
      'Knowledge of state management libraries',
      'Experience with testing frameworks',
      'Strong attention to detail and problem-solving skills',
      'Bachelor\'s degree in Computer Science or related field preferred',
    ],
    responsibilities: [
      'Design and develop user interfaces using React, TypeScript, and modern CSS frameworks',
      'Implement responsive web designs that work across all devices',
      'Collaborate with backend developers to integrate RESTful APIs',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and contribute to team best practices',
    ],
    benefits: [
      'Remote work flexibility',
      'Health insurance',
      'Professional development opportunities',
      'Competitive salary',
    ],
    postedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(), // 21 hours ago
    applicants: 150,
    easyApply: true,
    promoted: true,
    viewed: true,
    reviewTime: 'Company review time is typically 1 week',
    experienceLevel: 'mid',
    companyInfo: {
      followers: 3473,
      employees: '11-50 employees',
      industry: 'IT Services and IT Consulting',
      description: 'At Tecosys, we are transforming the future of enterprise AI by building responsible, sustainable, and cost-efficient solutions for industries like healthcare and finance.',
      website: 'https://tecosys.com',
    },
    matchScore: 85,
  },
  {
    id: 'job-2',
    title: 'Frontend Intern (Remote)',
    company: 'Quik Hire',
    companyLogo: undefined,
    location: 'India',
    type: 'internship',
    remote: true,
    salary: '₹15,000 - ₹25,000',
    salaryRange: { min: 15000, max: 25000, currency: 'INR' },
    description: 'Looking for a Frontend Intern to join our team. Learn React, TypeScript, and modern web development practices while working on real projects.',
    fullDescription: `**About the job**

This is a remote internship position for a Frontend Developer Intern. You will work alongside experienced developers to build user interfaces and learn industry best practices.

**Company Description**

Quik Hire is a fast-growing startup focused on connecting talented developers with exciting opportunities. We believe in learning by doing and provide hands-on experience with real-world projects.

**Responsibilities:**
- Assist in developing user interfaces using React
- Learn and apply modern web development practices
- Collaborate with the development team
- Participate in code reviews

**Requirements:**
- Currently pursuing or completed a degree in Computer Science or related field
- Basic knowledge of HTML, CSS, and JavaScript
- Eagerness to learn and grow
- Good communication skills`,
    requirements: [
      'Currently pursuing or completed a degree in Computer Science',
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Eagerness to learn and grow',
      'Good communication skills',
    ],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    applicants: 45,
    easyApply: true,
    promoted: true,
    experienceLevel: 'entry',
    companyInfo: {
      followers: 1200,
      employees: '1-10 employees',
      industry: 'Technology, Information and Internet',
      description: 'Quik Hire is a fast-growing startup focused on connecting talented developers with exciting opportunities.',
    },
    matchScore: 70,
  },
  {
    id: 'job-3',
    title: 'Frontend Developer',
    company: 'Emireq',
    companyLogo: undefined,
    location: 'Bengaluru, Karnataka, India',
    type: 'full-time',
    remote: true,
    salary: '₹10,00,000 - ₹15,00,000',
    salaryRange: { min: 1000000, max: 1500000, currency: 'INR' },
    description: 'Join Emireq as a Frontend Developer and work on cutting-edge web applications. We are looking for someone passionate about creating beautiful user experiences.',
    fullDescription: `**About the job**

Emireq is seeking a talented Frontend Developer to join our team. You will be responsible for building scalable web applications using modern technologies.

**Company Description**

Emireq is a leading technology company specializing in enterprise solutions. We help businesses transform their digital presence with innovative web applications.

**Responsibilities:**
- Develop and maintain web applications using React and Next.js
- Collaborate with designers to implement pixel-perfect UIs
- Optimize applications for performance and scalability
- Write unit and integration tests
- Participate in agile development processes

**Requirements:**
- 4+ years of experience in frontend development
- Strong proficiency in React, Next.js, and TypeScript
- Experience with CSS-in-JS solutions
- Knowledge of GraphQL and REST APIs
- Experience with CI/CD pipelines
- Strong problem-solving and communication skills`,
    requirements: [
      '4+ years of experience in frontend development',
      'Strong proficiency in React, Next.js, and TypeScript',
      'Experience with CSS-in-JS solutions',
      'Knowledge of GraphQL and REST APIs',
      'Experience with CI/CD pipelines',
    ],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    applicants: 89,
    easyApply: true,
    promoted: true,
    reviewTime: 'Company review time is typically 1 week',
    experienceLevel: 'mid',
    companyInfo: {
      followers: 2500,
      employees: '51-200 employees',
      industry: 'Software Development',
      description: 'Emireq is a leading technology company specializing in enterprise solutions.',
    },
    matchScore: 78,
  },
  {
    id: 'job-4',
    title: 'Frontend Developer',
    company: 'giftEZ',
    companyLogo: undefined,
    location: 'Mumbai, Maharashtra, India',
    type: 'full-time',
    remote: false,
    salary: '₹7,00,000 - ₹10,00,000',
    salaryRange: { min: 700000, max: 1000000, currency: 'INR' },
    description: 'giftEZ is looking for a Frontend Developer to help build our e-commerce platform. Work on exciting features that impact millions of users.',
    fullDescription: `**About the job**

Join giftEZ as a Frontend Developer and help us build the next generation of e-commerce experiences. You'll work on features that directly impact our millions of users.

**Company Description**

giftEZ is a leading e-commerce platform specializing in gift solutions. We make it easy for people to find and send the perfect gifts for any occasion.

**Responsibilities:**
- Build responsive web applications using React
- Implement new features and improve existing ones
- Work closely with product managers and designers
- Ensure code quality through testing and code reviews
- Optimize for performance and user experience

**Requirements:**
- 2+ years of React experience
- Strong JavaScript and CSS skills
- Experience with e-commerce platforms is a plus
- Good understanding of web performance optimization
- Team player with excellent communication skills`,
    requirements: [
      '2+ years of React experience',
      'Strong JavaScript and CSS skills',
      'Experience with e-commerce platforms is a plus',
      'Good understanding of web performance optimization',
    ],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    applicants: 120,
    easyApply: false,
    promoted: false,
    experienceLevel: 'mid',
    companyInfo: {
      followers: 5000,
      employees: '201-500 employees',
      industry: 'E-commerce',
      description: 'giftEZ is a leading e-commerce platform specializing in gift solutions.',
    },
    matchScore: 65,
  },
  {
    id: 'job-5',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Solutions',
    companyLogo: undefined,
    location: 'Hyderabad, Telangana, India',
    type: 'full-time',
    remote: true,
    salary: '₹15,00,000 - ₹25,00,000',
    salaryRange: { min: 1500000, max: 2500000, currency: 'INR' },
    description: 'Lead frontend development initiatives at TechCorp Solutions. We are looking for a senior engineer to architect and build scalable web applications.',
    fullDescription: `**About the job**

TechCorp Solutions is seeking a Senior Frontend Engineer to lead our frontend development initiatives. You will architect scalable solutions and mentor junior developers.

**Company Description**

TechCorp Solutions is a technology consulting firm helping businesses transform their digital presence. We work with Fortune 500 companies to build cutting-edge applications.

**Responsibilities:**
- Architect and design scalable frontend solutions
- Lead frontend development projects
- Mentor junior developers and conduct code reviews
- Collaborate with cross-functional teams
- Drive technical decisions and best practices

**Requirements:**
- 6+ years of frontend development experience
- Expert-level knowledge of React, TypeScript, and modern frameworks
- Experience leading teams and projects
- Strong architectural and design skills
- Excellent communication and leadership abilities`,
    requirements: [
      '6+ years of frontend development experience',
      'Expert-level knowledge of React, TypeScript, and modern frameworks',
      'Experience leading teams and projects',
      'Strong architectural and design skills',
    ],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    applicants: 67,
    easyApply: true,
    promoted: false,
    experienceLevel: 'senior',
    companyInfo: {
      followers: 15000,
      employees: '1001-5000 employees',
      industry: 'Technology Consulting',
      description: 'TechCorp Solutions is a technology consulting firm helping businesses transform their digital presence.',
    },
    matchScore: 92,
  },
];

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const posted = new Date(date);
  const diffMs = now.getTime() - posted.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}${diffHours === 1 ? ' hour' : ' hours'} ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`;
}

