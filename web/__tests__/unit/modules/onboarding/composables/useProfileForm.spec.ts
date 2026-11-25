import { mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import { useProfileForm } from '~/modules/onboarding/composables/useProfileForm';
import { createProfile } from '~/modules/onboarding/services/profile.mock';

const { completeProfile } = vi.hoisted(() => ({ completeProfile: vi.fn() }));
vi.mock('~/shared/composables/useSession', () => ({ useSession: () => ({ completeProfile }) }));
vi.mock('~/modules/onboarding/services/profile.mock', () => ({ createProfile: vi.fn() }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

it.each(['DUPLICATE_DNI', 'INVALID_PHONE', 'SERVER_ERROR', 'excepción'] as const)(
  'maneja %s y reintenta conservando el perfil',
  async (name) => {
    const navigate = vi.fn();
    vi.stubGlobal('navigateTo', navigate);
    const service = vi.mocked(createProfile);
    if (name === 'excepción') service.mockRejectedValueOnce(new Error('Sin conexión'));
    else
      service.mockResolvedValueOnce({
        success: false,
        data: { name, title: 'Error', message: 'Reintenta' },
      });
    service.mockResolvedValueOnce({ success: true });
    let form!: ReturnType<typeof useProfileForm>;
    const view = mount({
      setup() {
        form = useProfileForm();
        return () => null;
      },
    });
    try {
      const [firstName] = form.defineField('firstName');
      const [documentNumber] = form.defineField('documentNumber');
      const [phone] = form.defineField('phone');
      const [birthDate] = form.defineField('birthDate');
      const [terms] = form.defineField('acceptTerms');
      firstName.value = 'Ana Lucía';
      documentNumber.value = '00012345';
      phone.value = '901234567';
      birthDate.value = '1990-01-01';
      terms.value = true;
      await form.onSubmit();
      expect(form.serviceError.value?.name).toBe(name === 'excepción' ? 'SERVER_ERROR' : name);
      expect(navigate).not.toHaveBeenCalled();
      expect(documentNumber.value).toBe('00012345');
      // A field edit triggers validation again before the retry.
      documentNumber.value = '00012346';
      phone.value = '901234568';
      await form.onSubmit();
      expect(completeProfile).toHaveBeenCalledWith('Ana Lucía');
      expect(navigate).toHaveBeenCalledWith('/registro/exito');
    } finally {
      view.unmount();
    }
  },
);
