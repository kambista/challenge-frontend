import { shallowRef } from 'vue';
import { useForm } from 'vee-validate';
import { profileSchema } from '../schemas/profile.schema';
import type { ProfileValues } from '../types/profile.types';
import type { APIError } from '~/shared/types/api';
import { createProfile } from '../services/profile.mock';
import { useSession } from '~/shared/composables/useSession';

export function useProfileForm() {
  const { completeProfile } = useSession();
  const serviceError = shallowRef<APIError['data'] | null>(null);

  const form = useForm<ProfileValues>({
    validationSchema: profileSchema,
    initialValues: {
      firstName: '',
      documentType: 'DNI',
      documentNumber: '',
      phone: '',
      birthDate: '',
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  async function submitValidProfile(values: ProfileValues) {
    serviceError.value = null;
    try {
      const result = await createProfile(values);
      if (!result.success) {
        form.setFieldError(
          result.data.name === 'DUPLICATE_DNI' ? 'documentNumber' : 'phone',
          result.data.message,
        );
        serviceError.value = result.data;
        return;
      }

      completeProfile(values.firstName);

      await navigateTo('/registro/exito');
    } catch {
      serviceError.value = {
        name: 'SERVER_ERROR',
        title: 'No pudimos guardar tus datos',
        message: 'Intenta nuevamente en unos minutos.',
      };
    }
  }

  const onSubmit = form.handleSubmit(submitValidProfile);

  return {
    defineField: form.defineField,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    serviceError,
    onSubmit,
  };
}
