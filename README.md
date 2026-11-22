# Inteligencia ambiental · Jujuy

Prototipo para la Hackatón Tren Solar 2026. El monitoreo y las zonas precargadas usan **datos demostrativos**, no observaciones satelitales reales.

## Iniciar

```bash
npm install
npm run dev
```

## Trabajo del equipo

Primero publicar esta base compartida. Cada integrante crea su rama desde la rama base vigente y abre un PR para integrar. Gabriel Calisaya coordina los cambios de `src/shared`, `src/app`, configuración y dependencias.

| Integrante | Rama | Carpeta propia |
| --- | --- | --- |
| Gabriel | `feature/dashboard` | `src/modules/dashboard` y archivos compartidos |
| 2 | `feature/satellite` | `src/modules/satellite` |
| 3 | `feature/citizen` | `src/modules/citizen` |
| 4 | `feature/management` | `src/modules/management` |

Los módulos importan los tipos y funciones de `src/shared`. Las fechas son ISO, las ubicaciones usan latitud/longitud WGS84. No agregar nuevas fuentes de datos ni dependencias sin coordinación. Las fotografías de demostración se guardan como Data URL y deben mantenerse pequeñas para no agotar LocalStorage.

El repositorio remoto existente está vacío y anuncia `master` como rama predeterminada. Si se configura `main` como predeterminada, los PR se abren hacia `main`; de otro modo se usan `master` hasta que el dueño cambie la configuración.
