<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ZK Framework Map Component Instructions

Este es un proyecto de componente personalizado para ZK Framework que integra mapas interactivos usando OpenLayers.

## Contexto del Proyecto

- **Framework**: ZK Framework 10.0.0
- **Lenguaje**: Java 11+ con JavaScript del lado cliente
- **Herramienta de Build**: Maven
- **Mapa**: OpenLayers 7.2.2
- **Servidor**: Jetty para desarrollo

## Estructura del Componente ZK

### Arquitectura del Componente

1. **Clase Java del Servidor** (`MapComponent.java`)
   - Extiende `XulElement`
   - Maneja propiedades del mapa (lat, lng, zoom, etc.)
   - Procesa eventos del cliente
   - Gestiona marcadores y capas

2. **JavaScript del Cliente** (`MapComponent.js`)
   - Extiende `zul.Widget`
   - Integra con OpenLayers
   - Maneja interacciones del usuario
   - Sincroniza con el servidor via AU requests

3. **Configuración ZK** (`lang-addon.xml`)
   - Define el componente en el namespace ZK
   - Especifica archivos JS/CSS
   - Registra eventos personalizados

4. **Template DSP** (`mapcomponent.dsp`)
   - Define el HTML renderizado
   - Incluye atributos de datos

## Patrones de Desarrollo ZK

### Eventos Personalizados
```java
// Crear evento personalizado
public class MapClickEvent extends Event {
    private final double latitude;
    private final double longitude;
    
    public MapClickEvent(String name, Component target, double lat, double lng) {
        super(name, target);
        this.latitude = lat;
        this.longitude = lng;
    }
}
```

### AU Requests (Async Updates)
```java
// Del servidor al cliente
response("addMarker", new AuAddMarker(this, marker));

// Del cliente al servidor
this.service(request, everError);
```

### Smart Updates
```java
// Actualizar propiedad en el cliente
smartUpdate("latitude", latitude);
```

## Mejores Prácticas

### Componentes ZK
- Usar `smartUpdate()` para sincronizar propiedades
- Implementar `renderProperties()` para propiedades iniciales
- Manejar eventos con `service()` method
- Usar `response()` para comandos al cliente

### JavaScript ZK
- Extender widgets ZK existentes
- Usar `$define` para propiedades reactivas
- Implementar `bind_()` y `unbind_()` correctamente
- Usar `fire()` para enviar eventos al servidor

### OpenLayers Integration
- Inicializar mapa en `bind_()`
- Limpiar recursos en `unbind_()`
- Usar proyecciones correctas (EPSG:3857 vs EPSG:4326)
- Manejar eventos de mapa apropiadamente

## Convenciones de Código

### Naming
- Clases Java: PascalCase
- Métodos: camelCase
- Propiedades ZK: camelCase
- Eventos: camelCase con prefijo "on"

### Estructura de Archivos
```
src/main/java/com/zkoss/component/map/     # Clases Java
src/main/resources/web/js/zkoss/component/map/    # JavaScript
src/main/resources/web/css/zkoss/component/map/   # CSS
src/main/resources/metainfo/zk/           # Configuración ZK
src/main/webapp/                          # Páginas ZUL y recursos web
```

## Debugging

### Errores Comunes
- **Widget no encontrado**: Verificar `lang-addon.xml` y paths de JS
- **Eventos no funcionan**: Revisar `service()` method y AU requests
- **CSS no aplica**: Verificar path de CSS en `lang-addon.xml`
- **Mapa no renderiza**: Verificar inicialización en `bind_()`

### Herramientas
- Usar Chrome DevTools para debuggear JavaScript
- Logs del servidor en consola de Maven/Jetty
- ZK Developer's Reference para patrones

## Extensiones Futuras

### Funcionalidades Sugeridas
- Soporte para KML/GeoJSON
- Clustering de marcadores
- Herramientas de dibujo
- Integración con APIs de geocoding
- Soporte para capas vectoriales personalizadas
- Exportación de mapas como imagen

### Optimizaciones
- Lazy loading de mapas
- Caching de tiles
- Compresión de datos de marcadores
- Soporte para WebGL rendering
