# Módulo de reportes ciudadanos

Formulario para cargar reportes ambientales geolocalizados. Guarda con `createReport()` de `src/shared/repository.ts`; no agrega dependencias ni fuentes de datos.

## Montaje (para integración)

```tsx
import { CitizenReportModule } from '../modules/citizen'

<CitizenReportModule />
```

El componente no recibe props y no modifica `src/shared` ni `src/app`.

## Comportamiento

- Campos obligatorios: título (5–80), categoría, descripción (15–600) y ubicación.
- Ubicación: botón "Usar mi ubicación actual" (Geolocation API) o latitud/longitud a mano (WGS84, acepta coma decimal). Un mapa Leaflet chico previsualiza el punto, y tocarlo elige o corrige la ubicación. Se rechazan puntos fuera de la caja de Jujuy (`JUJUY_BOUNDS`). Referencia del lugar opcional, va en `location.label`.
- Foto opcional, con vista previa: se reduce y recomprime a JPEG hasta que el Data URL mide como máximo 120 000 caracteres (≈ 88 KB). Si LocalStorage se llena igual, se muestra un aviso y no se pierde el formulario.
- Valores iniciales: `status: 'new'`; prioridad sugerida por categoría (incendio → `high`, otro → `low`, resto → `medium`), que Gestión puede cambiar.
- Debajo del formulario se listan los últimos 5 reportes, para comprobar que persisten al recargar.
