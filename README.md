# ZK Map Components

Componentes de mapas interactivos para ZK Framework que permiten integrar distintos proveedores de mapas en aplicaciones ZK.

## Características

- ✅ **Integración nativa con ZK Framework**
- ✅ **Soporte para múltiples proveedores de mapas**:
  - Google Maps
  - Leaflet
  - OpenLayers
- ✅ **API unificada** para trabajar con diferentes backends de mapas
- ✅ **Marcadores, polígonos y otras formas geométricas**
- ✅ **Eventos personalizados** (clic en mapa, clic en marcador, etc.)
- ✅ **Fácil de integrar** en aplicaciones ZK existentes
- ✅ **Controles Configurables**: Zoom, navegación, atribución
- ✅ **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- ✅ **Tema Oscuro**: Soporte para modo oscuro

## Instalación

### 1. Clonar el proyecto

```bash
git clone <repository-url>
cd zk-map-component
```

### 2. Compilar el proyecto

```bash
mvn clean compile
```

### 3. Ejecutar el servidor de desarrollo

```bash
mvn jetty:run
```

### 4. Acceder a la aplicación

Abrir el navegador y navegar a: `http://localhost:8080/zk-map`

## Uso Básico

### En archivo ZUL

```xml
<mapcomponent id="miMapa" 
             width="100%" 
             height="400px"
             latitude="40.4168"
             longitude="-3.7038"
             zoom="10"
             mapType="osm"
             showControls="true"
             allowMarkers="true">
    
    <attribute name="onMapClick">
        <![CDATA[
            double lat = event.getLatitude();
            double lng = event.getLongitude();
            Clients.showNotification("Clic en: " + lat + ", " + lng);
        ]]>
    </attribute>
</mapcomponent>
```

### En código Java

```java
MapComponent mapa = new MapComponent();
mapa.setLatitude(40.4168);
mapa.setLongitude(-3.7038);
mapa.setZoom(12);
mapa.setMapType("satellite");

// Agregar marcador
mapa.addMarker(40.4168, -3.7038, "Madrid", "Capital de España");

// Event listener
mapa.addEventListener("onMapClick", new EventListener<MapClickEvent>() {
    public void onEvent(MapClickEvent event) throws Exception {
        double lat = event.getLatitude();
        double lng = event.getLongitude();
        // Manejar el evento...
    }
});
```

## Propiedades del Componente

| Propiedad | Tipo | Valor por Defecto | Descripción |
|-----------|------|-------------------|-------------|
| `latitude` | double | 40.4168 | Latitud del centro del mapa |
| `longitude` | double | -3.7038 | Longitud del centro del mapa |
| `zoom` | int | 10 | Nivel de zoom (0-20) |
| `mapType` | String | "osm" | Tipo de mapa: "osm", "satellite", "terrain" |
| `showControls` | boolean | true | Mostrar controles de navegación |
| `allowMarkers` | boolean | true | Permitir agregar marcadores con clic |
| `width` | String | "100%" | Ancho del componente |
| `height` | String | "400px" | Alto del componente |

## Métodos Principales

### Gestión de Marcadores

```java
// Agregar marcador
mapa.addMarker(lat, lng, "Título", "Descripción");

// Eliminar marcador por índice
mapa.removeMarker(0);

// Limpiar todos los marcadores
mapa.clearMarkers();

// Obtener marcadores
JSONArray marcadores = mapa.getMarkers();
```

### Control del Mapa

```java
// Centrar mapa
mapa.centerMap(40.4168, -3.7038);

// Establecer vista completa
mapa.setMapView(40.4168, -3.7038, 12);

// Cambiar tipo de mapa
mapa.setMapType("satellite");
```

## Eventos

### onMapClick

Se dispara cuando se hace clic en el mapa.

```java
public void onEvent(MapClickEvent event) throws Exception {
    double latitude = event.getLatitude();
    double longitude = event.getLongitude();
    // Procesar coordenadas...
}
```

### onMarkerClick

Se dispara cuando se hace clic en un marcador.

```java
public void onEvent(MarkerClickEvent event) throws Exception {
    int markerIndex = event.getMarkerIndex();
    MapComponent mapa = event.getMapComponent();
    // Procesar clic en marcador...
}
```

## Ejemplos Avanzados

El proyecto incluye ejemplos avanzados en `advanced.zul`:

- **Múltiples Marcadores**: Gestión de múltiples marcadores simultáneamente
- **Geolocalización**: Obtener ubicación del usuario
- **Rutas y Polígonos**: Dibujar formas geométricas
- **Integración con Datos**: Cargar datos desde fuentes externas

## Personalización

### CSS Personalizado

```css
.z-mapcomponent {
    border: 2px solid #007bff;
    border-radius: 8px;
}

.z-mapcomponent.custom-theme .ol-control {
    background-color: rgba(0, 123, 255, 0.8);
}
```

### JavaScript Personalizado

```javascript
// Extender funcionalidad
zkoss.component.map.MapComponent.prototype.customMethod = function() {
    // Funcionalidad personalizada...
};
```

## Estructura del Proyecto

```
zk-map-component/
├── src/main/java/com/zkoss/component/map/
│   ├── MapComponent.java          # Componente principal
│   ├── MapClickEvent.java         # Evento de clic en mapa
│   └── MarkerClickEvent.java      # Evento de clic en marcador
├── src/main/resources/
│   ├── metainfo/zk/lang-addon.xml # Configuración ZK
│   └── web/
│       ├── js/zkoss/component/map/
│       │   └── MapComponent.js    # JavaScript del lado cliente
│       ├── css/zkoss/component/map/
│       │   └── MapComponent.css   # Estilos CSS
│       └── zul/html/
│           └── mapcomponent.dsp   # Template DSP
├── src/main/webapp/
│   ├── index.zul                  # Página de demostración
│   ├── advanced.zul               # Ejemplos avanzados
│   └── WEB-INF/web.xml           # Configuración web
└── pom.xml                        # Configuración Maven
```

## Dependencias

- **ZK Framework**: 10.0.0
- **OpenLayers**: 7.2.2
- **Jackson**: 2.15.2 (para JSON)
- **SLF4J + Logback**: Para logging

## Requisitos

- Java 11 o superior
- Maven 3.6 o superior
- Navegador web moderno con soporte para ES6

## Desarrollo

### Compilar el proyecto

```bash
mvn clean compile
```

### Ejecutar tests

```bash
mvn test
```

### Generar WAR

```bash
mvn clean package
```

### Ejecutar con Jetty

```bash
mvn jetty:run
```

## Contribución

1. Fork el proyecto
2. Crear una rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para reportar bugs o solicitar funcionalidades:

1. Abrir un issue en GitHub
2. Incluir información detallada del problema
3. Proporcionar ejemplo de código si es posible

## Changelog

### v1.0.0
- ✅ Implementación inicial del componente
- ✅ Soporte para múltiples tipos de mapa
- ✅ Gestión de marcadores
- ✅ Eventos de interacción
- ✅ Documentación completa
