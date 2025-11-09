import { z } from 'zod';

const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
  .optional();

const urlSchema = z.string().url('Invalid URL format').optional();

const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only');

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be at most 100 characters'),
  slug: slugSchema,
  description: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
  logo: urlSchema,
  banner: urlSchema,
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  backgroundColor: hexColorSchema,
  textColor: hexColorSchema,
  cultureVideoUrl: urlSchema,
  published: z.boolean().optional().default(false),
  metaTitle: z.string().max(60, 'Meta title should be at most 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be at most 160 characters').optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  logo: urlSchema,
  banner: urlSchema,
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  backgroundColor: hexColorSchema,
  textColor: hexColorSchema,
  cultureVideoUrl: urlSchema,
  published: z.boolean().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;