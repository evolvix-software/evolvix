import { CourseVacancy, CourseApplication } from './coursesData';

// Mock Vacancies Data
export const mockVacancies: CourseVacancy[] = [
  {
    id: 'vacancy_1',
    title: 'Full Stack Web Development Master Course',
    category: 'development',
    description: 'Comprehensive master course covering frontend, backend, databases, DevOps, and deployment. Students will build real-world projects and gain industry-ready skills.',
    requirements: [
      'Minimum 5 years of web development experience',
      'Strong portfolio demonstrating full-stack projects',
      'Experience with React, Node.js, and databases',
      'Excellent communication and teaching skills',
      'Ability to create engaging course content'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 5000,
    commissionSplit: {
      evolvix: 30,
      mentor: 70
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
    level: 'intermediate'
  },
  {
    id: 'vacancy_2',
    title: 'UI/UX Design Master Program',
    category: 'design',
    description: 'Complete design masterclass covering user research, wireframing, prototyping, visual design, and design systems. Includes portfolio development and industry best practices.',
    requirements: [
      'Minimum 4 years of UI/UX design experience',
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Strong portfolio with case studies',
      'Understanding of user research methodologies',
      'Experience mentoring designers'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 4500,
    commissionSplit: {
      evolvix: 30,
      mentor: 70
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'User Testing'],
    level: 'intermediate'
  },
  {
    id: 'vacancy_3',
    title: 'Cybersecurity Master Course',
    category: 'cybersecurity',
    description: 'Comprehensive cybersecurity program covering ethical hacking, network security, penetration testing, security auditing, and compliance. Includes hands-on labs and certifications.',
    requirements: [
      'Certified cybersecurity professional (CEH, CISSP, or equivalent)',
      'Minimum 6 years of cybersecurity experience',
      'Experience with penetration testing tools',
      'Knowledge of compliance frameworks (ISO 27001, NIST)',
      'Strong technical and teaching background'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 6000,
    commissionSplit: {
      evolvix: 35,
      mentor: 65
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Penetration Testing', 'Network Security', 'Ethical Hacking', 'Security Auditing', 'Compliance'],
    level: 'advanced'
  },
  {
    id: 'vacancy_4',
    title: 'Mobile App Development Master Course',
    category: 'app-development',
    description: 'Complete mobile app development program covering iOS, Android, React Native, Flutter, app design, backend integration, and app store deployment.',
    requirements: [
      'Minimum 5 years of mobile app development',
      'Experience with both iOS and Android',
      'Proficiency in React Native or Flutter',
      'Published apps on App Store/Play Store',
      'Strong portfolio of mobile applications'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 4800,
    commissionSplit: {
      evolvix: 30,
      mentor: 70
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'App Design', 'Backend Integration'],
    level: 'intermediate'
  },
  {
    id: 'vacancy_5',
    title: 'Game Development Master Program',
    category: 'gaming',
    description: 'Comprehensive game development course covering Unity, Unreal Engine, game design, 3D modeling, animation, game mechanics, and publishing.',
    requirements: [
      'Minimum 4 years of game development experience',
      'Proficiency in Unity or Unreal Engine',
      'Published games or strong portfolio',
      'Understanding of game design principles',
      'Experience with 3D modeling and animation'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 5500,
    commissionSplit: {
      evolvix: 30,
      mentor: 70
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Unity', 'Unreal Engine', 'C#', 'Game Design', '3D Modeling', 'Animation'],
    level: 'intermediate'
  },
  {
    id: 'vacancy_6',
    title: 'Jewelry Design Master Course',
    category: 'jewelry-design',
    description: 'Complete jewelry design program covering traditional and modern techniques, CAD design, gemology, manufacturing processes, and business aspects of jewelry design.',
    requirements: [
      'Minimum 5 years of jewelry design experience',
      'Proficiency in CAD software (Rhino, Matrix, etc.)',
      'Strong portfolio of jewelry designs',
      'Knowledge of gemology and materials',
      'Experience in jewelry manufacturing'
    ],
    courseCategory: 'bundle',
    duration: '',
    adminPricing: 4000,
    commissionSplit: {
      evolvix: 30,
      mentor: 70
    },
    status: 'open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['CAD Design', 'Gemology', 'Manufacturing', 'Design Principles', 'Business'],
    level: 'intermediate'
  }
];

// Mock Applications Data
export const mockApplications: CourseApplication[] = [
  {
    id: 'app_1',
    vacancyId: 'vacancy_1',
    mentorId: 'mentor_1',
    mentorName: 'John Doe',
    mentorEmail: 'john@example.com',
    coverLetter: 'I have 8 years of experience in full-stack development and have taught over 500 students. I believe I can create an excellent master course.',
    portfolio: 'https://portfolio.example.com/johndoe',
    experience: '8 years full-stack development, 3 years teaching experience',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

