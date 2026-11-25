# Prueba Técnica App - React Native

Desarrollar una aplicación móvil de cambio de divisas con autenticación, siguiendo los diseños proporcionados en este [Figma](https://www.figma.com/design/0r7lOY04Vv3Ht9UJItO7yX/Prueba?node-id=0-1&node-type=canvas&t=xY3A9Vp4Xe4zmQCW-0).

> Las APIs, mocks, manejo de errores, instrucciones de entrega y criterios de evaluación se encuentran en el [README principal](../README.md).

## 🔧 Stack tecnológico

| Categoría   | Tecnologías                      |
|-------------|----------------------------------|
| Core        | Expo · React Native · TypeScript |
| Navegación  | Expo Router                      |
| Estilos     | NativeWind                       |
| Estado      | Zustand                          |
| API         | Axios                            |
| Formularios | React Hook Form · Yup            |

## 📋 Requerimientos funcionales

### 🔐 Módulo de Autenticación

- **Login**
  - Formulario para el inicio de sesión de los usuarios.
  - Validación de campos en tiempo real.

### 📝 Módulo de Onboarding

- **Datos personales**
  - Formulario para completar los datos personales del usuario.
  - Validación de campos en tiempo real.
  - Manejo de errores específicos (ej: DNI duplicado).
- **Registro exitoso**
  - Vista para indicar que todos los datos son correctos.

### 💱 Módulo de Transacciones

- **Pantalla principal**
  - Calculadora PEN ↔ USD.
  - Consumo de API para obtener datos de tipo de cambio.
  - Consumo de API para calcular una operación.
  - Manejo de tasas de cambio dinámicas.
  - Cálculos en tiempo real.
- **Crear una operación**
  - Seleccionar los bancos y el origen de fondos de acuerdo a los mocks.
- **Datos de transferencia**
  - Datos de la cuenta bancaria de Kambista.
- **Adjuntar voucher de depósito**
  - Formulario para adjuntar voucher bancario del depósito efectuado.
- **Transacción creada**
  - Resumen de la operación creada.

### 🏦 Módulo de Cuentas bancarias

- **Agregar cuenta**
  - Formulario para agregar cuenta bancaria con:
    - Selector de banco (usar mock proporcionado)
    - Tipo de cuenta (ahorro/corriente)
    - Número de cuenta (validación: solo dígitos)
  - Validación de campos en tiempo real.

### 🟰 Navegación

Implementar un **Bottom Bar** para cambiar entre los módulos principales.

## ⚙️ Requisitos técnicos

- **Configuración**
  - Estilos con NativeWind.
  - Tipado estricto con TypeScript.
  - Consumo de API con cliente HTTP y manejo de datos.
  - Gestión del estado global.
- **Componentes y vistas**
  - Reutilización de componentes de UI.
  - Props bien tipadas.
  - Navegación fluida entre pantallas.
- **Gestión de estado**
  - Manejo de estado global para los datos de una transacción y las tasas de cambio.

## 📦 APK

Generar y adjuntar un archivo APK usando EAS Build.

## 💡 Bonus (opcional)

- Tests unitarios con [Jest](https://jestjs.io/) y [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
