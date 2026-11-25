# Kambista — Mobile Design System

> Especificación visual y de interacción para React Native + Expo. Estado: referencia de implementación basada en 20 capturas de 390 × 844 px de la carpeta design. Idioma de interfaz: español (Perú).

## 1. Propósito y fuentes de verdad

La aplicación es una adaptación móvil del producto web existente en Vue, no un rediseño de marca ni una copia literal del DOM. Conservar identidad, contenido, jerarquía, comportamiento y reglas de negocio; adaptar interacción, navegación y controles a iOS y Android.

- Leer `AGENTS.md` y las skills aplicables de `.agents/` antes de modificar código.
- Este documento gobierna presentación e interacción; las capturas gobiernan la fidelidad visual.
- Consultar el proyecto Vue para flujos, validaciones, permisos, estados, textos y reglas de negocio. No modificarlo.
- Consultar `README.md` de la raíz y mocks existentes para contratos, servicios y escenarios. No inventar endpoints ni campos.
- Reutilizar arquitectura, componentes, dependencias, iconos, fuentes y assets existentes. NativeWind, Expo Router, TypeScript, Zustand y React Hook Form son referencias del stack móvil; verificar su configuración real antes de implementar.
- Si hay contradicciones, no alterar reglas de negocio para igualar una captura. Documentar discrepancias. Las cifras y datos personales de las imágenes son ilustrativos, nunca datos de producción ni constantes del dominio.

## 2. Dirección visual

Interfaz fintech limpia, sobria, ligera y confiable. Fondos claros, superficies blancas, azul marino profundo para contenido y turquesa para llamadas a la acción. Evitar gradientes decorativos, glassmorphism, sombras intensas, tarjetas anidadas innecesarias, emojis como iconos, tipografías genéricas y patrones de dashboard web.

Conservar la identidad de Kambista y los recursos de marca disponibles. No dibujar un logo alternativo ni sustituir las ilustraciones por emojis. Si falta un asset, documentarlo y usar un placeholder temporal claramente identificado en desarrollo.

## 3. Design tokens

### 3.1 Colores

Los colores marcados como observados fueron extraídos de píxeles de las capturas; los propuestos son valores iniciales de implementación, sujetos a contraste y al sistema original de marca.

| Token | HEX | Uso | Origen |
|---|---|---|---|
| `primary` | `#00E3C2` | CTA activo | Observado |
| `primary.disabled` | `#9DEEDC` | CTA inactivo en autenticación | Observado |
| `primary.disabledOperation` | `#9CEFE5` | CTA inactivo en operación | Observado |
| `primary.pressed` | `#00CDB0` | Feedback táctil | Propuesto |
| `ink` | `#060F26` | Texto, iconos, segmentos activos | Observado |
| `background` | `#F6F6F9` | Fondo operativo | Observado |
| `surface` | `#FFFFFF` | Cards, sheets, autenticación | Observado |
| `text.secondary` | `#666666` | Etiquetas y notas | Observado |
| `text.placeholder` | `#A6A6A6` | Placeholder, pasos pendientes | Propuesto |
| `text.disabled` | `#686868` | Texto de CTA inactivo | Observado / adaptación |
| `border` | `#E0E0E0` | Inputs y separadores | Observado |
| `border.card` | `#E0E4EB` | Cards de transferencia y constancia | Observado |
| `surface.muted` | `#E0E0E0` | Campos monetarios de calculadora | Observado |
| `info.surface` | `#D2E9FF` | Mensajes informativos | Observado |
| `info.ink` | `#092866` | Texto e icono informativo | Propuesto |
| `warning.surface` | `#F9F0E9` | Advertencias | Observado |
| `warning.ink` | `#804000` | Texto e icono de advertencia | Propuesto |
| `danger` | `#D92D3A` | Errores y tasa anterior | Propuesto |
| `picker.selection` | `#EFF0F6` | Fila seleccionada en wheel picker | Observado |
| `overlay` | `rgba(0,0,0,0.60)` | Backdrop de sheets | Aproximado |

Centralizar tokens en el tema existente (NativeWind/configuración de estilos). No repetir hexadecimales en pantallas. Si el proyecto tiene tokens equivalentes, mapearlos en vez de duplicarlos. Los dos tonos disabled pueden unificarse si el sistema de marca lo exige. Tema claro como alcance de estas referencias; no inventar dark mode.

