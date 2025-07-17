# 🚀 MiniApp de Solicitudes: Gestión de Herramientas Optimizada

Este proyecto es una **aplicación full-stack moderna y responsiva** diseñada para simplificar la gestión de solicitudes de herramientas dentro de una organización. Permite a los colaboradores solicitar y hacer seguimiento de sus herramientas, mientras que los administradores gestionan el inventario, aprueban préstamos y supervisan la operación general.

## ✨ Características Destacadas

- **Autenticación y Roles Seguros:** Sistema de autenticación robusto con roles de `administrador` y `empleado` utilizando **Clerk**.
- **Gestión de Inventario de Herramientas:** Panel de administración dedicado para el **CRUD** (Crear, Leer, Actualizar, Eliminar) de herramientas, incluyendo gestión de stock y **subida optimizada de imágenes a Cloudinary**.
- **Sistema de Solicitudes Flexible:** Los empleados pueden crear solicitudes de herramientas con justificaciones. Los administradores pueden revisar, **aprobar, rechazar o marcar como devueltas** estas solicitudes, con actualización automática del inventario.
- **Dashboards Adaptativos:**
    - **Dashboard de Usuario:** Vista personalizada para cada empleado con un resumen de _sus propias_ solicitudes y un listado detallado.
    - **Admin Dashboard:** Un panel general para administradores con **estadísticas globales** de la aplicación (solicitudes totales, herramientas disponibles/en préstamo, resumen de usuarios).
- **Notificaciones Integradas:** Sistema de notificaciones por polling para mantener a los usuarios informados sobre el estado de sus solicitudes y a los administradores sobre nuevas peticiones.
- **Experiencia de Usuario (UX) Superior:**
    - **Diseño Responsivo:** Interfaz adaptada a móviles y escritorio, con uso de tablas y tarjetas según la resolución.
    - **Temas Claro/Oscuro:** Selector de tema para personalizar la experiencia visual.
    - **Optimización de Imágenes:** Carga y visualización de imágenes optimizadas con `next/image`.
    - **Estados de Carga y Vacío:** Feedback visual durante la carga (skeletons) y mensajes atractivos para listas vacías.
    - **Búsqueda y Paginación:** Filtrado por estado, búsqueda por texto y paginación eficiente en las listas de gestión.
- **Gestión de Perfil de Usuario:** Los usuarios pueden gestionar sus credenciales y perfil directamente a través de una interfaz de usuario integrada de Clerk.

## 🛠️ Stack Tecnológico

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcn%2Fui&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-24292F?style=for-the-badge&logo=lucide&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-B8B8B8?style=for-the-badge&logo=sonner&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## 🎯 Cómo el Proyecto Cumplió el Reto y sus Mejoras

El reto técnico inicial buscaba una mini-aplicación de solicitudes de herramientas con funcionalidades mínimas como un formulario de 4 campos y visualización en tabla o lista. Este proyecto no solo cumplió con esos requisitos, sino que los **superó y los expandió significativamente**, transformándose en una aplicación full-stack robusta.

- **Fundamentos Sólidos:** Se construyó sobre **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS**, estableciendo una base moderna y escalable.
- **Base de Datos Real:** La persistencia se logró con **MongoDB Atlas y Mongoose**, moviéndose de una solución en memoria (sugerida como opcional en el reto) a una base de datos real.
- **Autenticación Profesional:** Se implementó un sistema de autenticación de usuarios con roles (`admin`, `employee`) utilizando **Clerk**. Esta decisión técnica se tomó después de una exhaustiva evaluación, optando por Clerk debido a su robustez, facilidad de implementación y excelente manejo del middleware, **descartando soluciones como Auth.js (NextAuth v5) debido a problemas de TypeError e incompatibilidades con el Edge Runtime.**
- **Gestión Completa de Datos:** Se desarrollaron APIs RESTful para el **CRUD** de herramientas y solicitudes. La gestión de herramientas incluye un inventario de stock y la integración con **Cloudinary** para la subida de imágenes, optimizando el manejo de archivos multimedia.
- **Experiencia de Usuario Enfocada:** Se prestó especial atención a la UI/UX, asegurando que la aplicación sea **100% responsiva y mobile-first**. La interfaz es moderna, minimalista, y sigue las mejores prácticas de UX/UI, utilizando componentes de **Shadcn/ui** y notificaciones con **Sonner**. La gestión del estado del servidor se centralizó en **Custom Hooks con TanStack Query**, manteniendo los componentes de la UI limpios y enfocados en la presentación. La validación de formularios se manejó eficazmente con **React Hook Form**, **integrando las reglas de validación directamente en el `register` y evitando el acoplamiento a Zod** para mayor flexibilidad.
- **Dashboards Personalizados:** Se crearon dashboards diferenciados para empleados (sus solicitudes) y un dashboard general para administradores (estadísticas de toda la aplicación), proporcionando visiones de datos claras y relevantes para cada rol.
- **Funcionalidades de Búsqueda y Paginación:** Para manejar grandes volúmenes de datos, se implementó paginación y búsqueda por texto eficiente, tanto en el frontend como en el backend.
- **Uso de la Plantilla Base del Reto:** La estructura de componentes del reto original (`FormSolicitud`, `TablaSolicitudes`) fue subsumida y expandida en componentes más modulares y profesionales de Shadcn/ui (ej. `CreateRequestDialog`, `RequestsList`), siguiendo las mejores prácticas para una aplicación escalable.
- **Implementadas 2 pruebas unitaris:** Se implementaron pruebas unitarias a un hook (componente puro) y aun componete de renderzacion jsx. Ambas pasaron.
- **Decisiones tecnicas :** Se cambio la solicitud del reto de trabajar en `pages router` ya que el estandar actual es `app router` y con ese se trabajó. Aunque la version actual de NEXT JS es la `15.4.1` se acogio la version solicitada y trabaje con la version `14.2.30` que es la ultima version estable de la solicitada. Para evitar problema de re-renders y manejos de estado innecesarios que bajan el performance se manejo los formularios (controlled components) con `react-hook-form`.

