'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Clock, Eye } from 'lucide-react';

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
      return matchesSearch && matchesLocation && matchesJobType;
    });
  }, [company.jobs, search, locationFilter, jobTypeFilter]);

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
            <h2 className="mb-4 text-3xl font-bold">{section.title}</h2>
            {section.imageUrl && (
              <img src={section.imageUrl} alt={section.title} className="mb-4 rounded-lg" />
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        ))}

        {/* Culture Video */}
        {company.cultureVideoUrl && (
          <section className="mb-12">
            <h2 className="mb-4 text-3xl font-bold">Life at {company.name}</h2>
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
          <h2 className="mb-6 text-3xl font-bold">Open Positions</h2>

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
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                    {job.department && <Badge variant="secondary">{job.department}</Badge>}
                    {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                  </div>
                </CardContent>
              </Card>
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