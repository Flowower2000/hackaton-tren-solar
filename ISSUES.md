# Issues para crear en GitHub

Crear los siguientes cuatro issues cuando haya acceso de escritura. Todas las ramas parten del mismo commit base.

## 1. Arquitectura, dashboard e integración

Responsable: Gabriel Calisaya. Rama: `feature/dashboard`.

- Objetivo: unificar arquitectura, criterios visuales y módulos.
- Archivos: `src/app/`, `src/modules/dashboard/`, `src/shared/`, `src/styles/` y configuración.
- Funcionalidades: navegación, dashboard, contratos y datos compartidos, integración y despliegue.
- Dependencias: base compartida publicada; PR de los módulos.
- Aceptación: dashboard conectado al repositorio común; build correcto; datos simulados identificados; cuatro módulos integrados.

## 2. Mapa y monitoreo satelital

Responsable: Integrante 2. Rama: `feature/satellite`.

- Objetivo: visualizar zonas ambientales de Jujuy.
- Archivos: `src/modules/satellite/`.
- Funcionalidades: mapa Leaflet, marcadores de `getZones()`, comparación `previousValue` y `currentValue`.
- Dependencias: `shared/types.ts`, `shared/repository.ts`; coordinar montaje con Gabriel.
- Aceptación: mapa usable, zonas visibles y comparación temporal; etiqueta visible de datos simulados.

## 3. Reportes ciudadanos

Responsable: Integrante 3. Rama: `feature/citizen`.

- Objetivo: cargar reportes geolocalizados.
- Archivos: `src/modules/citizen/`.
- Funcionalidades: formulario, ubicación, foto opcional pequeña, validación y `createReport()`.
- Dependencias: contratos compartidos; coordinar montaje con Gabriel.
- Aceptación: un reporte válido persiste al recargar; campos obligatorios se validan; la foto no excede LocalStorage.

## 4. Gestión de alertas e informes

Responsable: Integrante 4. Rama: `feature/management`.

- Objetivo: gestionar reportes e intervenciones.
- Archivos: `src/modules/management/`.
- Funcionalidades: lista con filtros, cambios de estado/prioridad, intervenciones, estadísticas e informe en pantalla.
- Dependencias: `getReports()`, `updateReport()`, `getInterventions()`, `createIntervention()`.
- Aceptación: estado persiste al recargar; filtros y totales reflejan los reportes compartidos.
