# AGENTS.md — React Native Engineering Guidelines

## 1. Stack tecnológico

El proyecto utiliza React Native, Expo, TypeScript, NativeWind, Zustand y una arquitectura modular orientada a funcionalidades del negocio.

| Categoría | Tecnología |
|---|---|
| Core | Expo · React Native · TypeScript |
| Navegación | Expo Router |
| Estilos | NativeWind |
| Estado global | Zustand |
| API | Axios |
| Formularios | React Hook Form · Yup |
| Comportamiento reactivo | Custom Hooks |
| Build Android | EAS Build |

TanStack React Query, AsyncStorage y Expo SecureStore no son dependencias obligatorias; incorporarlas únicamente si existe una necesidad justificada y autorización.

Respetar las versiones y dependencias existentes. No instalar, sustituir ni actualizar librerías sin una necesidad justificada y autorización cuando corresponda.

## 2. Reglas generales

- Mantener TypeScript en modo estricto y evitar `any`, `@ts-ignore` y `@ts-nocheck`.
- Aplicar SOLID, DRY, KISS y YAGNI de manera pragmática.
- Priorizar legibilidad, cohesión, mantenibilidad y escalabilidad.
- No introducir abstracciones anticipadas ni dependencias innecesarias.
- Respetar las convenciones existentes y limitar los cambios al alcance solicitado.
- Utilizar imports explícitos y aliases configurados en el proyecto.
- No inventar contratos de API, datos ni reglas de negocio.

## 3. Arquitectura — React Native Module-Based Architecture

### Estructura oficial

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── +not-found.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (private)/
│       ├── _layout.tsx
│       └── dashboard.tsx
├── modules/
│   ├── auth/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── mappers/
│   │   ├── queries/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   └── transactions/
│       └── ...
├── shared/
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   ├── constants/
│   ├── helpers/
│   ├── mappers/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── utils/
├── providers/
├── config/
├── assets/
└── global.css

app.config.ts
metro.config.js
tsconfig.json
eslint.config.mjs
eas.json
package.json
AGENTS.md
```

Los archivos de configuración específicos de NativeWind, Babel y Metro deben ajustarse a las versiones instaladas. La estructura representa responsabilidades, no una obligación de crear todos los directorios.

### Reglas arquitectónicas

1. `src/app/` contiene exclusivamente rutas y layouts de Expo Router.
2. `src/modules/` contiene módulos funcionales del negocio.
3. Cada módulo encapsula sus propias screens, components, hooks, services, stores, queries, schemas, types, constants, helpers, utils y mappers cuando sean necesarios.
4. `src/shared/` contiene recursos realmente reutilizables y no depende de módulos funcionales.
5. `src/providers/` contiene integraciones y proveedores globales.
6. `src/config/` centraliza configuraciones técnicas.
7. No colocar lógica de negocio en rutas ni layouts.
8. No importar implementaciones internas de otros módulos; utilizar contratos públicos cuando sea necesario.
9. Evitar dependencias circulares y carpetas vacías.
10. No reorganizar el proyecto hacia arquitectura hexagonal, Feature-Sliced Design, Clean Architecture estricta u otra estructura sin autorización explícita.

### Flujo de dependencias

```text
Routes → Screens → Components / Hooks
                       ↓
                Queries / Stores
                       ↓
                     Services → API / Native APIs

Modules → Shared
```

El flujo es conceptual: no crear capas intermedias innecesarias. Los stores no están obligados a depender de services.

### Separación de responsabilidades

- `screens/`: composición visual de pantallas.
- `components/`: presentación e interacción visual.
- `hooks/`: comportamiento reactivo y orquestación.
- `queries/`: gestión del estado remoto, consultas y mutaciones.
- `stores/`: estado global del cliente y acciones asociadas.
- `services/`: comunicación con APIs y servicios externos.
- `schemas/`: validaciones y contratos Yup.
- `mappers/`: transformación entre DTO y modelos.
- `helpers/`: funciones puras de dominio o funcionalidad.
- `utils/`: utilidades técnicas genéricas.
- `constants/`: valores iniciales, rutas, mensajes y constantes.
- `types/`: tipos, interfaces y contratos TypeScript.

### Ejemplo de ruta

```tsx
import { LoginScreen } from '@/modules/auth/screens/login.screen';

