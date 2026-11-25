import { z } from 'zod';

export const sessionSchema = z.object({
  authenticated: z.boolean(),
  email: z.string(),
  displayName: z.string(),
  profileCompleted: z.boolean(),
  fullName: z.string(),
});

export type DemoSession = z.infer<typeof sessionSchema>;

export const DEFAULT_SESSION: DemoSession = {
  authenticated: false,
  email: '',
  displayName: 'MARIA',
  profileCompleted: false,
  fullName: '',
};