### 📸 Capturas de Pantalla

<table>
  <tr>
    <td align="center">
      Landing Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen1.jpeg" alt="Landingd" width="400"/>
    </td>
    <td align="center">
      Landing Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen2.jpeg" alt="Landingm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Login Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen3.jpeg" alt="logind" width="400"/>
    </td>
    <td align="center">
      Login Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen4.jpeg" alt="loginm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Own Dash Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen5.jpeg" alt="ownd" width="400"/>
    </td>
    <td align="center">
      Own Dash Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen6.jpeg" alt="ownm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Solicitud Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen7.jpeg" alt="sold" width="400"/>
    </td>
    <td align="center">
      Solicitud Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen8.jpeg" alt="solm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Admin Dash Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen9.jpeg" alt="addd" width="400"/>
    </td>
    <td align="center">
      Admin Dash Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen10.jpeg" alt="addm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Gestion Herramientas Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen11.jpeg" alt="ghd" width="400"/>
    </td>
    <td align="center">
      Gestion Herramientas Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen12.jpeg" alt="ghm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Añadir Herramienta Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen13.jpeg" alt="ahd" width="400"/>
    </td>
    <td align="center">
      Añadir Herramienta Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen14.jpeg" alt="ahm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Gestion Solicitudes Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen15.jpeg" alt="gsd" width="400"/>
    </td>
    <td align="center">
      Gestion Solicitudes Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen16.jpeg" alt="gsm" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      Modo Claro Desktop<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen17.jpeg" alt="mcd" width="400"/>
    </td>
    <td align="center">
      Modo Claro Mobile<br>
      <img src="https://raw.githubusercontent.com/drbv27/tools-manager/main/public/screen18.jpeg" alt="mcm" width="400"/>
    </td>
  </tr>
  </table>

## ⬆️ Posibles Actualizaciones y Mejoras Futuras

Aunque la aplicación está funcionalmente completa, siempre hay espacio para la evolución:

- **Módulo de Gestión de Usuarios para Admin:** Permitir al administrador ver y gestionar (cambiar roles, deshabilitar) usuarios directamente desde la aplicación (usando el Backend SDK de Clerk), en lugar de solo vía el dashboard de Clerk.
- **Notificaciones con Enlaces Dinámicos Avanzados:** Hacer que cada notificación tenga un enlace directo al detalle del recurso al que se refiere (ej., clic en "Solicitud Aprobada" redirige a la vista detallada de esa solicitud).
- **Visualización de Datos Adicional:** Incorporar gráficos o métricas visuales en los dashboards para una comprensión más rápida de los datos.
- **Eliminacion y edicion de solicitudes:** Incorporar funcionalidad para que un usuario gestione sus propias solicitudes y que el admin las gestione todas.
- **Control de Versiones de Herramientas/Solicitudes:** Implementar un historial de cambios para herramientas o solicitudes.
- **Filtros de Búsqueda Adicionales:** Añadir filtros por rango de fechas, o búsquedas más avanzadas por campos específicos.
- **Revisión y Refinamiento de ESLint:** Aunque el `build` es exitoso, algunas reglas de linter fueron deshabilitadas puntualmente para garantizar la finalización del proyecto a tiempo. Se recomienda una revisión exhaustiva para eliminar el uso de `any` y otras advertencias.
- **Manejo de Errores Frontend Más Granular:** Implementar una estrategia de `Error Boundaries` para capturar y mostrar errores de componentes de forma controlada.
- **Testing:** Añadir mas pruebas unitarias, de integración y end-to-end .
- **Despliegue Continuo (CI/CD):** Configurar un pipeline de CI/CD para automatizar pruebas y despliegues. **Es importante destacar que el proceso de subir cambios a GitHub y desplegar automáticamente en Vercel ya sienta las bases para un flujo de CI/CD básico, aunque un CI/CD completo implicaría también la ejecución automática de pruebas y análisis de código.**
- **Documentación Adicional:** Generar documentación de componentes con **Storybook** y documentación de API con **Swagger/OpenAPI**.
- **Internacionalización (i18n):** Soporte para múltiples idiomas.

## 🚀 Puesta en Marcha

Para ejecutar este proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    cd tools-manager
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales (puedes basarte en `.env.local.example` si lo creas, o en la estructura que me proporcionaste).

    ```env
    # .env.local
    # MongoDB
    MONGODB_URI="your_mongodb_atlas_uri"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    # Las URLs de redirección de Clerk ya están configuradas por defecto en el código
    # NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    # NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    # NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    # NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
    ```

    ```

    ```

4.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación (o el que te indique NEXT si tienes otros proyectos corriendo).

## 📫 Contacto

[![GitHub](https://img.shields.io/badge/GitHub-drbv27-181717?logo=github)](https://github.com/drbv27)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-DiegoBonilla-0A66C2?logo=linkedin)](https://www.linkedin.com/in/diego-ricardo-bonilla-villa-7179254a/)
[![Email](https://img.shields.io/badge/Email-DiegoBonilla-D14836?logo=gmail)](mailto:drbv27@gmail.com)
