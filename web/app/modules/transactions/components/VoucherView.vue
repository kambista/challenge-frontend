<script setup lang="ts">
import { useTemplateRef } from 'vue';
import FlowHeader from '~/shared/components/FlowHeader.vue';
import UiButton from '~/shared/components/UiButton.vue';
import { useVoucher } from '../composables/useVoucher';
const { file, error, chooseFile, submit } = useVoucher();
const input = useTemplateRef<HTMLInputElement>('fileInput');
</script>

<template>
  <FlowHeader :step="3" back="/operacion/transferencia" />
  <main class="mx-auto max-w-146 px-[30px] pt-5 pb-10 md:px-6 md:pt-9">
    <section class="rounded-control border-gray-21 border bg-white p-5 pb-8 md:p-8">
      <img
        src="/images/figma/Subir-constancia-2-1.png"
        alt=""
        class="mx-auto mb-4 h-19 w-32 object-contain"
      />
      <h1 class="mb-4 text-center text-xl font-bold md:text-2xl">Envía tu constancia</h1>
      <p class="mb-5 text-base leading-5 md:text-center">
        Adjunta la constancia de tu transferencia para poder verificar tu operación.
      </p>
      <div class="rounded-control border-gray-21 mb-5 border p-3.5 md:p-5">
        <p class="mb-3 text-sm">Sube el archivo de tu constancia</p>
        <input
          ref="fileInput"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx"
          aria-label="Constancia de transferencia"
          class="sr-only"
          @change="chooseFile"
        />
        <button
          type="button"
          class="rounded-control border-gray-25 text-gray-60 flex min-h-10 w-full items-center justify-between gap-3 border px-3 text-sm"
          @click="input?.click()"
        >
          <span class="truncate">{{ file?.name || 'Selecciona archivo' }}</span>
          <img src="/images/figma/icons/upload-voucher.png" alt="" class="size-7 object-contain" />
        </button>
        <p class="text-gray-60 mt-3 text-[11px]">*Tamaño máximo permitido del archivo 10 Mb</p>
      </div>
      <div class="text-gray-60 text-sm leading-4">
        Recuerda:
        <ul class="list-disc pl-5">
          <li>
            El voucher enviado debe tener el
            <strong>monto, datos del beneficiario, fecha y hora.</strong>
          </li>
          <li>El voucher debe ser legible</li>
          <li>
            Archivos permitidos
            <strong>imágenes, word y PDF</strong>
          </li>
        </ul>
      </div>
      <p v-if="error" role="alert" class="text-danger mt-3 text-sm">{{ error }}</p>
    </section>
    <UiButton class="mt-8" @click="submit">ENVIAR CONSTANCIA</UiButton>
  </main>
</template>
