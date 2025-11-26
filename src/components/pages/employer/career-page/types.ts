export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'values' 
  | 'benefits' 
  | 'team' 
  | 'testimonials' 
  | 'jobs' 
  | 'cta' 
  | 'contact';

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  content: SectionContent;
  visible: boolean;
  settings?: SectionSettings;
}

export interface SectionContent {
  // Hero
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  logo?: string;
  overlayOpacity?: number;
  height?: 'full' | 'custom';
  customHeight?: number;
  
  // About
  title?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  stats?: Array<{ label: string; value: string }>;
  layout?: 'single' | 'two-column' | 'grid' | 'carousel'; // Union of all layout types
  image?: string;
  
  // Values
  values?: Array<{
    id: string;
    icon?: string;
    title: string;
    description: string;
  }>;
  columns?: 3 | 4 | 6;
  
  // Benefits
  benefits?: Array<{
    id: string;
    icon?: string;
    name: string;
    description: string;
    category?: string;
  }>;
  categories?: string[];
  
  // Team
  members?: Array<{
    id: string;
    photo?: string;
    name: string;
    role: string;
    bio?: string;
  }>;
  
  // Testimonials
  testimonials?: Array<{
    id: string;
    photo?: string;
    name: string;
    role: string;
    text: string;
    rating?: number;
  }>;
  
  // Jobs
  showFilters?: boolean;
  jobsToShow?: number;
  sortOrder?: 'date' | 'title' | 'location';
  
  // CTA
  description?: string;
  buttons?: Array<{
    id: string;
    text: string;
    link: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  
  // Contact
  address?: string;
  email?: string;
  phone?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  showForm?: boolean;
}

export interface SectionSettings {
  backgroundColor?: string;
  textColor?: string;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  margin?: {
    top: number;
    bottom: number;
  };
}

export interface CareerPageTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  accentColors: string[];
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
  containerWidth: string;
  sectionSpacing: number;
  borderRadius: number;
}

export interface SEOSettings {
  pageTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
  twitterCardImage?: string;
  customSlug?: string;
  customDomain?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  uploadedAt: string;
}

