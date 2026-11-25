# Kambista React Native

Aplicación del reto Kambista para Android, iOS y web. El recorrido va del inicio de sesión al
registro, la cotización, el alta de cuentas, la transferencia simulada y el resumen de la
constancia.

## Ejecutar con npm

Requiere npm y una versión de Node.js compatible con Expo SDK 58, como 22.13+, 24.3+ o 26.x. Conserva `app/` y
`mocks/` en el mismo repositorio, ya que Metro importa los catálogos de la carpeta hermana.

```bash
cd app
npm ci
npm run start
```

| Plataforma | Comando | Entorno |
| --- | --- | --- |
| Web | `npm run web` | Navegador |
| Android | `npm run android` | Emulador configurado en Android Studio o dispositivo compatible |
| iOS | `npm run ios` | Simulador con Xcode en macOS o dispositivo compatible |

Expo Go requiere una versión que admita el SDK del proyecto. Para iOS fuera de macOS se puede
usar un dispositivo compatible o una compilación remota con EAS.

## Datos de prueba

### Inicio de sesión

El login simulado acepta `demo@kambista.com` con contraseña `Demo1234!`. Otras credenciales
activan el mensaje de error del servicio.

### Perfil

| Campo | Ejemplo | Regla |
| --- | --- | --- |
| Nombres completos | María López | Letras, tildes y espacios |
| Documento | DNI · 87654321 | DNI de 8 dígitos, CE de 9 o pasaporte alfanumérico de 8 a 15 caracteres |
| Celular | 987654321 | 9 dígitos |
| Fecha de nacimiento | 1990-06-15 | Fecha civil válida para una persona de 18 años o más |
| Términos | Aceptados | Obligatorios |
| Política de datos | Sin marcar | Opcional |

Puedes variar los datos del perfil. Con tipo DNI, `12345678` activa `DUPLICATE_DNI`.
El celular `999999999` activa `INVALID_PHONE`. Tras un rechazo puedes corregir el campo
y volver a enviar el formulario.

Para la fecha, abre el calendario, pulsa el mes o el año del encabezado y elige una opción.
Puedes buscar el año por sus dígitos. Selecciona el día y pulsa **Aceptar**. **Cancelar**
y **Cerrar** conservan el dato anterior.

El selector ofrece años desde 1900 hasta el actual y permite fechas hasta hoy.
La mayoría de edad se valida en el formulario, mostrando un error si la fecha
corresponde a una persona menor de 18 años.

### Operación

- Los bancos y orígenes de fondos provienen de [bankAccounts.json](../mocks/bankAccounts.json)
  y [sourceFunds.json](../mocks/sourceFunds.json).
- Para una cuenta, prueba BCP, Ahorros o Corriente y número `001234567890`.
  El alias es opcional y la declaración de titularidad es obligatoria.
- Se admiten constancias PNG, JPG, JPEG, WebP, PDF, DOC y DOCX de hasta 10 MB.
- La transferencia muestra los datos demostrativos `20101000000000`, RUC `20601708141`,
  titular Kambista SAC. Úsalos exclusivamente para probar el recorrido.

## Recorrido de operación

1. Inicia sesión, completa el perfil y continúa desde la pantalla de felicitaciones.
2. En Inicio, elige USD → PEN o PEN → USD e ingresa un monto, por ejemplo 100.
3. Con una cotización válida, inicia una operación y elige el banco de envío.
4. Abre el selector de cuenta receptora y elige **Agregar cuenta**. Usa la moneda que
   recibirás, elige un banco y tipo, escribe el número y marca la titularidad.
5. Guarda la cuenta. El flujo la selecciona automáticamente y conserva la cotización.
   Elige el origen de fondos y continúa.
6. Revisa los datos, prueba la copia al portapapeles y pulsa **Ya hice mi transferencia**.
7. Selecciona una constancia con el selector del sistema y envíala.
8. Revisa el resumen, vuelve a Inicio y cierra la sesión desde el menú de usuario.

Si inviertes la dirección, se ofrecen las cuentas de la nueva moneda de destino.

## Decisiones técnicas

- Expo Router conecta las rutas con pantallas de los módulos `auth`, `onboarding`
  y `transactions`. Los hooks coordinan navegación, validación y servicios.
- React Hook Form conserva los campos y sus errores. Yup valida los formularios.
  Los componentes compartidos usan NativeWind y se conectan a los campos mediante
  `useController`. El calendario administra su selección temporal y recibe sus
  límites como propiedades. Onboarding decide si la persona es mayor de edad.
- Zustand mantiene sesión, cuentas, tasas y operación en memoria. Recargar o
  reiniciar descarta ese estado. Volver a Inicio desde el resumen limpia el borrador.
- La cotización espera 300 ms tras un cambio de entrada, cancela la solicitud
  anterior y descarta respuestas obsoletas. Los errores permiten reintentar.
- La transferencia y el envío son simulados. La confirmación conserva en memoria
  el nombre y tamaño de la constancia durante la operación.

## APIs

Se conserva Montserrat con su archivo de licencia OFL-1.1. La aprobación de
OFL-1.1 y de MPL-2.0 (Lightning CSS, requerido por el tooling de Expo y
NativeWind) sigue pendiente del responsable de la política de Kambista.

| Uso | Endpoint | Parámetros |
| --- | --- | --- |
| Tasas actuales | `GET https://api.kambista.com/v1/exchange/kambista/current` | Ninguno |
| Cotización | `GET https://api.kambista.com/v1/exchange/calculates` | `originCurrency`, `destinationCurrency`, `amount`, `active=S` |

Axios consulta los endpoints públicos. Las tasas y el cálculo se validan antes de
mostrarse. `exchange` es el importe recibido y `savings.amount` es el ahorro si la API
lo incluye. El login y el registro usan servicios simulados del proyecto. Las cuentas
se guardan localmente en el store y el envío de la constancia confirma el flujo en memoria.

## Validaciones automatizadas

Desde `app/`:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:coverage
```

Jest usa el preset de Expo y React Native Testing Library. Las pruebas son unitarias.
Se organizan en `__tests__/unit/` reflejando `src/`, con carpetas `app/`,
`modules/auth/`, `modules/onboarding/`, `modules/transactions/` y `shared/`.
Cada archivo corresponde al schema, servicio, store, hook o componente que verifica.
Las utilidades de pruebas compartidas viven en `__tests__/support/`.

Se cubren reglas de validación, errores de servicios y reintentos, cotizaciones,
cuentas, constancias, orden de la operación, redirecciones y cierre de sesión.
Los hooks de formularios y navegación se prueban por separado con servicios o
router simulados. Los componentes se renderizan de forma aislada dentro de Jest.
El reporte de cobertura queda en `coverage/lcov-report/index.html`.
[Configuración de Jest para Expo](https://docs.expo.dev/develop/unit-testing/).

## Android APK con EAS

El perfil `preview` de [eas.json](./eas.json) genera un APK de distribución interna.
Necesitas una cuenta de Expo con acceso al proyecto EAS, EAS CLI 16 o posterior,
un identificador Android (`expo.android.package`) y una clave de firma. En la primera
configuración, EAS puede enlazar el proyecto y generar o reutilizar las credenciales.

```bash
cd app
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform android --profile preview
```

Conserva el proyecto y los catálogos en la raíz Git al enviar el código a EAS. Tras una
compilación correcta, el panel de EAS proporciona la descarga del APK.

[Guía de APK de Expo](https://docs.expo.dev/build-reference/apk/) · [EAS en monorepos](https://docs.expo.dev/build-reference/build-with-monorepos/).
