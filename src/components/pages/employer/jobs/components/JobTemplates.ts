import { JobFormData } from './PostJobSteps';

export interface JobTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  isPreBuilt: boolean;
  createdAt?: string;
  data: Partial<JobFormData>;
}

export const preBuiltTemplates: JobTemplate[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    category: 'Engineering',
    description: 'Full-stack software engineer position with modern tech stack',
    isPreBuilt: true,
    data: {
      title: 'Software Engineer',
      employmentType: 'full-time',
      location: 'Remote',
      remoteType: 'remote',
      seniorityLevel: 'mid',
      description: `We are seeking a talented Software Engineer to join our dynamic engineering team. In this role, you will be responsible for designing, developing, and maintaining scalable web applications that serve thousands of users.

**About the Role:**
As a Software Engineer, you'll work on cutting-edge projects, collaborate with cross-functional teams, and contribute to our product roadmap. You'll have the opportunity to work with modern technologies and best practices while solving complex technical challenges.

**What You'll Do:**
- Design and develop scalable web applications using modern frameworks
- Write clean, maintainable, and well-documented code
- Collaborate with product managers, designers, and other engineers
- Participate in code reviews and contribute to technical decisions
- Optimize applications for performance and scalability
- Stay current with emerging technologies and industry trends

**What We're Looking For:**
- Strong problem-solving skills and attention to detail
- Ability to work independently and as part of a team
- Passion for writing quality code and continuous learning
- Excellent communication and collaboration skills`,
      responsibilities: [
        'Design and develop scalable web applications using React, Node.js, and TypeScript',
        'Collaborate with cross-functional teams including product, design, and backend engineers',
        'Write clean, maintainable, and well-documented code following best practices',
        'Participate in code reviews and provide constructive feedback',
        'Optimize applications for maximum speed and scalability',
        'Troubleshoot and debug issues across the application stack',
        'Contribute to technical architecture decisions and system design',
        'Mentor junior developers and share knowledge with the team',
      ],
      requirements: [
        "Bachelor's degree in Computer Science, Engineering, or related field (or equivalent experience)",
        '3+ years of professional software development experience',
        'Strong proficiency in JavaScript/TypeScript and modern web frameworks',
        'Experience with React, Node.js, and RESTful API development',
        'Knowledge of database systems (SQL and NoSQL)',
        'Experience with version control systems (Git)',
        'Understanding of software development lifecycle and agile methodologies',
        'Excellent problem-solving and analytical skills',
        'Strong communication and collaboration abilities',
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'REST APIs', 'Agile'],
      salaryMin: '80000',
      salaryMax: '120000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan', 'Paid Time Off', 'Remote Work', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    category: 'Engineering',
    description: 'Frontend developer specializing in React and modern UI frameworks',
    isPreBuilt: true,
    data: {
      title: 'Frontend Developer',
      employmentType: 'full-time',
      location: 'San Francisco, CA',
      remoteType: 'hybrid',
      seniorityLevel: 'mid',
      description: `We're looking for a skilled Frontend Developer to join our product team. You'll be responsible for building beautiful, responsive user interfaces that provide exceptional user experiences.

**About the Role:**
As a Frontend Developer, you'll work closely with our design team to bring mockups to life, implement interactive features, and ensure our applications are accessible and performant. You'll have the opportunity to work on exciting projects and make a real impact on our product.

**Key Responsibilities:**
- Build responsive, accessible user interfaces using React and TypeScript
- Implement design systems and component libraries
- Optimize applications for performance and user experience
- Collaborate with designers to translate mockups into code
- Write unit and integration tests
- Participate in design and code reviews`,
      responsibilities: [
        'Build responsive user interfaces using React, TypeScript, and modern CSS',
        'Implement design systems and reusable component libraries',
        'Optimize applications for performance, accessibility, and SEO',
        'Collaborate with UX/UI designers to translate designs into code',
        'Write clean, maintainable code following best practices',
        'Develop and maintain unit and integration tests',
        'Participate in code reviews and design discussions',
        'Stay updated with frontend technologies and best practices',
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        '2+ years of frontend development experience',
        'Strong proficiency in React, TypeScript, and modern JavaScript',
        'Experience with CSS frameworks (Tailwind CSS, Styled Components)',
        'Knowledge of state management (Redux, Zustand, Context API)',
        'Experience with testing frameworks (Jest, React Testing Library)',
        'Understanding of responsive design principles',
        'Portfolio demonstrating strong UI/UX skills',
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Tailwind CSS', 'Git', 'Jest'],
      salaryMin: '70000',
      salaryMax: '110000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Vision Insurance', 'Paid Time Off', 'Flexible Hours', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: true,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    category: 'Engineering',
    description: 'Backend developer focused on API development and system architecture',
    isPreBuilt: true,
    data: {
      title: 'Backend Developer',
      employmentType: 'full-time',
      location: 'Remote',
      remoteType: 'remote',
      seniorityLevel: 'senior',
      description: `We're seeking an experienced Backend Developer to design and build robust, scalable APIs and services. You'll work on critical infrastructure that powers our platform and serves millions of requests daily.

**About the Role:**
As a Backend Developer, you'll be responsible for designing APIs, optimizing database queries, implementing caching strategies, and ensuring system reliability. You'll work with modern technologies and have the opportunity to solve complex technical challenges.

**What You'll Do:**
- Design and develop RESTful and GraphQL APIs
- Optimize database queries and implement caching strategies
- Build microservices and distributed systems
- Ensure system reliability, scalability, and security
- Collaborate with frontend and DevOps teams
- Write comprehensive tests and documentation`,
      responsibilities: [
        'Design and develop scalable RESTful and GraphQL APIs',
        'Optimize database queries and implement efficient data access patterns',
        'Build and maintain microservices architecture',
        'Implement caching strategies and performance optimizations',
        'Ensure system security and data protection',
        'Write comprehensive unit and integration tests',
        'Collaborate with frontend developers and DevOps engineers',
        'Participate in system architecture and technical design decisions',
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        '5+ years of backend development experience',
        'Strong proficiency in Node.js, Python, or Go',
        'Experience with database systems (PostgreSQL, MongoDB, Redis)',
        'Knowledge of API design principles and best practices',
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Understanding of microservices architecture',
        'Strong problem-solving and debugging skills',
      ],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'GraphQL', 'AWS', 'Docker'],
      salaryMin: '90000',
      salaryMax: '140000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan', 'Paid Time Off', 'Remote Work', 'Stock Options'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'full-stack-developer',
    name: 'Full Stack Developer',
    category: 'Engineering',
    description: 'Full stack developer comfortable with both frontend and backend',
    isPreBuilt: true,
    data: {
      title: 'Full Stack Developer',
      employmentType: 'full-time',
      location: 'New York, NY',
      remoteType: 'hybrid',
      seniorityLevel: 'mid',
      description: `We're looking for a Full Stack Developer who can work across the entire technology stack. You'll build features from database to UI, working on both client and server-side code.

**About the Role:**
As a Full Stack Developer, you'll have the opportunity to work on diverse projects, from building user interfaces to designing APIs and optimizing database queries. You'll be involved in the entire development lifecycle and have a significant impact on our product.

**Responsibilities:**
- Develop end-to-end features across frontend and backend
- Build responsive user interfaces and robust APIs
- Design and optimize database schemas
- Write clean, maintainable code with comprehensive tests
- Collaborate with cross-functional teams
- Contribute to technical decisions and architecture`,
      responsibilities: [
        'Develop end-to-end features from database to user interface',
        'Build responsive web applications using React and Node.js',
        'Design and implement RESTful APIs and database schemas',
        'Write clean, maintainable code with comprehensive tests',
        'Optimize application performance and user experience',
        'Collaborate with designers, product managers, and other engineers',
        'Participate in code reviews and technical discussions',
        'Troubleshoot and resolve issues across the stack',
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        '3+ years of full-stack development experience',
        'Proficiency in JavaScript/TypeScript, React, and Node.js',
        'Experience with database systems (PostgreSQL, MongoDB)',
        'Knowledge of modern web technologies and best practices',
        'Strong problem-solving and debugging skills',
        'Ability to work independently and as part of a team',
        'Excellent communication skills',
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Express', 'Git', 'REST APIs'],
      salaryMin: '85000',
      salaryMax: '130000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Paid Time Off', 'Flexible Hours', 'Remote Work'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data',
    description: 'Data scientist focused on machine learning and analytics',
    isPreBuilt: true,
    data: {
      title: 'Data Scientist',
      employmentType: 'full-time',
      location: 'Remote',
      remoteType: 'remote',
      seniorityLevel: 'senior',
      description: `We're seeking a Data Scientist to join our data team. You'll work on building machine learning models, analyzing large datasets, and providing insights that drive business decisions.

**About the Role:**
As a Data Scientist, you'll work with large-scale data, build predictive models, and communicate insights to stakeholders. You'll have access to cutting-edge tools and technologies and work on challenging problems.

**What You'll Do:**
- Analyze large datasets to extract meaningful insights
- Build and deploy machine learning models
- Design experiments and A/B tests
- Create data visualizations and reports
- Collaborate with engineering and product teams
- Present findings to technical and non-technical audiences`,
      responsibilities: [
        'Analyze large datasets to identify trends and patterns',
        'Build and deploy machine learning models for production use',
        'Design and implement A/B tests and experiments',
        'Create data visualizations and dashboards',
        'Develop predictive models and forecasting systems',
        'Collaborate with engineering teams to deploy models',
        'Present insights and recommendations to stakeholders',
        'Stay current with machine learning research and best practices',
      ],
      requirements: [
        "Master's degree in Data Science, Statistics, Computer Science, or related field",
        '3+ years of data science experience',
        'Strong proficiency in Python and SQL',
        'Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)',
        'Knowledge of statistical analysis and experimental design',
        'Experience with data visualization tools (Tableau, Power BI)',
        'Strong analytical and problem-solving skills',
        'Excellent communication and presentation abilities',
      ],
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'],
      salaryMin: '100000',
      salaryMax: '150000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan', 'Paid Time Off', 'Remote Work', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product',
    description: 'Product manager focused on product strategy and roadmap',
    isPreBuilt: true,
    data: {
      title: 'Product Manager',
      employmentType: 'full-time',
      location: 'San Francisco, CA',
      remoteType: 'hybrid',
      seniorityLevel: 'senior',
      description: `We're looking for an experienced Product Manager to lead product strategy and execution. You'll work closely with engineering, design, and business teams to build products that users love.

**About the Role:**
As a Product Manager, you'll be responsible for defining product vision, prioritizing features, and working with cross-functional teams to deliver value to users. You'll have significant impact on product direction and company success.

**Key Responsibilities:**
- Define product vision, strategy, and roadmap
- Gather and analyze user feedback and market research
- Prioritize features and manage product backlog
- Work with engineering and design teams to ship features
- Define success metrics and track product performance
- Communicate product plans to stakeholders`,
      responsibilities: [
        'Define product vision, strategy, and long-term roadmap',
        'Gather and analyze user feedback, market research, and competitive intelligence',
        'Prioritize features and manage product backlog',
        'Work closely with engineering and design teams to ship features',
        'Define success metrics and track product performance',
        'Create product requirements documents and user stories',
        'Conduct user interviews and usability testing',
        'Communicate product plans and progress to stakeholders',
      ],
      requirements: [
        "Bachelor's degree in Business, Engineering, or related field (MBA preferred)",
        '5+ years of product management experience',
        'Experience with agile development methodologies',
        'Strong analytical and data-driven decision-making skills',
        'Excellent communication and presentation abilities',
        'Experience with product analytics tools',
        'Ability to work effectively with cross-functional teams',
        'Strong user empathy and product intuition',
      ],
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping', 'Stakeholder Management'],
      salaryMin: '110000',
      salaryMax: '160000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Retirement Plan', 'Paid Time Off', 'Stock Options'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: true,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    category: 'Design',
    description: 'UI/UX designer focused on user experience and interface design',
    isPreBuilt: true,
    data: {
      title: 'UI/UX Designer',
      employmentType: 'full-time',
      location: 'Remote',
      remoteType: 'remote',
      seniorityLevel: 'mid',
      description: `We're seeking a talented UI/UX Designer to create beautiful, intuitive user experiences. You'll work on designing interfaces for web and mobile applications, conducting user research, and collaborating with product and engineering teams.

**About the Role:**
As a UI/UX Designer, you'll be responsible for the entire design process, from user research and wireframing to high-fidelity designs and prototyping. You'll have the opportunity to shape user experiences and make a real impact.

**What You'll Do:**
- Conduct user research and create user personas
- Design wireframes, mockups, and prototypes
- Create design systems and component libraries
- Collaborate with product managers and engineers
- Conduct usability testing and iterate on designs
- Ensure designs are accessible and user-friendly`,
      responsibilities: [
        'Conduct user research, interviews, and usability testing',
        'Create wireframes, user flows, and prototypes',
        'Design high-fidelity mockups and interactive prototypes',
        'Develop and maintain design systems and component libraries',
        'Collaborate with product managers and engineers throughout the design process',
        'Ensure designs are accessible and meet usability standards',
        'Iterate on designs based on user feedback and data',
        'Present design concepts and rationale to stakeholders',
      ],
      requirements: [
        "Bachelor's degree in Design, HCI, or related field",
        '3+ years of UI/UX design experience',
        'Proficiency in design tools (Figma, Sketch, Adobe XD)',
        'Strong portfolio demonstrating UI/UX design skills',
        'Understanding of user-centered design principles',
        'Experience with prototyping tools',
        'Knowledge of accessibility standards and best practices',
        'Excellent visual design and typography skills',
      ],
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'UI Design', 'UX Design'],
      salaryMin: '70000',
      salaryMax: '110000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Paid Time Off', 'Flexible Hours', 'Remote Work', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: true,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'marketing-manager',
    name: 'Marketing Manager',
    category: 'Marketing',
    description: 'Marketing manager focused on digital marketing and growth',
    isPreBuilt: true,
    data: {
      title: 'Marketing Manager',
      employmentType: 'full-time',
      location: 'New York, NY',
      remoteType: 'hybrid',
      seniorityLevel: 'mid',
      description: `We're looking for a Marketing Manager to lead our marketing efforts and drive growth. You'll be responsible for developing and executing marketing campaigns, managing budgets, and analyzing performance.

**About the Role:**
As a Marketing Manager, you'll work on a variety of marketing initiatives including digital campaigns, content marketing, SEO, and brand management. You'll have the opportunity to make a significant impact on company growth.

**Key Responsibilities:**
- Develop and execute marketing strategies and campaigns
- Manage marketing budget and track ROI
- Create and distribute marketing content
- Analyze campaign performance and optimize strategies
- Collaborate with sales and product teams
- Manage social media and digital marketing channels`,
      responsibilities: [
        'Develop and execute comprehensive marketing strategies',
        'Plan and manage marketing campaigns across multiple channels',
        'Create and distribute marketing content (blog posts, social media, email)',
        'Manage marketing budget and track ROI for all campaigns',
        'Analyze marketing metrics and optimize strategies based on data',
        'Collaborate with sales team to generate leads and support conversions',
        'Manage social media accounts and digital marketing channels',
        'Conduct market research and competitive analysis',
      ],
      requirements: [
        "Bachelor's degree in Marketing, Business, or related field",
        '5+ years of marketing experience',
        'Experience with digital marketing channels (SEO, SEM, social media)',
        'Strong analytical skills and data-driven mindset',
        'Experience with marketing analytics tools (Google Analytics, etc.)',
        'Excellent written and verbal communication skills',
        'Creative thinking and problem-solving abilities',
        'Ability to manage multiple projects and deadlines',
      ],
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing', 'Google Analytics'],
      salaryMin: '65000',
      salaryMax: '100000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Dental Insurance', 'Paid Time Off', 'Flexible Hours', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: true,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
  {
    id: 'sales-representative',
    name: 'Sales Representative',
    category: 'Sales',
    description: 'Sales representative focused on B2B sales and customer relationships',
    isPreBuilt: true,
    data: {
      title: 'Sales Representative',
      employmentType: 'full-time',
      location: 'Chicago, IL',
      remoteType: 'onsite',
      seniorityLevel: 'entry',
      description: `We're seeking a Sales Representative to join our sales team. You'll be responsible for prospecting, qualifying leads, and closing deals with new customers.

**About the Role:**
As a Sales Representative, you'll work with potential customers to understand their needs, present our solutions, and close deals. You'll have the opportunity to grow your sales career and earn competitive commissions.

**What You'll Do:**
- Prospect and qualify new leads
- Conduct sales calls and product demonstrations
- Build relationships with potential customers
- Negotiate contracts and close deals
- Meet and exceed sales targets
- Collaborate with marketing and product teams`,
      responsibilities: [
        'Prospect and qualify new sales leads',
        'Conduct sales calls, demos, and presentations',
        'Build and maintain relationships with potential customers',
        'Negotiate contracts and pricing',
        'Close deals and meet sales targets',
        'Maintain accurate records in CRM system',
        'Collaborate with marketing team on lead generation',
        'Stay updated on product features and industry trends',
      ],
      requirements: [
        "Bachelor's degree in Business, Marketing, or related field",
        '1+ years of sales experience (entry-level position)',
        'Strong communication and interpersonal skills',
        'Ability to build rapport and relationships',
        'Goal-oriented and self-motivated',
        'Experience with CRM systems (Salesforce, HubSpot)',
        'Excellent negotiation and closing skills',
        'Willingness to learn and adapt',
      ],
      skills: ['Sales', 'CRM', 'Communication', 'Negotiation', 'Relationship Building', 'Presentation Skills'],
      salaryMin: '40000',
      salaryMax: '60000',
      currency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health Insurance', 'Paid Time Off', 'Commission', 'Professional Development'],
      applicationMethod: 'easy-apply',
      requireCoverLetter: false,
      requirePortfolio: false,
      customQuestions: [],
      status: 'draft',
    },
  },
];

// Load saved templates from localStorage
export function loadSavedTemplates(): JobTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('employer_job_templates');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved templates:', e);
  }
  return [];
}

// Save template to localStorage
export function saveTemplate(template: JobTemplate): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = loadSavedTemplates();
    const updated = [...saved, template];
    localStorage.setItem('employer_job_templates', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving template:', e);
  }
}

// Delete template from localStorage
export function deleteTemplate(templateId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = loadSavedTemplates();
    const filtered = saved.filter(t => t.id !== templateId);
    localStorage.setItem('employer_job_templates', JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting template:', e);
  }
}

