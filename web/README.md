# Kambista Web

Aplicación responsive del reto: login → perfil → felicitaciones → cotización →
cuentas y origen de fondos → transferencia → constancia → resumen → Inicio.

## Ejecutar con npm

Requiere Node.js 22.12 o posterior compatible con Nuxt 4.

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:3000. Para producción:

```bash
npm run build
npm run preview
```

## Datos de prueba

### Inicio de sesión

El servicio es simulado y solo acepta estas credenciales:

| Campo      | Credencial válida |
| ---------- | ----------------- |
| Correo     | demo@kambista.com |
| Contraseña | Demo1234!         |

Un correo o contraseña distintos muestran un error de credenciales. Al iniciar
sesión se abre el formulario de perfil.

### Perfil

Usa estos valores para completar el recorrido:

| Campo                      | Valor de prueba |
| -------------------------- | --------------- |
| Nombres completos          | María López     |
| Tipo y número de documento | DNI · 87654321  |
| Celular                    | 987654321       |
| Fecha de nacimiento        | 1990-06-15      |
| Términos y condiciones     | Aceptados       |
| Política de datos          | Opcional        |

Casos de error simulados:

| Campo   | Valor que activa el error | Resultado       |
| ------- | ------------------------- | --------------- |
| DNI     | 12345678 con tipo DNI     | `DUPLICATE_DNI` |
| Celular | 999999999                 | `INVALID_PHONE` |

Las demás validaciones se ejecutan mientras se escribe: nombre con letras y
espacios; DNI de 8 dígitos; CE de 9 dígitos; pasaporte alfanumérico de 8 a 15
caracteres; celular de 9 dígitos; y fecha válida para una persona adulta. Los
enlaces de términos y política abren modales con contenido demostrativo. El
selector de fecha incluye años hasta el actual y no permite fechas futuras; el
formulario sigue rechazando fechas que no cumplan la mayoría de edad.

### Operación

- Los selectores de banco y origen de fondos usan los datos de
  [`mocks/bankAccounts.json`](../mocks/bankAccounts.json) y
  [`mocks/sourceFunds.json`](../mocks/sourceFunds.json), respectivamente.
- Para probar una cuenta receptora, selecciona **BCP**, tipo **Ahorros** o
  **Corriente**, moneda de destino, número `001234567890` y alias opcional
  `Mi BCP`. Marca la declaración de titularidad.
- El número de cuenta se conserva como texto para mantener ceros iniciales.
  Las cuentas disponibles se filtran por la moneda que recibirá el usuario.
- Se aceptan constancias PNG, JPEG, WebP, PDF, DOC y DOCX de hasta 10 MB.
- La cuenta de Kambista mostrada en la transferencia (`20101000000000`,
  RUC `20601708141`, titular `Kambista SAC`) es un dato demostrativo tomado
  de la referencia visual. No debe usarse para hacer pagos reales.

## Recorrido de operación

1. Completa el perfil y continúa desde felicitaciones hacia Inicio.
2. La calculadora comienza en USD → PEN. Cambia cualquiera de los selectores,
   invierte con las flechas o elige Compra (USD → PEN) / Venta (PEN → USD).
3. Escribe, por ejemplo, 100. El monto recibido es `exchange`; el ahorro viene
   de `savings.amount`. Las tasas actuales se muestran en ambas pestañas.
4. Inicia la operación y elige el banco desde el cual enviarás tu dinero.
5. Abre la cuenta receptora. Si no tienes una, elige Agregar cuenta. Usa tipo
   Ahorros o Corriente, banco BCP, número `001234567890`, alias opcional
   `Mi BCP` y marca la declaración de titularidad.
6. La cuenta queda seleccionada. Elige Ahorros como origen de fondos y continúa.
7. Revisa los datos y pulsa Ya hice mi transferencia.
8. Adjunta PNG, JPEG, WebP, PDF, DOC o DOCX de hasta 10 MB y envía la constancia.
9. Revisa el resumen y vuelve a Inicio. En desktop, el menú del nombre contiene
   Cerrar sesión; en móvil está dentro del menú principal.

Si cambias la moneda y no tienes una cuenta compatible, debes crear una antes de
continuar.

## Decisiones técnicas

