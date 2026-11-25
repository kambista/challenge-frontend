import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'vee-validate';
import { loginSchema } from '~/modules/auth/schemas/login.schema';

function createLoginForm() {
  return useForm({
    validationSchema: loginSchema,
    initialValues: { email: '', password: '' },
  });
}

function mountLoginForm() {
  let form!: ReturnType<typeof createLoginForm>;
  const wrapper = mount(
    defineComponent({
      setup() {
        form = createLoginForm();
        return () => null;
      },
    }),
  );

  return { form, wrapper };
}

describe('Integración de VeeValidate v5 con Zod', () => {
  it('bloquea el envío de datos inválidos y expone los errores en español', async () => {
    const { form, wrapper } = mountLoginForm();
    const submit = vi.fn();

    try {
      form.setValues({ email: 'correo-invalido', password: '' });
      await form.handleSubmit(submit)();

      expect(submit).not.toHaveBeenCalled();
      expect(form.errors.value).toEqual({
        email: 'Ingresa un correo electrónico válido',
        password: 'Ingresa tu contraseña',
      });
    } finally {
      wrapper.unmount();
    }
  });

  it('envía los valores transformados por Zod cuando son válidos', async () => {
    const { form, wrapper } = mountLoginForm();
    const submit = vi.fn();

    try {
      form.setValues({ email: ' usuario@example.com ', password: 'secreto' });
      await form.handleSubmit(submit)();

      expect(submit).toHaveBeenCalledOnce();
      expect(submit.mock.calls[0]?.[0]).toEqual({
        email: 'usuario@example.com',
        password: 'secreto',
      });
      expect(form.errors.value).toEqual({});
      expect(form.isSubmitting.value).toBe(false);
    } finally {
      wrapper.unmount();
    }
  });
});
