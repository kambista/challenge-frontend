import { computed, onMounted, onScopeDispose, shallowRef, watch } from 'vue';
import {
  calculateExchange,
  getExchangeRates,
  isAbortError,
  type ExchangeRates,
  type ExchangeCalculation,
} from '../services/exchange.service';
import { DEFAULT_QUOTE_DRAFT } from '../constants/draft';
import type { QuoteInputs } from '../types/exchange.types';
import { useOperationState } from './useOperationState';
import type { Currency } from '~/shared/constants/currencies';

export function useOperation() {
  const draft = useState('quote-draft', () => ({ ...DEFAULT_QUOTE_DRAFT }));
  const rates = shallowRef<ExchangeRates | null>(null);
  const calculation = shallowRef<ExchangeCalculation | null>(null);
  const isCalculating = shallowRef(false);
  const isLoadingRates = shallowRef(false);
  const quoteError = shallowRef('');
  const ratesError = shallowRef('');
  const refresh = shallowRef(0);
  const { state } = useOperationState();
  let ratesController: AbortController | undefined;

  const received = computed(() => calculation.value?.exchange ?? null);
  const savings = computed(() => calculation.value?.savings ?? null);
  const destination = computed(() => draft.value.destination);
  const rate = computed(() => calculation.value?.rate ?? null);
  const canContinue = computed(
    () =>
      !!calculation.value &&
      !!rates.value &&
      !isCalculating.value &&
      !quoteError.value &&
      !ratesError.value,
  );

  async function loadRates() {
    ratesController?.abort();
    const controller = new AbortController();
    ratesController = controller;
    isLoadingRates.value = true;
    ratesError.value = '';
    try {
      const result = await getExchangeRates(controller.signal);
      if (!controller.signal.aborted) rates.value = result;
    } catch (error) {
      if (!controller.signal.aborted && !isAbortError(error)) {
        ratesError.value = (error as Error).message;
      }
    } finally {
      if (!controller.signal.aborted) isLoadingRates.value = false;
    }
  }

  async function calculateQuote(
    amount: number,
    origin: Currency,
    destination: Currency,
    controller: AbortController,
  ) {
    try {
      const result = await calculateExchange(amount, origin, destination, controller.signal);
      if (!controller.signal.aborted) calculation.value = result;
    } catch (error) {
      if (!controller.signal.aborted && !isAbortError(error)) {
        quoteError.value = (error as Error).message;
      }
    } finally {
      if (!controller.signal.aborted) isCalculating.value = false;
    }
  }

  function handleQuoteInputsChange(
    [amount, origin, destination]: QuoteInputs,
    _previous: QuoteInputs | undefined,
    onCleanup: (cleanup: () => void) => void,
  ) {
    calculation.value = null;
    quoteError.value = '';
    const controller = new AbortController();
    const valid = Number.isFinite(amount) && amount > 0 && origin !== destination;
    isCalculating.value = valid;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function cancelPendingCalculation() {
      if (timer) clearTimeout(timer);
      controller.abort();
    }

    onCleanup(cancelPendingCalculation);
    if (!valid) return;
    timer = setTimeout(() => {
      void calculateQuote(amount, origin, destination, controller);
    }, 300);
  }

  function abortRatesRequest() {
    ratesController?.abort();
  }

  function getQuoteInputs(): QuoteInputs {
    return [draft.value.amount, draft.value.origin, draft.value.destination, refresh.value];
  }

  function setCurrencyPair(origin: Currency, destination: Currency) {
    if (draft.value.origin === origin && draft.value.destination === destination) return;
    draft.value = { ...draft.value, origin, destination };
  }
  function swapCurrencies() {
    setCurrencyPair(draft.value.destination, draft.value.origin);
  }
  function setOriginCurrency(currency: Currency) {
    if (currency !== draft.value.origin) swapCurrencies();
  }
  function setDestinationCurrency(currency: Currency) {
    if (currency !== draft.value.destination) swapCurrencies();
  }
  async function startOperation() {
    if (
      !calculation.value ||
      isCalculating.value ||
      quoteError.value ||
      ratesError.value ||
      !rates.value
    )
      return;
    state.value = { quote: null, pendingQuote: { ...draft.value, ...calculation.value } };
    await navigateTo('/operacion');
  }

  function retry() {
    void loadRates();
    refresh.value++;
  }

  onMounted(loadRates);
  onScopeDispose(abortRatesRequest);
  watch(getQuoteInputs, handleQuoteInputsChange, {
    immediate: import.meta.client,
    flush: 'sync',
  });

  return {
    draft,
    rates,
    calculation,
    isCalculating,
    isLoadingRates,
    quoteError,
    ratesError,
    retry,
    received,
    savings,
    destination,
    rate,
    setOriginCurrency,
    setDestinationCurrency,
    setCurrencyPair,
    swapCurrencies,
    startOperation,
    canContinue,
  };
}