- **Módulos por dominio:** `auth`, `onboarding` y `transactions` encapsulan
  componentes, composables, servicios, schemas, tipos y constantes. Las páginas
  de Nuxt se limitan a conectar las vistas; la lógica de formularios y operaciones
  vive en sus módulos.
- **Formularios tipados:** Vee Validate gestiona el estado de los formularios y
  Zod define sus reglas. Los tipos TypeScript se infieren de esos schemas.
- **Estado y persistencia acotados:** `useState` comparte el estado de sesión y
  operación compatible con Nuxt. La sesión y la operación activa se persisten en
  `sessionStorage`; las cuentas guardadas se aíslan por correo en `localStorage`
  mediante la clave versionada `kambista.accounts.v1:<correo>`. Cerrar sesión
  limpia la sesión y la operación, pero conserva las cuentas.
- **Cotizaciones consistentes:** el cálculo se demora 300 ms mientras el usuario
  escribe y se cancela la solicitud anterior con `AbortController`. Solo la
  respuesta vigente actualiza el resultado. Si falla la API, se muestra el error,
  se ofrece reintentar y no se inventan tasas de respaldo.
- **Mocks explícitos:** autenticación y registro simulan éxito y errores conocidos;
  bancos y orígenes de fondos vienen de los JSON del reto. No se simulan APIs de
  transferencias ni carga de constancias.
- **Seguridad de la demostración:** el middleware protege las rutas para el flujo
  de navegación, pero el login y los datos del navegador no constituyen
  autenticación segura para producción. La cuenta de Kambista y los datos
  bancarios son fixtures; los archivos adjuntos solo permanecen en memoria y no
  se guardan ni se envían.

## APIs

Se conserva Montserrat mediante `@fontsource/montserrat`, con licencia OFL-1.1.
La aprobación de OFL-1.1 y de MPL-2.0 (Lightning CSS, incorporado por el tooling
de Nuxt, Vite y Tailwind) sigue pendiente del responsable de la política de Kambista.

La aplicación consume estos endpoints públicos:

| Uso                | Endpoint                                                    | Parámetros                                                    |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Tasas actuales     | `GET https://api.kambista.com/v1/exchange/kambista/current` | Ninguno                                                       |
| Calcular operación | `GET https://api.kambista.com/v1/exchange/calculates`       | `originCurrency`, `destinationCurrency`, `amount`, `active=S` |

El cálculo admite PEN → USD y USD → PEN. La respuesta se valida antes de
utilizarse; `exchange` es el monto recibido y `savings.amount` el ahorro. No se
utilizan Axios ni endpoints propios de Nuxt para este flujo.

## Validaciones automatizadas

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run lint
npm run test:e2e
npm run test:e2e:report
```

Vitest ejecuta las pruebas unitarias con Vue Test Utils. `__tests__/unit/`
refleja la estructura de `app/`, con `modules/`, `middleware/` y `shared/`.
Los archivos están separados por schema, servicio, composable o componente.
El reporte se genera en `coverage/`.

Los recorridos completos se prueban con Playwright en `__tests__/e2e/`, organizado
con la misma estructura. Los helpers compartidos están en `__tests__/e2e/support/`.
Se comprueban las rutas reales y el middleware del navegador. HTTP usa respuestas
simuladas para que los escenarios sean reproducibles. La cobertura de Vitest
corresponde a las unitarias y se complementa con los E2E.

Playwright usa Google Chrome instalado, inicia su propio servidor en el puerto
3100 y aísla sus archivos de Nuxt en `.cache/nuxt-e2e`. Si no tienes Chrome,
instálalo o configura el canal de Chromium en playwright.config.ts.

La suite cubre desktop (1440 px), móvil (390 px), credenciales, validaciones,
consentimientos, errores de registro, cotizaciones en ambas direcciones, ahorro
cero, errores y reintentos, cancelaciones, respuestas fuera de orden, cuentas por
moneda, persistencia, archivos inválidos/grandes y recorrido hasta cerrar sesión.

La prueba externa se activa expresamente; no utiliza interceptores:

```powershell
$env:RUN_LIVE_API = '1'
npm run test:e2e -- __tests__/e2e/modules/transactions/services/exchange-live.spec.ts --project=desktop
```
