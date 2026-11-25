import { describe, expect, it } from 'vitest';
import { resolveFlowRedirect, type FlowContext } from '~/middleware/flow.rules';

const ready: FlowContext = {
  path: '/',
  authenticated: true,
  profileCompleted: true,
  hasPendingQuote: false,
  hasQuote: false,
  isTransferred: false,
  isSubmitted: false,
};
const paths = [
  '/registro',
  '/registro/exito',
  '/inicio',
  '/operacion',
  '/operacion/transferencia',
  '/operacion/constancia',
  '/operacion/exito',
];

describe('Matriz de redirecciones', () => {
  it.each(paths)('exige sesión en %s', (path) => {
    expect(resolveFlowRedirect({ ...ready, path, authenticated: false })).toBe('/');
  });
  it.each(paths.filter((path) => path !== '/registro'))('exige perfil en %s', (path) => {
    expect(resolveFlowRedirect({ ...ready, path, profileCompleted: false })).toBe('/registro');
  });
  it.each([
    ['/', {}, '/inicio'],
    ['/', { profileCompleted: false }, '/registro'],
    ['/login', {}, '/'],
    ['/registro', { profileCompleted: false }, null],
    ['/operacion', {}, '/inicio'],
    ['/operacion', { hasPendingQuote: true }, null],
    ['/operacion/transferencia', { hasPendingQuote: true }, '/operacion'],
    ['/operacion/constancia', {}, '/inicio'],
    ['/operacion/exito', { hasQuote: true }, '/operacion/transferencia'],
    ['/operacion/exito', { hasQuote: true, isTransferred: true }, '/operacion/constancia'],
    ['/operacion/exito', { hasQuote: true, isTransferred: true, isSubmitted: true }, null],
    ['/operacion/constancia', { hasQuote: true, isTransferred: true }, null],
    ['/operacion/transferencia', { hasQuote: true }, null],
  ] satisfies [string, Partial<FlowContext>, string | null][])(
    '%s con %j → %s',
    (path, state, expected) => {
      expect(resolveFlowRedirect({ ...ready, ...state, path })).toBe(expected);
    },
  );
});
