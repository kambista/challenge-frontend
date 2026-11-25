import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import UiDatePicker from '~/shared/components/UiDatePicker.vue';

it('permite elegir un mes y un año de hace más de 100 años sin rellenar el campo al abrir', async () => {
  const wrapper = mount(UiDatePicker, { props: { label: 'Nacimiento', modelValue: '' } });
  try {
    await wrapper.get('[aria-label="Abrir calendario"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await wrapper.get('select[aria-label="Año"]').setValue('1896');
    await wrapper.get('select[aria-label="Mes"]').setValue('1');
    await wrapper.get('button[aria-label*="29 de febrero de 1896"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([['1896-02-29']]);
  } finally {
    wrapper.unmount();
  }
});

it('permite navegar desde 2008 hasta el año actual', async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 18;
  vi.useFakeTimers();
  vi.setSystemTime(new Date(previousYear, 5, 15));
  const wrapper = mount(UiDatePicker, {
    props: { label: 'Nacimiento', modelValue: `${previousYear}-06-15` },
  });
  try {
    vi.setSystemTime(new Date(currentYear, 5, 15));
    await wrapper.get('[aria-label="Abrir calendario"]').trigger('click');
    const yearSelect = wrapper.get('select[aria-label="Año"]');
    const years = yearSelect.findAll('option').map((option) => Number(option.element.value));

    expect(Math.max(...years)).toBe(currentYear);
    await yearSelect.setValue(String(currentYear));
    expect((yearSelect.element as HTMLSelectElement).value).toBe(String(currentYear));
  } finally {
    wrapper.unmount();
    vi.useRealTimers();
  }
});
