import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';
import { loginSchema } from '../schemas/login.schema';
import type { LoginValues } from '../types/login.types';
import { signIn } from '../services/auth.mock';
import { useSession } from '~/shared/composables/useSession';

export interface UseLoginFormOptions {
  onSuccess?: (values: LoginValues) => void | Promise<void>;
}

export function useLoginForm(options: UseLoginFormOptions = {}) {
  const { startSession } = useSession();
  const serviceError = shallowRef('');

  const form = useForm<LoginValues>({
    validationSchema: loginSchema,
    initialValues: { email: '', password: '' },
  });

  const [email, emailAttrs] = form.defineField('email');
  const [password, passwordAttrs] = form.defineField('password');

  async function submitValidLogin(values: LoginValues) {
    serviceError.value = '';
    try {
      const result = await signIn(values);
      if (!result.success) {
        serviceError.value = result.data.message;
        return;
      }

      startSession(values.email);

      if (options.onSuccess) {
        await options.onSuccess(values);
      } else {
        await navigateTo('/registro');
      }
    } catch {
      serviceError.value = 'No pudimos iniciar sesión. Intenta nuevamente.';
    }
  }

  const onSubmit = form.handleSubmit(submitValidLogin);

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    serviceError,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    onSubmit,
  };
}
