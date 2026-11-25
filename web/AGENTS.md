## 3. Arquitectura — Nuxt Module-Based Architecture

El proyecto utiliza Nuxt 4, Vue 3, TypeScript y una arquitectura modular orientada a funcionalidades.

### Estructura oficial

```text
app/
├── pages/
│   ├── index.vue
│   ├── login.vue
│   └── dashboard.vue
│
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── mappers/
│   │   ├── queries/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── users/
│       ├── components/
│       ├── composables/
│       ├── constants/
│       ├── helpers/
│       ├── mappers/
│       ├── queries/
│       ├── schemas/
│       ├── services/
│       ├── stores/
│       ├── types/
│       └── utils/
│
├── shared/
│   ├── components/
│   ├── composables/
│   ├── constants/
│   ├── helpers/
│   ├── mappers/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── layouts/
├── middleware/
├── plugins/
├── assets/
└── app.vue

server/
├── api/
├── middleware/
└── utils/

public/
nuxt.config.ts
package.json
AGENTS.md
```

### Reglas arquitectónicas

1. `app/pages/` contiene exclusivamente páginas asociadas al enrutamiento automático de Nuxt.
2. `app/modules/` contiene los módulos funcionales del negocio.
3. Cada módulo encapsula sus componentes, composables, services, stores, schemas, types, constants, helpers, utils y mappers.
4. `app/shared/` contiene recursos compartidos entre módulos y no pertenece a ningún módulo funcional.
5. `server/` contiene endpoints y lógica exclusivamente del servidor mediante Nitro.
6. `app/layouts/` contiene las estructuras visuales generales.
7. `app/middleware/` contiene middleware de navegación.
8. `app/plugins/` contiene integraciones globales.
9. No crear carpetas vacías ni archivos innecesarios.
10. No importar implementaciones internas de otros módulos; exponer contratos públicos cuando sea necesario.

### Reglas específicas de Nuxt

- Utilizar `useFetch` o `useAsyncData` para carga de datos integrada con SSR cuando corresponda.
- Utilizar `$fetch` para operaciones HTTP imperativas cuando sea apropiado.
- No usar Axios por defecto; incorporarlo únicamente cuando exista una necesidad justificada.
- Utilizar `useState` para estado compartido compatible con SSR cuando sea suficiente.
- Utilizar Pinia para estado global de cliente más complejo.
- Utilizar TanStack Vue Query cuando se necesite caché avanzada, mutaciones o invalidación de consultas.
- Evitar duplicar caché entre `useAsyncData`, Vue Query y Pinia.
- No acceder a `window`, `document` o `localStorage` durante SSR.
- Utilizar `runtimeConfig` para configuración y secretos del servidor.
- Mantener los secretos fuera de `runtimeConfig.public`.
- No colocar lógica de negocio directamente en páginas.
- No asumir que los composables o componentes dentro de `app/modules/` serán autoimportados por Nuxt; configurar imports explícitamente o registrar sus directorios.
- Diferenciar los módulos funcionales de `app/modules/` de los módulos de extensión de Nuxt definidos en `nuxt.config.ts`.

### Flujo de dependencias

```text
app/pages/
    ↓
app/modules/
    ├── components/
    ├── composables/
    ├── queries/
    ├── services/
    ├── stores/
    ├── schemas/
    ├── mappers/
    └── types/
    ↓
app/shared/
    ↓
server/api/ (mediante HTTP)
```

### Regla principal

Mantener una arquitectura modular, escalable y orientada al dominio, respetando las convenciones nativas de Nuxt 4.

No reorganizar el proyecto hacia Feature-First convencional, arquitectura hexagonal ni otra estructura sin autorización explícita.

La separación de responsabilidades tiene prioridad sobre la cantidad de archivos o líneas de código.

## 4. Organización interna de funciones, callbacks y composables

### 1. Declaración explícita de funciones

- Priorizar funciones nombradas, descriptivas y con una única responsabilidad.
- Preferir declaraciones `function` y `async function` para operaciones que encapsulen comportamiento relevante.
- Evitar funciones anónimas inline que contengan lógica de negocio, orquestación o múltiples operaciones.
- Declarar las funciones de manera independiente y pasar sus referencias cuando sean requeridas.
- Evitar funciones excesivamente largas y anidamientos innecesarios.
- Utilizar early returns para simplificar el flujo de ejecución.

### 2. Callbacks y argumentos de funciones

No implementar callbacks complejos directamente dentro de:

- Composables.
- Stores de Pinia.
- Consultas y mutaciones de TanStack Vue Query.
- Configuraciones de VeeValidate.
- Watchers de Vue.
- Lifecycle hooks.
- Event listeners.
- Interceptores HTTP.
- Objetos de configuración.
- Promesas.
- Argumentos de otras funciones.
- Objetos de retorno.

