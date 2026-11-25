import { mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import { useLoginForm } from '~/modules/auth/composables/useLoginForm';
import { signIn } from '~/modules/auth/services/auth.mock';

const { startSession } = vi.hoisted(() => ({ startSession: vi.fn() }));
vi.mock('~/shared/composables/useSession', () => ({ useSession: () => ({ startSession }) }));
vi.mock('~/modules/auth/services/auth.mock', () => ({ signIn: vi.fn() }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

it('conserva los campos ante un error inesperado y permite reintentar', async () => {
  const navigate = vi.fn();
  vi.stubGlobal('navigateTo', navigate);
  vi.mocked(signIn)
    .mockRejectedValueOnce(new Error('Sin conexión'))
    .mockResolvedValueOnce({ success: true });
  let form!: ReturnType<typeof useLoginForm>;
  const view = mount({
    setup() {
      form = useLoginForm();
      return () => null;
    },
  });
  try {
    form.email.value = 'demo@kambista.com';
    form.password.value = 'Demo1234!';
    await form.onSubmit();
    expect(form.serviceError.value).toContain('No pudimos iniciar sesión');
    expect(form.password.value).toBe('Demo1234!');
    expect(navigate).not.toHaveBeenCalled();
    await form.onSubmit();
    expect(form.serviceError.value).toBe('');
    expect(startSession).toHaveBeenCalledWith('demo@kambista.com');
    expect(navigate).toHaveBeenCalledWith('/registro');
  } finally {
    view.unmount();
  }
});