export default function LoginRoute() {
  return <LoginScreen />;
}
```

## 4. Organización interna de funciones y callbacks

### Declaración explícita de funciones

- Preferir declaraciones `function` y `async function` para operaciones relevantes.
- Utilizar nombres descriptivos y responsabilidades específicas.
- Separar la declaración del comportamiento de su ejecución, registro y exposición.
- Extraer callbacks complejos a funciones nombradas y pasar sus referencias.
- Utilizar early returns y evitar anidamientos innecesarios.
- Mantener funciones privadas y cohesivas dentro del mismo archivo.

### Callbacks y argumentos

No implementar callbacks complejos inline dentro de Custom Hooks, stores, queries, mutations, formularios, efectos, listeners, interceptores, promesas, JSX, objetos de configuración ni objetos de retorno.

Extraer callbacks que realicen llamadas a servicios, navegación, modificaciones relevantes de estado, manejo de errores o múltiples operaciones.

Incorrecto:

```tsx
const form = useLoginForm(async (values) => {
  const session = await mutateAsync(values);
  setUser(session.user);
  router.replace('/dashboard');
});
```

Correcto:

```tsx
async function handleLoginSuccess(values: LoginValues) {
  const session = await mutateAsync(values);
  setUser(session.user);
  router.replace('/dashboard');
}

const form = useLoginForm(handleLoginSuccess);
```

### Objetos de retorno

El objeto `return` debe actuar como interfaz pública del hook, store o factory. No implementar lógica compleja dentro de sus propiedades.

Incorrecto:

```tsx
return {
  onSubmit: handleSubmit(async (values) => {
    await authService.signIn(values);
    router.replace('/dashboard');
  }),
};
```

Correcto:

```tsx
async function handleLogin(values: LoginValues) {
  await authService.signIn(values);
  router.replace('/dashboard');
}

const onSubmit = handleSubmit(handleLogin);