Cuando un callback contenga llamadas a servicios, navegación, modificación de estado, condicionales, manejo de errores o múltiples operaciones, debe extraerse a una función nombrada.

**Incorrecto:**

```typescript
const form = useLoginForm(async (values) => {
  startSession(values.email);
  await navigateTo('/registro');
});
```

**Correcto:**

```typescript
async function handleLoginSuccess(values: LoginValues) {
  startSession(values.email);
  await navigateTo('/registro');
}

const form = useLoginForm(handleLoginSuccess);
```

### 3. Objetos de retorno

El objeto `return` debe actuar exclusivamente como interfaz pública del composable, store o factory.

No implementar lógica compleja directamente dentro de las propiedades retornadas.

**Incorrecto:**

```typescript
return {
  onSubmit: form.handleSubmit(async (values) => {
    await authService.signIn(values);
    await navigateTo('/dashboard');
  }),
};
```

**Correcto:**

```typescript
async function handleLogin(values: LoginValues) {
  await authService.signIn(values);
  await navigateTo('/dashboard');
}

const onSubmit = form.handleSubmit(handleLogin);

return {
  onSubmit,
};
```

### 4. Watchers y lifecycle hooks

Extraer comportamientos relevantes a funciones independientes.

**Incorrecto:**

```typescript
onMounted(async () => {
  await fetchUsers();
  initializeFilters();
});
```

**Correcto:**

```typescript
async function initializePage() {
  await fetchUsers();
  initializeFilters();
}

onMounted(initializePage);
```

### 5. Consultas y mutaciones

Evitar implementar lógica compleja dentro de la configuración de queries y mutations.

**Correcto:**

```typescript
async function handleMutationSuccess() {
  await queryClient.invalidateQueries({
    queryKey: USERS_QUERY_KEYS.all,
  });

  notifySuccess();
}

const mutation = useMutation({
  mutationFn: usersService.create,
  onSuccess: handleMutationSuccess,
});
```

### 6. Excepciones permitidas

Los callbacks inline están permitidos cuando sean pequeños, declarativos y no introduzcan complejidad innecesaria.

```typescript
const activeUsers = computed(() => users.value.filter((user) => user.active));

const userNames = users.map((user) => user.name);
```

No extraer funciones triviales únicamente para cumplir esta regla.

### 7. Separación de responsabilidades

- `constants/`: valores iniciales, mensajes, rutas, configuraciones y constantes de negocio.
- `helpers/`: funciones puras con significado funcional o de dominio.
- `utils/`: utilidades técnicas genéricas.
- `mappers/`: transformaciones entre modelos, DTO y estructuras de datos.
- `services/`: comunicación con APIs y servicios externos.
- `composables/`: comportamiento reactivo y orquestación.
- `stores/`: estado global de cliente.
- `schemas/`: validaciones y contratos Zod.
- `types/`: tipos, interfaces y contratos TypeScript.

No extraer funciones a archivos independientes cuando sean privadas, cohesivas y pertenezcan naturalmente al archivo actual.

Mantener las funciones específicas dentro de su módulo. Utilizar `app/shared/` únicamente cuando exista una necesidad real de reutilización.

### 8. Orden interno de los archivos

Mantener el siguiente orden lógico, adaptándolo a las dependencias de inicialización:

1. Imports.
2. Tipos y contratos locales.
3. Dependencias.
4. Estado reactivo.
5. Configuración de formularios y stores.
6. Propiedades computadas.
7. Funciones y handlers nombrados.
8. Registro de callbacks, queries y mutaciones.
9. Watchers y lifecycle hooks.
10. Interfaz pública mediante `return`.

### 9. Convenciones de nomenclatura

Utilizar nombres que expresen claramente la intención de cada función.

- `handleLoginSuccess`: comportamiento posterior a una autenticación exitosa.
- `handleSubmit`: procesamiento de un formulario.
- `initializePage`: inicialización de una página.
- `fetchUsers`: recuperación de usuarios.
- `validateCredentials`: validación de credenciales.
- `mapUserResponse`: transformación de una respuesta.
- `resetFormState`: restauración del estado de un formulario.

Evitar nombres ambiguos como `handler`, `execute`, `process`, `callback` o `doSomething` cuando no expresen una intención concreta.

### 10. Alcance obligatorio

Estas reglas se aplican a todo el código del proyecto Nuxt:

- Pages.
- Components.
- Composables.
- Services.
- Stores.
- Queries.
- Plugins.
- Middleware.
- Server API.
- Helpers y utils.

### Principio fundamental

Separar la declaración del comportamiento de su ejecución, registro y exposición.

El código debe permitir identificar rápidamente qué hace cada función, dónde se implementa y cuándo se ejecuta.

Priorizar la legibilidad, cohesión y mantenibilidad sobre la reducción artificial de líneas. No confundir código compacto con código limpio.
