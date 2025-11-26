"use client";

import { PageSection, SectionContent } from '../types';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { Star, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils';

interface SectionRendererProps {
  section: PageSection;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  isPreview?: boolean;
}

export function SectionRenderer({ section, theme, isPreview = false }: SectionRendererProps) {
  if (!section.visible) return null;

  switch (section.type) {
    case 'hero':
      return <HeroSection content={section.content} theme={theme} />;
    case 'about':
      return <AboutSection content={section.content} />;
    case 'values':
      return <ValuesSection content={section.content} />;
    case 'benefits':
      return <BenefitsSection content={section.content} />;
    case 'team':
      return <TeamSection content={section.content} />;
    case 'testimonials':
      return <TestimonialsSection content={section.content} />;
    case 'jobs':
      return <JobsSection content={section.content} />;
    case 'cta':
      return <CTASection content={section.content} theme={theme} />;
    case 'contact':
      return <ContactSection content={section.content} />;
    default:
      return null;
  }
}

function HeroSection({ content, theme }: { content: SectionContent; theme?: any }) {
  const height = content.height === 'full' ? 'min-h-screen' : `min-h-[${content.customHeight || 600}px]`;
  
  return (
    <div 
      className={cn("relative flex items-center justify-center text-center text-white", height)}
      style={{
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
        backgroundColor: content.backgroundImage ? undefined : theme?.primaryColor || '#3b82f6',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {content.backgroundImage && (
        <div 
          className="absolute inset-0 bg-black/50"
          style={{ opacity: content.overlayOpacity ?? 0.5 }}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {content.logo && (
          <div className="mb-6">
            <Image src={content.logo} alt="Company Logo" width={150} height={60} className="mx-auto" />
          </div>
        )}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{content.headline || 'Join Our Team'}</h1>
        <p className="text-xl md:text-2xl mb-8">{content.subheadline || 'Build the future with us'}</p>
        {content.ctaText && (
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            {content.ctaText}
          </Button>
        )}
      </div>
    </div>
  );
}

function AboutSection({ content }: { content: SectionContent }) {
  return (
    <section className="py-16 px-6">
      <div className={cn(
        "max-w-6xl mx-auto",
        content.layout === 'two-column' ? "grid md:grid-cols-2 gap-12" : ""
      )}>
        <div>
          <h2 className="text-4xl font-bold mb-6">{content.title || 'About Us'}</h2>
          {content.description && (
            <div 
              className="prose prose-lg mb-8"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          )}
          {content.mission && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">{content.mission}</p>
            </div>
          )}
          {content.vision && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">{content.vision}</p>
            </div>
          )}
        </div>
        {content.image && content.layout === 'two-column' && (
          <div>
            <Image src={content.image} alt="About" width={600} height={400} className="rounded-lg" />
          </div>
        )}
        {content.stats && content.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {content.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ValuesSection({ content }: { content: SectionContent }) {
  const columns = content.columns || 3;
  const gridCols = columns === 3 ? 'md:grid-cols-3' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-6';
  
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'Our Values'}</h2>
        {content.values && content.values.length > 0 ? (
          <div className={cn("grid gap-6", gridCols)}>
            {content.values.map((value) => (
              <Card key={value.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {value.icon && (
                    <div className="text-4xl mb-4">{value.icon}</div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No values added yet</p>
        )}
      </div>
    </section>
  );
}

function BenefitsSection({ content }: { content: SectionContent }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'Benefits & Perks'}</h2>
        {content.benefits && content.benefits.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.benefits.map((benefit) => (
              <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {benefit.icon && (
                      <div className="text-2xl">{benefit.icon}</div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{benefit.name}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      {benefit.category && (
                        <Badge variant="outline" className="mt-2">{benefit.category}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No benefits added yet</p>
        )}
      </div>
    </section>
  );
}

function TeamSection({ content }: { content: SectionContent }) {
  const layout = content.layout || 'grid';
  
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'Our Team'}</h2>
        {content.members && content.members.length > 0 ? (
          <div className={cn(
            layout === 'grid' ? "grid md:grid-cols-3 gap-8" : "flex gap-6 overflow-x-auto"
          )}>
            {content.members.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} width={96} height={96} className="rounded-full" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No team members added yet</p>
        )}
      </div>
    </section>
  );
}

function TestimonialsSection({ content }: { content: SectionContent }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'What Our Team Says'}</h2>
        {content.testimonials && content.testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < testimonial.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.photo ? (
                        <Image src={testimonial.photo} alt={testimonial.name} width={40} height={40} className="rounded-full" />
                      ) : (
                        testimonial.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No testimonials added yet</p>
        )}
      </div>
    </section>
  );
}

function JobsSection({ content }: { content: SectionContent }) {
  // This would typically fetch jobs from the API
  const jobs: any[] = []; // Placeholder
  
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'Open Positions'}</h2>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.slice(0, content.jobsToShow || 6).map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No open positions at the moment</p>
        )}
        <div className="text-center mt-8">
          <Button variant="outline">View All Jobs</Button>
        </div>
      </div>
    </section>
  );
}

function CTASection({ content, theme }: { content: SectionContent; theme?: any }) {
  return (
    <section 
      className="py-20 px-6 text-center text-white"
      style={{
        backgroundColor: theme?.primaryColor || '#3b82f6',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">{content.title || 'Ready to Join Us?'}</h2>
        {content.description && (
          <p className="text-xl mb-8 opacity-90">{content.description}</p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          {content.buttons && content.buttons.length > 0 ? (
            content.buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant === 'secondary' ? 'secondary' : button.variant === 'outline' ? 'outline' : 'default'}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                {button.text}
              </Button>
            ))
          ) : content.ctaText && (
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              {content.ctaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ content }: { content: SectionContent }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title || 'Contact Us'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {content.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">{content.address}</p>
                </div>
              </div>
            )}
            {content.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href={`mailto:${content.email}`} className="text-primary hover:underline">
                    {content.email}
                  </a>
                </div>
              </div>
            )}
            {content.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href={`tel:${content.phone}`} className="text-primary hover:underline">
                    {content.phone}
                  </a>
                </div>
              </div>
            )}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Follow Us</h3>
                  <div className="flex gap-2 mt-2">
                    {content.socialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {content.showForm && (
            <div>
              <h3 className="font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
                <textarea
                  placeholder="Message"
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
                <Button type="submit">Send Message</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

