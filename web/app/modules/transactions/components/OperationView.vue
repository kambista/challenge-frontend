<script setup lang="ts">
import QuoteView from './QuoteView.vue';
import OperationDetailsView from './OperationDetailsView.vue';
import TransferView from './TransferView.vue';
import VoucherView from './VoucherView.vue';
import TransactionSuccessView from './TransactionSuccessView.vue';
withDefaults(defineProps<{ stage?: 'quote' | 'details' | 'transfer' | 'voucher' | 'success' }>(), {
  stage: 'quote',
});
</script>

<template>
  <QuoteView v-if="stage === 'quote'" />
  <OperationDetailsView v-else-if="stage === 'details'" />
  <TransferView v-else-if="stage === 'transfer'" />
  <VoucherView v-else-if="stage === 'voucher'" />
  <TransactionSuccessView v-else />
</template>