return { onSubmit };
```

### Excepciones

Permitir callbacks inline pequeños, declarativos y sin complejidad relevante. No extraer funciones triviales únicamente para cumplir una convención.

```tsx
const user = useAuthStore((state) => state.user);
const activeUsers = users.filter((user) => user.active);
const names = users.map((user) => user.name);
```

## 5. React Native y Custom Hooks

- Utilizar componentes funcionales y respetar las Rules of Hooks.
- Utilizar el prefijo `use` para Custom Hooks.
- Encapsular comportamiento reactivo y orquestación cuando exista complejidad relevante.
- No retornar JSX desde hooks de lógica.
- No realizar peticiones HTTP directamente desde componentes; delegarlas a services mediante hooks.
- No convertir funciones puras en hooks.
- No crear hooks triviales ni hooks que concentren todas las responsabilidades de un módulo.
- Exponer únicamente el estado y acciones requeridos por los consumidores.
- No utilizar efectos para estados derivados ni acciones que pertenecen a eventos del usuario.
- No introducir `useMemo`, `useCallback` o `React.memo` sin justificación.
- Respetar las dependencias de los efectos y limpiar suscripciones, listeners y temporizadores.
- No utilizar funciones `async` como callback directo de `useEffect`.

Ejemplo de efecto con comportamiento nombrado:

```tsx
useEffect(function subscribeToAppState() {
  function handleAppStateChange(status: AppStateStatus) {
    synchronizeSession(status);
  }

  const subscription = AppState.addEventListener(
    'change',
    handleAppStateChange,
  );

  return function unsubscribeFromAppState() {
    subscription.remove();
  };
}, [synchronizeSession]);
```

### Formularios

Utilizar React Hook Form y Yup con `yupResolver` de `@hookform/resolvers/yup`. Mantener el esquema separado y derivar tipos mediante `InferType<typeof schema>` de Yup cuando corresponda. Utilizar `Controller` o `useController` para integrar campos nativos controlados. No duplicar el estado del formulario en Zustand.

```ts
export function useLoginForm(onValid: SubmitHandler<LoginValues>) {
  const form = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const { control, handleSubmit, formState } = form;
  const onSubmit = handleSubmit(onValid);

  return {
    control,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    onSubmit,
  };
}
```

## 6. Gestión de estado — Zustand

### Distribución de responsabilidades

| Estado | Herramienta |
|---|---|
| Local y visual | useState / useReducer |
| Global del cliente | Zustand |
| Remoto | Axios mediante services y Custom Hooks; Zustand para tasas compartidas |
| Formularios | React Hook Form |
| Navegación | Expo Router |
| Derivado | Cálculo directo o selector |
| Persistencia no sensible | AsyncStorage |
| Credenciales sensibles | Expo SecureStore |

### Reglas

- Crear stores por dominio funcional, no un store monolítico.
- Separar tipos de estado y acciones cuando aporte claridad.
- Utilizar selectores específicos. Evitar suscribirse al store completo.
- Utilizar `useShallow` cuando sea apropiado para seleccionar múltiples propiedades.
- No duplicar datos remotos ni estado de formularios; mantener una fuente de verdad para las tasas de cambio.
- No almacenar valores derivados innecesariamente.
- No introducir navegación, notificaciones visuales ni referencias a componentes en stores.
- No mutar directamente el estado.
- Proporcionar acciones explícitas de actualización y restauración cuando corresponda.

```ts
import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  clearSession: () => void;
}

type AuthStore = AuthState & AuthActions;

const INITIAL_STATE: AuthState = { user: null };

