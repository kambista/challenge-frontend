import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import { ref } from 'vue';
import LoginView from '~/modules/auth/components/LoginView.vue';

const { submit } = vi.hoisted(() => ({ submit: vi.fn((event: Event) => event.preventDefault()) }));
vi.mock('~/modules/auth/composables/useLoginForm', () => ({
  useLoginForm: () => ({
    email: ref(''),
    password: ref(''),
    emailAttrs: {},
    passwordAttrs: {},
    errors: ref({}),
    isSubmitting: ref(false),
    serviceError: ref(''),
    onSubmit: submit,
  }),
}));
it('el botón de inicio envía el formulario', async () => {
  const view = mount(LoginView);
  try {
    const button = view.findAll('button').find((item) => /INICIA(?:R)? SESIÓN/.test(item.text()))!;
    expect(button.attributes('type')).toBe('submit');
    await view.get('form').trigger('submit');
    expect(submit).toHaveBeenCalledTimes(1);
  } finally {
    view.unmount();
  }
});
