'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MapPin, Briefcase, Clock, Plus, Edit, Trash2 } from 'lucide-react';

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
  status: string;
}

const defaultFormData = {
  title: '',
  description: '',
  location: '',
  workPolicy: 'Remote',
  jobType: 'Full time',
  contractType: 'Permanent',
  department: '',
  experienceLevel: 'Mid-level',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  salaryPeriod: 'year',
  requirements: '',
  responsibilities: '',
  benefits: '',
  status: 'open',
};

export default function JobsTab({ company }: { company: any }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        workPolicy: job.workPolicy,
        jobType: job.jobType,
        contractType: job.contractType,
        department: job.department || '',
        experienceLevel: job.experienceLevel || 'Mid-level',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        salaryCurrency: job.salaryCurrency,
        salaryPeriod: job.salaryPeriod || 'year',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        benefits: job.benefits || '',
        status: job.status,
      });
    } else {
      setEditingJob(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        department: formData.department || null,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
        benefits: formData.benefits || null,
      };

      const url = editingJob
        ? `/api/jobs/${editingJob.id}`
        : `/api/companies/${company.id}/jobs`;
      const method = editingJob ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(editingJob ? 'Job updated!' : 'Job created!');
      setDialogOpen(false);
      setFormData(defaultFormData);
      setEditingJob(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('Job deleted!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Jobs ({company.jobs.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Berlin, Germany"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Work Policy *</Label>
                  <Select value={formData.workPolicy} onValueChange={(v) => setFormData({ ...formData, workPolicy: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Job Type *</Label>
                  <Select value={formData.jobType} onValueChange={(v) => setFormData({ ...formData, jobType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full time">Full time</SelectItem>
                      <SelectItem value="Part time">Part time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contract Type *</Label>
                  <Select value={formData.contractType} onValueChange={(v) => setFormData({ ...formData, contractType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Department</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Engineering"
                  />
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label>Min Salary</Label>
                  <Input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Max Salary</Label>
                  <Input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={formData.salaryCurrency} onValueChange={(v) => setFormData({ ...formData, salaryCurrency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="SAR">SAR</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period</Label>
                  <Select value={formData.salaryPeriod} onValueChange={(v) => setFormData({ ...formData, salaryPeriod: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Job Description *</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the role..."
                />
              </div>

              <div>
                <Label>Requirements</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  placeholder="List key requirements..."
                />
              </div>

              <div>
                <Label>Responsibilities</Label>
                <Textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={3}
                  placeholder="Key responsibilities..."
                />
              </div>

              <div>
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  placeholder="Benefits and perks..."
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {company.jobs.map((job: any) => (
          <Card key={job.id}>
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
              <div className="flex items-center justify-between pt-2">
                <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>{job.status}</Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {company.jobs.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No jobs yet. Add one to get started!</p>
      )}
    </div>
  );
}