export const useAuthStore = create<AuthStore>()((set) => {
  function setUser(user: User) {
    set({ user });
  }

  function clearSession() {
    set(INITIAL_STATE);
  }

  return { ...INITIAL_STATE, setUser, clearSession };
});
```

### Estado global de transacciones y tasas de cambio

- Centralizar en Zustand los datos compartidos de una transacción y las tasas de cambio obtenidas desde la API.
- Separar stores por responsabilidad cuando resulte útil: `transaction.store.ts` y `exchange-rate.store.ts` son nombres de referencia.
- Utilizar acciones nombradas para actualizar, confirmar y limpiar los datos del flujo.
- Mantener los campos temporales y errores de validación en React Hook Form; transferir al store los datos necesarios para continuar entre pantallas.
- Mantener la vigencia y procedencia de las tasas conforme al contrato de la API. No presentar tasas obsoletas como vigentes.
- Evitar duplicar importes derivados; respetar precisión, redondeo y reglas de cálculo del backend. No inventar reglas de compra o venta.
- No persistir transacciones ni tasas por defecto. Limpiar el flujo al finalizar o cancelar cuando corresponda.

### Persistencia

- Utilizar `persist` únicamente cuando exista una necesidad funcional.
- Persistir campos específicos mediante `partialize`.
- Considerar la hidratación asíncrona antes de decidir el estado de navegación o sesión.
- Utilizar versionado y migraciones cuando cambien los contratos persistidos.
- No persistir contraseñas, tokens ni datos sensibles en AsyncStorage.
- Utilizar SecureStore para credenciales sensibles y eliminar los datos asociados al usuario al cerrar sesión.
- No considerar la existencia de datos persistidos como prueba de autenticación válida.

## 7. Consumo de API — Axios

- Utilizar Axios como cliente HTTP obligatorio y centralizar su configuración en `shared/services/api-client.ts`.
- Configurar baseURL, timeout y headers según el contrato de la API; no inventar endpoints.
- Utilizar interceptores únicamente para responsabilidades transversales justificadas y extraer callbacks complejos a funciones nombradas.
- Tipar requests y responses; validar datos externos cuando corresponda.
- Mantener las peticiones en services y la orquestación reactiva en Custom Hooks.
- Los services no deben depender de componentes, hooks ni navegación.
- Gestionar loading, errores, cancelación y respuestas obsoletas cuando corresponda.
- Evitar reintentos automáticos de operaciones financieras no idempotentes.
- No incorporar TanStack React Query ni un segundo cliente HTTP sin autorización.

```ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
});
```

El nombre de la variable y el timeout son ejemplos; respetar la configuración real del proyecto.

## 8. NativeWind — Estilos y Design System

### Reglas obligatorias

- Priorizar utilidades nativas de Tailwind compatibles con la versión instalada de NativeWind.
- Utilizar la forma canónica cuando exista una utilidad equivalente con el mismo resultado visual.
- Evitar valores arbitrarios innecesarios en espaciados, tamaños, colores, tipografía, bordes y opacidad.
- Utilizar valores arbitrarios únicamente cuando no exista una alternativa equivalente o el diseño exija un valor específico.
- Promover valores personalizados recurrentes a Design Tokens.
- Centralizar tokens mediante la configuración de tema compatible con la versión de NativeWind y Tailwind instalada.
- No introducir estilos inline estáticos cuando exista una utilidad equivalente.
- No duplicar estilos entre NativeWind y StyleSheet.
- No asumir compatibilidad de todas las utilidades CSS web con React Native.
- No construir clases mediante interpolaciones parciales como `bg-${color}-500`.
- Utilizar clases completas y variantes explícitas que puedan detectarse estáticamente.
- No desactivar advertencias de clases canónicas para eludir estas reglas.

Ejemplos de equivalencias, siempre que el tema y la plataforma produzcan el mismo resultado:

| Evitar | Preferir |
|---|---|
| `p-[16px]` | `p-4` |
| `mt-[24px]` | `mt-6` |
| `w-[100%]` | `w-full` |
| `opacity-[0.5]` | `opacity-50` |

No asumir equivalencias universales entre px, rem y unidades nativas. No utilizar clases exclusivas de Tailwind v4 si el proyecto utiliza Tailwind v3. Verificar el tema, la escala de espaciado y el soporte de NativeWind antes de reemplazar valores.

Valores arbitrarios válidos cuando están justificados:

```tsx
<View className="w-[83%]" />
<View className="min-h-[137px]" />
```

### Variantes visuales

```ts
const STATUS_VARIANTS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  pending: 'bg-yellow-500',
} as const;
```

### Excepciones para estilos nativos

Permitir `style`, `StyleSheet` y estilos animados cuando sean necesarios para Reanimated, gestos, dimensiones dinámicas, safe area insets, componentes de terceros o propiedades no soportadas por NativeWind.

No forzar NativeWind cuando las capacidades nativas sean más apropiadas.

## 9. Componentes, pantallas y navegación

- Mantener las rutas ligeras y delegar la composición a screens.
- Los componentes compartidos de UI no deben conocer reglas de negocio específicas.
- Mantener componentes específicos dentro del módulo correspondiente.
- Utilizar props explícitas y tipadas.
- Separar presentación y comportamiento cuando exista complejidad relevante.
- Evitar componentes genéricos sin casos reales de reutilización.
- No utilizar Zustand únicamente para evitar pasar unas pocas props.
- Contemplar loading, error, empty, disabled y success cuando correspondan.
- Utilizar las propiedades de accesibilidad apropiadas.
- Considerar áreas seguras, teclado, orientación y diferencias entre Android e iOS.
- Proteger rutas privadas según el estado de autenticación validado y la hidratación de sesión.
- No utilizar `window`, `document`, `localStorage` ni `sessionStorage` en código nativo.
- No exponer secretos en variables `EXPO_PUBLIC_*` ni en el bundle móvil.

## 10. Orden interno de los archivos

Mantener el siguiente orden lógico, adaptándolo a las dependencias de inicialización y Rules of Hooks:

1. Imports.
2. Tipos y contratos locales.
3. Constantes locales.
4. Dependencias y hooks de infraestructura.
5. Estado local y global.
6. Configuración de formularios y consultas requeridas.
7. Estado derivado.
8. Funciones y handlers nombrados.
9. Registro de callbacks y mutaciones.
10. Efectos y suscripciones.
11. Interfaz pública mediante `return` o JSX.

No alterar el orden estable de ejecución de hooks ni acceder a variables antes de su inicialización para cumplir este orden.

## 11. Convenciones de nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | LoginFields |
| Archivos de componentes | kebab-case | login-fields.tsx |
| Screens | .screen.tsx | login.screen.tsx |
| Custom Hooks | use-*.ts | use-login-form.ts |
| Stores | .store.ts | auth.store.ts |
| Services | .service.ts | auth.service.ts |
| Schemas | .schema.ts | login.schema.ts |
| Types | .types.ts | auth.types.ts |
| Mappers | .mapper.ts | user.mapper.ts |
| Constants | .constants.ts | auth.constants.ts |
| Queries | use-*-query.ts | use-users-query.ts |
| Mutations | use-*-mutation.ts | use-login-mutation.ts |
| Tests | .test.ts / .test.tsx | auth.service.test.ts |

- Funciones y variables: camelCase.
- Interfaces y tipos: PascalCase.
- Constantes globales: UPPER_SNAKE_CASE.
- Custom Hooks: useCamelCase.
- Stores: useDomainStore.
- Booleanos: prefijos is, has, can o should.
- Rutas: respetar las convenciones propias de Expo Router.

Utilizar nombres como `handleLoginSuccess`, `handleSubmit`, `initializeSession`, `fetchUsers`, `mapUserResponse` y `resetFormState`. Evitar nombres ambiguos como `execute`, `handler`, `process` o `doSomething` cuando no expresen intención concreta.

## 12. Rendimiento y calidad

- Utilizar listas virtualizadas para colecciones extensas.
- Utilizar keys estables y evitar índices cuando los elementos puedan reordenarse.
- Evitar suscripciones completas a stores y renderizados innecesarios.
- Optimizar imágenes y recursos multimedia.
- Considerar dispositivos de gama baja y evitar procesamiento intensivo durante el renderizado.
- Medir antes de introducir optimizaciones complejas.
- Mantener ESLint y TypeScript sin errores; usar configuraciones compatibles con las versiones instaladas.
- Implementar pruebas unitarias de reglas de negocio y pruebas de componentes cuando corresponda.
- Considerar React Native Testing Library y Maestro si forman parte de la estrategia de pruebas.

## 13. Definition of Done

Antes de finalizar cualquier implementación:

- [ ] Se respeta la arquitectura modular y el alcance solicitado.
- [ ] Las rutas no contienen lógica de negocio.
- [ ] Los hooks, stores, queries y services tienen responsabilidades definidas.
- [ ] Zustand centraliza los datos compartidos de transacción y tasas de cambio sin duplicar el estado de formularios.
- [ ] Los callbacks complejos utilizan funciones nombradas.
- [ ] NativeWind prioriza utilidades canónicas compatibles con la versión instalada.
- [ ] Los valores arbitrarios están justificados.
- [ ] Se contemplan los estados de interfaz, accesibilidad y errores pertinentes.
- [ ] No se exponen credenciales ni información sensible.
- [ ] No se introducen abstracciones ni dependencias innecesarias.
- [ ] Se ejecutan las validaciones disponibles de lint, typecheck y pruebas relevantes.
- [ ] Para la entrega final, se genera y adjunta el APK mediante EAS Build.
- [ ] Se informa explícitamente cualquier validación no ejecutada, error pendiente o decisión técnica relevante.

## 14. Requisitos técnicos obligatorios del challenge

- Configurar NativeWind y TypeScript estricto.
- Consumir la API mediante Axios y gestionar correctamente los datos y errores.
- Implementar estado global con Zustand para transacciones y tasas de cambio.
- Reutilizar componentes de UI con props correctamente tipadas.
- Garantizar navegación fluida entre pantallas mediante Expo Router.
- Utilizar React Hook Form y Yup para formularios.

## 15. Entregable Android — APK con EAS Build

- Configurar EAS Build para generar un APK instalable, no únicamente un AAB.
- Respetar los perfiles existentes de `eas.json`; agregar o adaptar un perfil `preview` cuando sea necesario.
- Configuración de referencia (integrar sin sobrescribir otros perfiles):

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

- Ejecutar las validaciones disponibles antes de iniciar el build.
- Generar el APK mediante `npx eas-cli build --platform android --profile preview`.
- Utilizar una cuenta Expo autorizada y la configuración Android real del proyecto; no inventar identificadores ni credenciales.
- Verificar que el build finalice correctamente y que el artefacto sea un `.apk` instalable. Probar el flujo principal en Android cuando sea posible.
- Descargar y adjuntar el APK como entregable del challenge. Un enlace al build puede complementar, pero no sustituye, el archivo solicitado.
- Si faltan credenciales, permisos o acceso a EAS, informar el bloqueo; no declarar un APK generado sin evidencia.

## 16. Alcance obligatorio

Estas reglas aplican a rutas, screens, components, hooks, services, stores, queries, mutations, providers, helpers, utils, mappers y schemas.

**Principio fundamental:** separar la declaración del comportamiento de su ejecución, registro y exposición. El código debe permitir identificar rápidamente qué hace cada función, dónde se implementa y cuándo se ejecuta.

Priorizar legibilidad, cohesión y mantenibilidad sobre la reducción artificial de líneas. No confundir código compacto con código limpio ni arquitectura escalable con sobreingeniería.

## UI/UX y sistema de diseño

- Leer obligatoriamente `DESIGN.md` antes de implementar o modificar cualquier interfaz de usuario.
- Aplicar las skills correspondientes disponibles en `.agents/`.
- Respetar los design tokens, componentes compartidos y lineamientos visuales establecidos.
- Consultar las imágenes de referencia disponibles en la carpeta `design/`, ubicada en la raíz de la aplicación móvil.
- Utilizar el proyecto web existente desarrollado con Vue como referencia funcional y de reglas de negocio.
- Adaptar los componentes, flujos e interacciones al ecosistema de React Native y Expo.
- No introducir colores, espaciados, tipografías o patrones de interfaz arbitrarios que rompan la consistencia visual.
- Priorizar la reutilización de componentes y evitar la duplicación de estilos.
- Validar cada pantalla implementada comparándola con las imágenes de referencia de `design/`.
- Garantizar una experiencia móvil consistente, accesible y visualmente cuidada.
- No inventar reglas de negocio, endpoints ni contratos de APIs.

## Naming conventions

Use English names throughout authored source code. Architectural directories and component folders
use kebab-case. Keep Expo Router reserved filenames and route conventions.

- Components use PascalCase filenames and named exports.
- Screens use PascalCase filenames ending in Screen.
- Hook filenames match the camelCase function name with a use prefix.
- Services, constants, utilities, helpers, types, schemas, stores, adapters and mappers use
  kebab-case with .service, .const, .util, .helper, .types, .schema, .store, .adapter and .mapper.
- Clients use .client and configurations use .config. Barrel files use index.ts and explicit exports.
- Keep default exports for framework entry points that require them.
- Event handlers use handle and event props use on. Boolean names use is, has, can or should
  when defining application contracts. Preserve property names required by external APIs and libraries.
- Co-locate component-specific files. Create supporting files only when their responsibility warrants it.
