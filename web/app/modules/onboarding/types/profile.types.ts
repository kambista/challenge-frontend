import type { z } from 'zod';
import type { profileSchema } from '../schemas/profile.schema';

export type DocumentType = 'DNI' | 'CE' | 'PASAPORTE';
export type LegalType = 'terms' | 'privacy';

export type ProfileValues = z.infer<typeof profileSchema>;
