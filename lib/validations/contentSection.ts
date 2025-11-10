import { z } from 'zod';

export const createContentSectionSchema = z.object({
  companyId: z.string(),
  type: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  imageUrl: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().url().optional()
  ),
  data: z.any().optional(), // Add this line
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateContentSectionSchema = createContentSectionSchema.partial().omit({ companyId: true });

export const reorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export type CreateContentSectionInput = z.infer<typeof createContentSectionSchema>;
export type UpdateContentSectionInput = z.infer<typeof updateContentSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;