import { z } from 'zod';

export const createJobSchema = z.object({
  companyId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  location: z.string().min(1),
  workPolicy: z.enum(['Remote', 'Hybrid', 'On-site']),
  jobType: z.enum(['Full time', 'Part time', 'Contract']),
  contractType: z.enum(['Permanent', 'Temporary', 'Internship']),
  department: z.string().optional(),
  experienceLevel: z.enum(['Junior', 'Mid-level', 'Senior']).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  salaryCurrency: z.string().default('USD'),
  salaryPeriod: z.enum(['month', 'year']).optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  status: z.enum(['open', 'closed', 'draft']).default('open'),
});

export const updateJobSchema = createJobSchema.partial().omit({ companyId: true });

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;