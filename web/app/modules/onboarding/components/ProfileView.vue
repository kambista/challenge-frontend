<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import FlowHeader from '~/shared/components/FlowHeader.vue';
import UiField from '~/shared/components/UiField.vue';
import UiDatePicker from '~/shared/components/UiDatePicker.vue';
import UiSelect from '~/shared/components/UiSelect.vue';
import UiButton from '~/shared/components/UiButton.vue';
import UiNotice from '~/shared/components/UiNotice.vue';
import UiCheckbox from '~/shared/components/UiCheckbox.vue';
import UiDialog from '~/shared/components/UiDialog.vue';
import UiToast from '~/shared/components/UiToast.vue';
import WhatsappBadge from '~/shared/components/WhatsappBadge.vue';
import { useProfileForm } from '../composables/useProfileForm';
import type { LegalType } from '../types/profile.types';
import { LEGAL_CONTENT } from '../constants/legal';
import { DOCUMENT_TYPE_OPTIONS } from '../constants/documents';

const { defineField, errors, isSubmitting, onSubmit, serviceError } = useProfileForm();

const [firstName, firstNameAttrs] = defineField('firstName');
const [documentType, documentTypeAttrs] = defineField('documentType');
const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
const [phone, phoneAttrs] = defineField('phone');
const [birthDate, birthDateAttrs] = defineField('birthDate');
const [acceptTerms] = defineField('acceptTerms');
const [acceptPrivacy] = defineField('acceptPrivacy');
const errorToastOpen = shallowRef(false);

function syncErrorToast(value: typeof serviceError.value) {
  errorToastOpen.value = !!value;
}

watch(serviceError, syncErrorToast);

const legal = shallowRef<LegalType>('terms');
const legalOpen = shallowRef(false);

function openLegal(value: LegalType) {
  legal.value = value;
  legalOpen.value = true;
}

</script>

<template>
  <div class="bg-gray-20 md:bg-gray-10 min-h-dvh">
    <FlowHeader logout />
    <main class="px-6 pt-1.25 pb-12 md:py-19.5">
      <section
        class="md:rounded-panel md:border-gray-21 mx-auto max-w-131 md:border md:bg-white md:px-15.75 md:py-9.5"
      >
        <h1 class="mb-7 text-center text-xl font-bold md:mb-8 md:text-2xl">Completa tus datos</h1>
        <form class="space-y-3.5" novalidate @submit="onSubmit">
          <UiField
            v-model="firstName"
            v-bind="firstNameAttrs"
            label="Nombres completos"
            placeholder="Escribe tus nombres y apellidos"
            autocomplete="name"
            :error="errors.firstName"
          />
          <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-2 md:grid-cols-2">
            <UiSelect
              v-model="documentType"
              v-bind="documentTypeAttrs"
              label="Documento"
              :options="DOCUMENT_TYPE_OPTIONS"
              :error="errors.documentType"
            />
            <UiField
              v-model="documentNumber"
              v-bind="documentNumberAttrs"
              label="N° de documento"
              placeholder="N° de documento"
              class="document-number-field"
              :error="errors.documentNumber"
            />
          </div>
          <UiNotice>
            Tu documento de identidad debe coincidir con tus datos para evitar inconvenientes al
            momento de hacer una primera operación
          </UiNotice>
          <div class="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-4">
            <UiField
              v-model="phone"
              v-bind="phoneAttrs"
              label="Celular"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="N° de celular"
              :error="errors.phone"
            />
            <UiDatePicker
              v-model="birthDate"
              v-bind="birthDateAttrs"
              label="Fecha de nacimiento"
              autocomplete="bday"
              :error="errors.birthDate"
            />
          </div>
          <div class="space-y-3 pt-3 pb-5">
            <UiCheckbox v-model="acceptTerms" :error="errors.acceptTerms">
              He leído y acepto los
              <a
                href="#terminos"
                class="font-bold underline"
                @click.stop.prevent="openLegal('terms')"
              >
                Términos y condiciones
              </a>
            </UiCheckbox>
            <UiCheckbox v-model="acceptPrivacy" :error="errors.acceptPrivacy">
              Acepto de manera expresa e informada la
              <a
                href="#politica"
                class="font-bold underline"
                @click.stop.prevent="openLegal('privacy')"
              >
                Política de Tratamiento de datos personales de Kambista
              </a>
            </UiCheckbox>
          </div>
          <UiButton
            type="submit"
            :busy="isSubmitting"
            :disabled="!firstName && !documentNumber && !phone && !birthDate"
          >
            CONTINUAR
          </UiButton>
        </form>
      </section>
    </main>
    <WhatsappBadge />
    <UiToast
      v-model="errorToastOpen"
      :title="serviceError?.title || 'No pudimos guardar tus datos'"
      :message="serviceError?.message || ''"
    />
    <UiDialog v-model="legalOpen" :title="LEGAL_CONTENT[legal].title">
      <div class="space-y-4 text-sm leading-6">
        <p v-for="paragraph in LEGAL_CONTENT[legal].paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
      <UiButton class="mt-6" @click="legalOpen = false">ENTENDIDO</UiButton>
    </UiDialog>
  </div>
</template>
