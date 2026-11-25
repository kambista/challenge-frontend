export interface FlowContext {
  path: string;
  authenticated: boolean;
  profileCompleted: boolean;
  hasPendingQuote: boolean;
  hasQuote: boolean;
  isTransferred: boolean;
  isSubmitted: boolean;
}

export interface FlowRule {
  match: (path: string) => boolean;
  redirect: (ctx: FlowContext) => string | null;
}

export const FLOW_RULES: FlowRule[] = [
  // Alias legacy de /login hacia la raíz
  {
    match: (path) => path === '/login',
    redirect: () => '/',
  },
  // Usuarios no autenticados solo pueden acceder a la raíz (/)
  {
    match: (path) => path !== '/',
    redirect: (ctx) => (!ctx.authenticated ? '/' : null),
  },
  // Usuarios autenticados en / avanzan al flujo correspondiente
  {
    match: (path) => path === '/',
    redirect: (ctx) =>
      ctx.authenticated ? (ctx.profileCompleted ? '/inicio' : '/registro') : null,
  },
  // Perfil incompleto obliga a completar /registro primero
  {
    match: (path) => path !== '/' && path !== '/registro',
    redirect: (ctx) => (!ctx.profileCompleted ? '/registro' : null),
  },
  // Datos de operación requiere cotización pendiente
  {
    match: (path) => path === '/operacion',
    redirect: (ctx) => (!ctx.hasPendingQuote ? '/inicio' : null),
  },
  // Subrutas de /operacion/* requieren una operación creada
  {
    match: (path) => path.startsWith('/operacion/'),
    redirect: (ctx) => (!ctx.hasQuote ? (ctx.hasPendingQuote ? '/operacion' : '/inicio') : null),
  },
  // Constancia y éxito requieren transferencia confirmada
  {
    match: (path) => path === '/operacion/constancia' || path === '/operacion/exito',
    redirect: (ctx) => (!ctx.isTransferred ? '/operacion/transferencia' : null),
  },
  // Pantalla de éxito requiere constancia enviada
  {
    match: (path) => path === '/operacion/exito',
    redirect: (ctx) => (!ctx.isSubmitted ? '/operacion/constancia' : null),
  },
];

export function resolveFlowRedirect(ctx: FlowContext): string | null {
  for (const rule of FLOW_RULES) {
    if (!rule.match(ctx.path)) continue;
    const target = rule.redirect(ctx);
    if (target && target !== ctx.path) return target;
  }
  return null;
}
