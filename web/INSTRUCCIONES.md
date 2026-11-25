# Prueba Técnica Web - Nuxt

Desarrollar una aplicación web de cambio de divisas siguiendo el diseño proporcionado en este [Figma](https://www.figma.com/design/CkUU2J5WZNACGQVy3vFr45/Untitled?node-id=0-1&p=f&t=3p9NiX4qWDMnL8g9-0).

> Las APIs, mocks, manejo de errores, instrucciones de entrega y criterios de evaluación se encuentran en el [README principal](../README.md).

## 🔧 Stack tecnológico

- Nuxt 4 con TypeScript.
- Estilos personalizados con [Tailwind CSS](https://tailwindcss.com/).
- Manejo de estado con Pinia.

## 📋 Requerimientos funcionales

### I. Módulo de Autenticación

**Login**: Formulario para el inicio de sesión de los usuarios con validación de campos en tiempo real.

### II. Módulo de Onboarding

1. **Datos personales**: Formulario para completar los datos personales del usuario con validación de campos en tiempo real y manejo de errores específicos (ej: DNI duplicado).
2. **Registro exitoso**: Vista para indicar que todos los datos se han registrado exitosamente.

### III. Módulo de Transacciones

1. **Pantalla principal**: Es la vista inicial donde se muestra la calculadora de cotización del cambio y se inicia la operación con:
   - Consumo de API para obtener datos de tipo de cambio.
   - Consumo de API para calcular una operación.
   - Cálculos en tiempo real.
   - Opción para invertir la dirección del cambio (de soles a dólares y de dólares a soles).
2. **Agregar información adicional del cambio**:
   - Seleccionar los bancos que se usarán para el intercambio de divisas y el origen de fondos de acuerdo a los mocks.
   - Agregar la cuenta de destino con:
     - Selector de banco (usar mock proporcionado)
     - Tipo de cuenta (ahorro/corriente)
     - Número de cuenta (validación: solo dígitos)
     - Validación de campos en tiempo real
3. **Datos de transferencia**: Vista con los datos de la cuenta bancaria de Kambista.
4. **Adjuntar voucher de depósito**: Vista de formulario para adjuntar voucher bancario del depósito efectuado.
5. **Transacción creada**: Vista de resumen de la operación creada.

## 💡 Bonus (opcional)

- Tests unitarios con [Vitest](https://vitest.dev/)
- Tests end-to-end con [Playwright](https://playwright.dev/)