### 3.2 Tipografía

Prioridad: fuente original del proyecto Vue o assets de marca; alternativa propuesta Montserrat. Cargar variantes reales Regular 400, Medium 500, SemiBold 600 y Bold 700 mediante el mecanismo de fuentes del proyecto. Evitar pesos sintetizados cuando se disponga del archivo original. No bloquear indefinidamente la app si falla la carga.

| Rol | Tamaño / line-height (dp) | Peso |
|---|---|---|
| Hero de éxito | 24 / 30 | 700 |
| Título de pantalla destacado | 20 / 26 | 700 |
| Título de header | 15 / 20 | 700 |
| Título de sección / modal | 16–20 / 22–26 | 600–700 |
| Monto calculadora | 20 / 26 | 700 |
| Body | 14–16 / 20–22 | 400–500 |
| Input y select | 14–16 / 20 | 400–500 |
| Label | 14 / 20 | 400–500 |
| Valor financiero | 14–16 / 20 | 700 |
| CTA | 14 / 20 | 500–600 |
| Caption / alerta | 12–13 / 16–18 | 400–500 |
| Tab label | 12 / 16 | 500 |

Usar cifras tabulares cuando la fuente las soporte. No desactivar escalado accesible de texto globalmente; permitir que el contenido crezca y haga scroll. Los tamaños son orientativos, no mediciones de archivos de fuente.

### 3.3 Espaciado y geometría

