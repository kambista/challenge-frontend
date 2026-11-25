import type { SelectOption } from '~/shared/types/common.types';

export const DOCUMENT_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'CE' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
] as const;
