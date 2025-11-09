'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Clock } from 'lucide-react';
import Link from 'next/link';
interface Job {
  id: string;
  title: string;
  location: string;
  workPolicy: string;
  jobType: string;
  department: string|null ;
  experienceLevel: string | null;
}

interface ContentSection {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string | null;
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

export default function CareersPageClient({ company }: { company: Company }) {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = useMemo(() => {
  const unique = new Set(
    company.jobs
      .map((j) => j.department)
      .filter((d): d is string => d !== null)
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
      {/* Banner */}
      {company.banner && (
        <div
          className="h-64 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${company.banner})` }}
        />
      )}

      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            {company.logo && (
              <img src={company.logo} alt={company.name} className="h-16 w-16 rounded-lg object-cover" />
            )}
            <div>
              <h1 className="text-4xl font-bold" style={{ color: company.primaryColor }}>
                {company.name}
              </h1>
              {company.description && <p className="mt-2 text-muted-foreground">{company.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Content Sections */}
        {company.contentSections.map((section) => (
          <section key={section.id} className="mb-12">
          <h2 className="mb-4 text-3xl font-bold" style={{ color: company.primaryColor }}>
  {section.title}
</h2>
            {section.imageUrl && (
              <img src={section.imageUrl} alt={section.title} className="mb-4 rounded-lg" />
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        ))}

        {/* Culture Video */}
        {company.cultureVideoUrl && (
          <section className="mb-12">
           <h2 className="mb-4 text-3xl font-bold" style={{ color: company.primaryColor }}>
  Life at {company.name}
</h2>
            <div className="aspect-video">
              <iframe
                src={company.cultureVideoUrl}
                className="h-full w-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Jobs Section */}
        <section>
         <h2 className="mb-6 text-3xl font-bold" style={{ color: company.primaryColor }}>
  Open Positions
</h2>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
  <SelectTrigger className="w-full md:w-[200px]">
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
              <SelectTrigger className="w-full md:w-[200px]">
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
              <SelectTrigger className="w-full md:w-[200px]">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
  <Link key={job.id} href={`/${company.slug}/careers/${job.id}`}>
   <Card 
  className="hover:shadow-lg transition-all cursor-pointer hover:border-2" 
  style={{ '--hover-border-color': company.secondaryColor } as React.CSSProperties}
  onMouseEnter={(e) => e.currentTarget.style.borderColor = company.secondaryColor}
  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
>
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          {job.workPolicy}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {job.jobType}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
       {job.department && (
  <Badge variant="secondary" style={{ backgroundColor: company.primaryColor, color: 'white' }}>
    {job.department}
  </Badge>
)}
          {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
        </div>
      </CardContent>
    </Card>
  </Link>
))}
          </div>

          {filteredJobs.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No jobs found matching your criteria.</p>
          )}
        </section>
      </div>
    </div>
  );
}