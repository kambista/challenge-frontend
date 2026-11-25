import type { z } from 'zod';
import type { loginSchema } from '../schemas/login.schema';

export type LoginValues = z.infer<typeof loginSchema>;
