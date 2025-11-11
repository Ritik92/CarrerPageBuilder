'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '@/components/careers/sections/HeroSection';

interface Job {
  id: string;
  title: string;
  location: string;
  workPolicy: string;
  jobType: string;
  department: string | null;
  experienceLevel: string | null;
}

interface ContentSection {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string | null;
  data?: any;
}

interface Company {
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  primaryColor: string;
  secondaryColor: string;
  cultureVideoUrl: string | null;
  jobs: Job[];
  contentSections: ContentSection[];
}

export default function PreviewPageClient({ company }: { company: Company }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const heroSection = company.contentSections.find((s) => s.type === 'hero');
  const otherSections = company.contentSections.filter((s) => s.type !== 'hero');

  const departments = useMemo(() => {
    const unique = new Set(
      company.jobs.map((j) => j.department).filter((d): d is string => d !== null)
    );
    return ['all', ...Array.from(unique)];
  }, [company.jobs]);

  const locations = useMemo(() => {
    const unique = new Set(company.jobs.map((j) => j.location));
    return ['all', ...Array.from(unique)];
  }, [company.jobs]);

  const jobTypes = useMemo(() => {
    const unique = new Set(company.jobs.map((j) => j.jobType));
    return ['all', ...Array.from(unique)];
  }, [company.jobs]);

  const filteredJobs = useMemo(() => {
    return company.jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
      const matchesJobType = jobTypeFilter === 'all' || job.jobType === jobTypeFilter;
      const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
      return matchesSearch && matchesLocation && matchesJobType && matchesDepartment;
    });
  }, [company.jobs, search, locationFilter, jobTypeFilter, departmentFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-black">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <span className="font-medium">Preview Mode - Changes are not published yet</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/${company.slug}/edit`)}>
            Back to Edit
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      {heroSection && (
        <HeroSection
          data={heroSection.data || {}}
          logo={company.logo}
          companyName={company.name}
        />
      )}

      {/* Fallback Hero */}
      {!heroSection && (
        <>
          {company.banner && (
            <div
              className="h-64 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${company.banner})` }}
            />
          )}
          <div className="border-b">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center gap-4">
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold" style={{ color: company.primaryColor }}>
                    {company.name}
                  </h1>
                  {company.description && (
                    <p className="mt-2 text-muted-foreground">{company.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        {otherSections.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={section.id} className="mb-32 last:mb-20">
              <div className={`grid lg:grid-cols-2 gap-20 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                {/* Text Content */}
                <div className={!isEven ? 'lg:col-start-2' : ''}>
                  <h2 
                    className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight" 
                    style={{ color: company.primaryColor }}
                  >
                    {section.title}
                  </h2>
                  <div 
                    className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 [&>p]:text-lg [&>p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }} 
                  />
                </div>
                
                {/* Image */}
                {section.imageUrl && (
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <img 
                      src={section.imageUrl} 
                      alt={section.title} 
                      className="rounded-3xl w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Culture Video */}
        {company.cultureVideoUrl && (
          <section className="mb-32">
            <h2 
              className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight text-center" 
              style={{ color: company.primaryColor }}
            >
              This is {company.name}
            </h2>
            <div className="aspect-video max-w-5xl mx-auto">
              <iframe
                src={`${company.cultureVideoUrl}${company.cultureVideoUrl.includes('?') ? '&' : '?'}autoplay=0&muted=1`}
                className="h-full w-full rounded-2xl shadow-lg"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Jobs Section */}
        <section id="jobs" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight" 
              style={{ color: company.primaryColor }}
            >
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our team and make an impact
            </p>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col gap-4 md:flex-row max-w-5xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search positions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-12">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-12">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-12">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jobs List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Link key={job.id} href={`/${company.slug}/careers/${job.id}`}>
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer hover:border-2"
                  style={{ '--hover-border-color': company.secondaryColor } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = company.secondaryColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <CardHeader className="pb-4">
                    <CardTitle 
                      className="text-xl font-semibold leading-tight transition-colors" 
                      onMouseEnter={(e) => e.currentTarget.style.color = company.primaryColor} 
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span>{job.workPolicy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3">
                      {job.department && (
                        <Badge
                          className="font-medium"
                          style={{ backgroundColor: company.primaryColor, color: 'white' }}
                        >
                          {job.department}
                        </Badge>
                      )}
                      {job.experienceLevel && (
                        <Badge variant="outline" className="font-medium">
                          {job.experienceLevel}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No positions found matching your criteria.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}