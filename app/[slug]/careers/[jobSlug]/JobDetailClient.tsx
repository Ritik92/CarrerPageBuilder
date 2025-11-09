'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Building2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  workPolicy: string;
  jobType: string;
  contractType: string;
  department: string | null;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  company: {
    name: string;
    slug: string;
    logo: string | null;
    primaryColor: string;
  };
}

export default function JobDetailClient({ job }: { job: Job }) {
  const router = useRouter();

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const min = job.salaryMin?.toLocaleString();
    const max = job.salaryMax?.toLocaleString();
    const period = job.salaryPeriod === 'month' ? '/month' : '/year';
    return `${job.salaryCurrency} ${min}${max ? ` - ${max}` : ''}${period}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {job.company.logo && (
                <img src={job.company.logo} alt={job.company.name} className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div>
                <h1 className="text-3xl font-bold" style={{ color: job.company.primaryColor }}>
                  {job.title}
                </h1>
                <p className="text-xl text-muted-foreground">{job.company.name}</p>
              </div>
            </div>
            <Button size="lg">Apply Now</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{job.description}</p>
              </CardContent>
            </Card>

            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                </CardContent>
              </Card>
            )}

            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </CardContent>
              </Card>
            )}

            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.benefits}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Work Policy</p>
                    <p className="font-medium">{job.workPolicy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.jobType} • {job.contractType}</p>
                  </div>
                </div>

                {job.department && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{job.department}</p>
                    </div>
                  </div>
                )}

                {formatSalary() && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{formatSalary()}</p>
                    </div>
                  </div>
                )}

                {job.experienceLevel && (
                  <div className="pt-4">
                    <Badge variant="secondary">{job.experienceLevel}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button size="lg" className="w-full">Apply for this Position</Button>
          </div>
        </div>
      </div>
    </div>
  );
}