Escala base en dp: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64`.

| Propiedad | Valor recomendado |
|---|---|
| Padding horizontal autenticación | 24 |
| Padding horizontal operación | 28–32 |
| Padding horizontal calculadora | 24 |
| Padding interno card | 16–24 |
| Padding sheet | 16–24 |
| Separación label/control | 6–8 |
| Separación campos | 16–20 |
| Separación secciones | 20–24 |
| Alto input estándar | mínimo 44, preferido 48–50 |
| Alto CTA | 50–52 |
| Radio input | 8–10 |
| Radio botón | 8–10 |
| Radio card | 8–12 |
| Radio superior sheet | 20 |
| Borde normal | 1 |
| Iconos | 18–24 |
| Área táctil mínima | 44 × 44 iOS, 48 × 48 Android |

Usar flexbox, anchos fluidos y minHeight. No escalar toda la UI proporcionalmente al ancho ni posicionarla mediante coordenadas absolutas de capturas. Las imágenes son una referencia de composición en 390 × 844, no una restricción de viewport.

## 4. Layout móvil y navegación

- Safe areas reales mediante la solución instalada; no reproducir barras de estado, reloj 9:41, gestos o barra inferior del sistema dentro de JSX.
- Header centrado con título y botón de retroceso; acción de salir en completar perfil donde corresponda. Mantener centrado aunque los controles laterales sean asimétricos.
- Pantallas de autenticación y creación de perfil: fondo blanco. Operaciones y calculadora: fondo `background`.
- Scroll vertical natural; contenido y CTA nunca deben quedar ocultos por teclado, safe area ni navegación inferior.
- En formularios cortos conservar el aire visual de las referencias; en pantallas pequeñas permitir scroll en lugar de comprimir controles.
- CTA inferior según pantalla: usar flujo normal o footer dentro del layout, sin superponer campos. No forzar footer flotante si no aporta valor.
- Bottom tabs de inicio: Inicio, Historial, Cuentas, Koinks (verificar nombre real en Vue), Perfil. Iconos lineales consistentes, activo marino, inactivo gris. No inventar pantallas o funciones de tabs ausentes en las referencias.
- Navegación de operación a pantalla completa, sin tab bar. Respetar guards, historial y flujo existente.
- Gestionar teclado con los mecanismos de RN disponibles; scroll al campo enfocado, dismiss al tocar fuera cuando corresponda, `keyboardShouldPersistTaps` según necesidades.

## 5. Componentes compartidos

Los nombres siguientes describen responsabilidades; adaptar a la convención real de archivos. Evitar crear componentes duplicados. Separar presentación de hooks y servicios.

### 5.1 Button

CTA principal: fondo turquesa, texto marino, ancho completo habitual, alto 50–52, radio 8–10, texto de acción breve en mayúsculas como en las referencias. Sin sombra por defecto.

Variantes: primary, secondary/outlined, text, icon. Estados: default, pressed, disabled, loading. Disabled no ejecuta acciones; loading conserva dimensiones, impide duplicados y muestra indicador accesible. Habilitar según validez real y estado de negocio, no según valores de ejemplo en una captura.

### 5.2 TextField / PasswordField / CurrencyField

Label visible encima; placeholder no reemplaza label. Fondo blanco, borde gris, radio 8–10, padding horizontal 14–16. Texto marino. En foco, borde marino o indicador accesible; error con borde y mensaje breve; disabled con semántica accesible. Evitar saltos de layout excesivos.

PasswordField: icono ojo al final, alterna `secureTextEntry` sin borrar valor; accesible para lectores de pantalla. Correo sin autocapitalización; teléfono y documento con teclado adecuado al contrato; no restringir pasaporte a números si el negocio admite letras. CurrencyField admite decimales, conserva texto editable y delega cálculos a la lógica existente. No usar operaciones flotantes ingenuas para liquidaciones monetarias.

### 5.3 SelectField + SelectionSheet

Control cerrado: label, valor o placeholder, chevron hacia abajo, misma geometría que TextField. El control completo es táctil, no un input de texto falso ni un dropdown HTML.

Patrón recomendado para modernización:

- Listas de bancos y cuentas: bottom sheet blanco, esquinas superiores 20, backdrop oscuro, encabezado, divisor y filas de mínimo 48 dp. Altura según contenido, máximo aproximado 85–90% de área útil; lista desplazable. Selección visible mediante check o énfasis marino. Búsqueda opcional solo si la lista extensa lo justifica; no alterar el catálogo.
- Documento, origen de fondos y tipo de cuenta: picker nativo tipo rueda con Aceptar/Cancelar cuando convenga, o sheet compacto de selección única con el mismo lenguaje visual. La referencia muestra rueda en iOS; Android puede usar un equivalente nativo coherente. Preferir sheet uniforme si la biblioteca actual lo soporta y la fidelidad sigue siendo alta.
- En selección simple de lista, confirmar al tocar si coincide con el comportamiento real. En pickers con Aceptar/Cancelar, mantener valor temporal y confirmar únicamente en Aceptar. Cancelar no altera el formulario.
- Soportar cerrar por back, backdrop o gesto cuando no se pierdan cambios; formularios con cambios deben seguir política de descarte existente. Devolver foco al control al cerrar.
- Cuentas destino: mostrar alias, banco, moneda y cuenta enmascarada. Acción visible `Agregar cuenta` con icono plus. Tras guardar, actualizar lista mediante el flujo real; seleccionar nueva cuenta solo si corresponde a la lógica web.
- Estados de lista: loading, empty, error con reintento, selección y disabled. No crear bancos ni opciones ficticias fuera de mocks autorizados.
- Evitar modales nativos de alerta usados como listas, selects web incrustados o pickers con estilos incongruentes. Evitar agregar otra librería de sheets si ya existe una adecuada.

### 5.4 DateField / DatePicker

La captura solo define el campo cerrado `DD/MM/AAAA`; el picker abierto es una adaptación propuesta.

- Misma apariencia que un input, apertura táctil, icono calendario discreto opcional si armoniza con diseño.
- Para nacimiento, usar selector de fecha nativo o modal/sheet con selector de año, mes y día; facilitar saltar décadas sin deslizar cientos de meses.
- Mostrar fecha en `DD/MM/AAAA`; serializar según contrato API. Tratar fecha de nacimiento como fecha civil, sin desplazamientos por UTC.
- Aceptar y Cancelar con estado temporal cuando se requiera confirmación. No asignar una fecha por defecto al formulario solo por abrir el picker.
- Impedir fechas futuras en nacimiento; edad mínima y límites exactos según reglas existentes, sin inventarlos.
- Si se permite escribir manualmente, validar fechas reales y bisiestos; evitar aceptar texto parcial como fecha válida.
- Verificar compatibilidad de la librería con Expo y la configuración actual antes de instalar.

### 5.5 Checkbox / Consent

Cuadro de 16–18 dp, borde gris, seleccionado marino con check blanco; ampliar área de toque sin aumentar necesariamente el dibujo. Texto 12–14, links subrayados con peso 600–700. Los enlaces legales deben ser accesibles independientemente del toggle. No preseleccionar consentimientos ni confundir recordar sesión con aceptar términos. Respetar persistencia y flujos reales.

### 5.6 Alert / InfoBanner

Card suave, padding 12–16, radio 10–12, icono información a izquierda, texto alineado a izquierda. Info usa azul claro y texto azul; warning usa crema y texto marrón. Resaltar palabras clave, no párrafos enteros. Permitir varias líneas sin truncar. Error debe usar texto explícito, no depender del color.

### 5.7 OperationStepper

Tres pasos: Completa → Transfiere → Constancia. Línea horizontal y tres nodos (aprox. 9–10 dp), etiquetas debajo de 12–13 dp, peso 600–700. Activos/completados marino, pendientes gris. Línea progresa según estado confirmado. No convertir los pasos en tabs navegables si el flujo no permite saltarlos. Exponer paso actual al lector de pantalla.

### 5.8 SummaryCard / DetailRow / CopyField

Card blanca con filas label izquierda y valor derecha, valores en negrita. Separador antes de tipo de cambio. Tasa anterior tachada en rojo si aplica cupón; tasa efectiva marino. Ocultar elementos no aplicables según lógica real.

Para datos bancarios usar label gris, valor marino destacado, icono copiar al lado. Copiar valor exacto desde datos de la operación, con feedback accesible; no incluir separadores de formato que impidan pegar cuando corresponda. No copiar datos de la captura.

### 5.9 FileUpload

Contenedor con borde y radio, label, botón de selección, icono archivo/imagen, nombre de archivo seleccionado y opción de reemplazo si corresponde. Mostrar validación, progreso, error y reintento. Referencia indica máximo 10 MB y archivos imágenes, Word y PDF; verificar límites y formatos exactos en README/Vue. No asumir MIME ni extensiones adicionales. Solicitar permisos solo cuando sean necesarios. No mostrar éxito hasta recibir confirmación del servicio.

### 5.10 CurrencyCalculator / SegmentedControl / BottomTabBar

Segmentos de compra/venta con fondo marino en el activo y texto blanco; inactivo blanco/gris. Campo monetario en gris claro y selector de moneda en marino. Swap central circular blanco con icono de intercambio y halo discreto como referencia. Cupón: input y botón APLICAR agrupados, sombra leve permitida en ese componente. Usar controles de selección reutilizables. BottomTabBar con cinco acciones y safe area; respetar navegación existente.

## 6. Especificaciones por pantalla

### 6.1 Login

Referencias: `Login.png`, `datos completados.png`, `mostrar contraseña.png`.

- Fondo blanco, logo centrado (ancho visual aproximado 210 dp), título Inicia sesión y espacio generoso antes del formulario.
- Correo, contraseña, fila Recordarme / ¿Olvidaste tu contraseña?, CTA INICIA SESIÓN y link Regístrate aquí.
- Reproducir estados vacío, completado, contraseña visible, inválido, loading y error de servicio. El CTA sigue validación real, no la visibilidad de contraseña.
- En 390 × 844, logo cerca del primer quinto y CTA cerca del cuarto inferior; usar distribución flexible, no coordenadas fijas.
- No almacenar contraseña en estado persistente ni mostrar credenciales de ejemplo en producción.

### 6.2 Completar perfil

Referencias: `Completar datos.png`, `Completar datos-1.png`, `Completar datos-2.png`, `Completar datos-3.png`.

- Header Completa tus datos con back y salida. Introducción centrada con énfasis en documento de identidad.
- Nombres completos a ancho completo. Fila Documento: selector de tipo ~40%, número ~60%, gap 8.
- Banner azul de coincidencia de identidad.
- Fila celular y fecha de nacimiento ~50/50; apilar en pantallas estrechas o texto ampliado si es necesario.
- Checkboxes de términos y política de tratamiento de datos con links. CTA REGISTRARME.
- Selector de documento muestra DNI, CCE y Pasaporte en referencia; usar catálogo real. Respetar validación por documento y estado de consentimiento.
- La captura con campos incompletos y CTA activo es solo visual; no reproducir esa inconsistencia en validación.

### 6.3 Perfil creado con éxito

Referencia: `página de éxito.png`.

- Header Perfil creado con éxito; ilustración original de mano con teléfono centrada.
- Título grande en dos líneas con nombre dinámico; descripción gris centrada; CTA CONTINUAR.
- Aire visual generoso, fondo blanco, sin navegación que permita repetir accidentalmente registro. Navegar según flujo confirmado.

### 6.4 Inicio / Calculadora

Referencia: `calculadora.png`.

- Fondo gris claro, logo compacto centrado arriba.
- Card blanca con tabs Compra/Venta y tasas dinámicas; dos campos monetarios apilados, moneda a derecha y swap en la intersección.
- Etiquetas ¿Cuánto envías? y Entonces recibes. Montos grandes y de alto contraste; moneda y dirección provienen del estado real.
- Fila de ahorro estimado y Koins, cupón con APLICAR, promoción de tipo preferencial si aplica. CTA INICIAR OPERACIÓN fuera de la card.
- Tab bar inferior. No fijar tasas, ahorros, umbrales promocionales ni montos de la captura. Respetar bid/ask, redondeo, moneda y elegibilidad de cupón según servicio/Vue.
- Evitar recalcular o disparar solicitudes por cada render; aplicar la estrategia de actualización definida por la arquitectura existente.

### 6.5 Operación — Completa los datos

Referencias: `Completa los datos.png`, `Completa los datos-1.png`, `Completa los datos-2.png`, `Completa los datos-3.png`, `Completa los datos-4.png`, `banco de envío.png`, `cuenta destino.png`.

- Header Completa los datos + stepper paso 1.
- SummaryCard con Tú envías, Tú recibes, Cupón aplicado y Tipo de cambio utilizado.
- Banner de tiempo estimado, texto o enlace según versión/flujo web. No hardcodear tiempos ni bancos.
- Select banco origen, select cuenta destino, warning de titularidad, select origen de fondos, CTA CONTINUAR.
- Mostrar estados sin seleccionar, parcial y completo; conservar datos al volver cuando el flujo lo permita.
- Banco abre SelectionSheet desplazable; cuenta destino muestra cuentas compatibles y Agregar cuenta; origen de fondos abre selector compacto.
- Validar titularidad, moneda, compatibilidad y campos requeridos según negocio. Deshabilitar CTA hasta que el formulario esté listo.

### 6.6 Agregar cuenta bancaria

Referencia: `crear cuenta.png`.

- Sheet alto sobre pantalla operativa, backdrop oscuro, título Agregar cuenta soles (moneda dinámica), divisor y aviso de titularidad.
- Tipo de cuenta bancaria, entidad financiera, banner informativo, segmento SOLES/DÓLARES, número de cuenta, alias, checkbox Declaro que esta cuenta es mía y CTA GUARDAR CUENTA.
- Campos en scroll, CTA accesible con teclado visible. Respetar moneda fija o editable según contexto. Reglas de número, tipo, banco, titularidad y alias proceden del flujo web.
- Abrir selects dentro del formulario sin perder datos ni producir stacks de modales incontrolables. Tras guardado exitoso, sincronizar cuentas y volver al flujo correspondiente.

### 6.7 Operación — Transfiere a Kambista

Referencia: `validar datos.png`.

- Header + stepper paso 2. Fila superior de aviso sobre actualización de tasa con contador/hora alineada a derecha.
- Card blanca con borde, ilustración billetera, instrucciones y énfasis subrayado en número o código de operación.
- Card interior de datos: banco, monto, número de cuenta, RUC, titular, tipo de cuenta. Iconos copiar en campos aplicables.
- CTA YA HICE MI TRANSFERENCIA. Temporizador y expiración deben seguir datos/reglas reales, no simular garantía de tasa ni codificar hora 13:15.
- No almacenar información bancaria sensible en logs. No iniciar transferencia bancaria automática por tocar el CTA salvo que el producto lo contemple explícitamente.

### 6.8 Operación — Envía tu constancia

Referencia: `Subir constancia.png`.

- Header + stepper paso 3. Card blanca con borde, ilustración de comprobante y texto de instrucciones.
- FileUpload con límite de archivo y bloque Recuerda: monto, beneficiario, fecha/hora, legibilidad y formatos admitidos según contrato.
- CTA ENVIAR CONSTANCIA, estados de selección/carga/error/reintento y bloqueo de envío duplicado.
- Si el flujo real requiere código de operación u otros campos no visibles, incorporarlos de forma consistente sin inventar el contrato.

### 6.9 Constancia enviada

Referencia: `Constancia enviada.png`.

- Fondo operativo, card blanca centrada con ilustración de éxito, título ¡Constancia enviada!, divisor y datos dinámicos: código Kambista, monto a recibir y tiempo estimado de espera.
- Banner promocional original debajo si existe y aplica; texto explicativo sobre verificación y Mis operaciones.
- CTA VOLVER A INICIO. No presentar la operación como liquidada si solo se recibió el comprobante. No usar código ni monto de ejemplo.

## 7. Accesibilidad y calidad de interacción

- Contraste objetivo WCAG AA: 4.5:1 para texto normal y 3:1 para texto grande y componentes relevantes. Validar especialmente grises y estados de foco; ajustar valores aproximados cuando sea necesario.
- `accessibilityLabel`, `accessibilityRole`, `accessibilityState` según componente. Anunciar errores, progreso, selección y confirmaciones cuando corresponda.
- No depender exclusivamente del color: usar texto, iconos, marcas o semántica para error y selección.
- Soportar tamaño de fuente aumentado, TalkBack y VoiceOver, teclado abierto, dispositivos compactos y pantallas altas.
- Animaciones discretas propuestas: 150–250 ms para feedback y 200–300 ms para sheets; respetar reducción de movimiento. No animar montos de manera que dificulte su lectura.
- Evitar scroll anidado innecesario, listas sin virtualización cuando sean grandes, layouts rígidos y cambios bruscos de altura.
- Datos sensibles enmascarados cuando corresponda. No capturar contraseñas, documentos o cuentas completas en telemetría. Usar los mecanismos de seguridad y almacenamiento definidos en AGENTS.md.

## 8. Estrategia de implementación

1. Revisar reglas, skills, tema, assets y componentes existentes.
2. Mapear cada pantalla móvil a su funcionalidad Vue y a contratos/mocks de la raíz.
3. Implementar o ajustar tokens y primitivas compartidas sin duplicar el sistema existente.
4. Construir pantallas de forma incremental; integrar hooks, formularios, servicios y navegación definidos por el proyecto.
5. Mantener componentes visuales desacoplados de lógica de dominio. Reutilizar schemas y tipos; no inventar payloads.
6. Validar visualmente a 390 × 844 y probar al menos un dispositivo compacto y otro grande, iOS y Android según disponibilidad.
7. Ejecutar scripts existentes de typecheck, lint y tests; no afirmar que pasaron si no se ejecutaron. Probar estados y flujo completo con mocks autorizados y APIs cuando estén disponibles.

No introducir dependencias por estética sin revisar las existentes. Si se requiere una librería, justificar compatibilidad Expo, accesibilidad y mantenimiento. No cambiar la arquitectura ni refactorizar módulos fuera del alcance.

## 9. Definition of Done

- [ ] AGENTS.md y skills aplicables respetados.
- [ ] Tema centralizado y assets oficiales reutilizados.
- [ ] Fidelidad a capturas en composición, tipografía, jerarquía y color.
- [ ] Selects, date picker y sheets funcionan como controles móviles accesibles.
- [ ] Estados default, focus, pressed, selected, disabled, loading, error y empty cubiertos cuando aplican.
- [ ] Safe areas, teclado, scroll, texto ampliado y navegación probados.
- [ ] Validaciones y reglas equivalentes a Vue; contratos respetados.
- [ ] Sin datos de ejemplo hardcodeados, credenciales ni cuentas de captura.
- [ ] Sin nuevas dependencias injustificadas ni componentes duplicados.
- [ ] Verificaciones técnicas ejecutadas o limitaciones documentadas.
- [ ] Diferencias visuales/funcionales justificadas y pendientes reportados.

## 10. Alcance y decisiones pendientes

Las 20 capturas cubren login, completar perfil, éxito de perfil, calculadora, completar operación, selección bancaria, cuenta destino, alta de cuenta, transferencia, carga de constancia y confirmación. No definen el contenido de Historial, Cuentas, Koinks, Perfil, recuperación de contraseña o registro inicial completo; consultar Vue y documentación antes de diseñarlos.

Los colores principales se han medido de los PNG. Tipografía Montserrat, medidas dp, tonos semánticos secundarios, estrategia de DatePicker, accesibilidad y ciertos estados son propuestas de implementación, no especificaciones originales verificadas. El repositorio, README, AGENTS.md, skills y proyecto Vue no fueron proporcionados para elaborar este documento; deben verificarse al implementar. Este archivo no sustituye los contratos ni las reglas de negocio.
