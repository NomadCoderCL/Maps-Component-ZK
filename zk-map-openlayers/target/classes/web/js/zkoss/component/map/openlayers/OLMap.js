/* OLMap.js - Componente de OpenLayers para ZK
 * 
 * Define la clase OLMap (widget del lado cliente) para el componente OpenLayers
 */
zkoss.component.map.openlayers.OLMap = zk.$extends(zul.Widget, {
    _map: null,           // Objeto de mapa OpenLayers
    _view: null,          // Vista del mapa
    _markers: [],         // Array de marcadores
    _markerLayer: null,   // Capa de marcadores
    _baseLayers: {},      // Capas base disponibles
    _latitude: 40.4168,   // Latitud inicial
    _longitude: -3.7038,  // Longitud inicial
    _zoom: 10,            // Zoom inicial
    _mapType: 'osm',      // Tipo de mapa (osm, satellite, terrain)
    _showControls: true,  // Controles visibles
    
    // Getters y Setters estándar para propiedades
    $define: {
        latitude: function (val) {
            this._latitude = val;
            if (this._view) {
                const center = ol.proj.transform([this._longitude, val], 'EPSG:4326', 'EPSG:3857');
                this._view.setCenter(center);
            }
        },
        longitude: function (val) {
            this._longitude = val;
            if (this._view) {
                const center = ol.proj.transform([val, this._latitude], 'EPSG:4326', 'EPSG:3857');
                this._view.setCenter(center);
            }
        },
        zoom: function (val) {
            this._zoom = val;
            if (this._view) {
                this._view.setZoom(val);
            }
        },
        mapType: function (val) {
            this._mapType = val;
            if (this._map) {
                this._updateBaseLayer();
            }
        },
        showControls: function (val) {
            this._showControls = val;
            if (this._map) {
                this._updateControls();
            }
        }
    },
    
    // Creación del widget
    bind_: function () {
        this.$supers(zkoss.component.map.openlayers.OLMap, 'bind_', arguments);
        
        // Verificar que OpenLayers esté cargado
        if (typeof ol === 'undefined') {
            console.error('OpenLayers no está disponible');
            this._loadOpenLayers();
            return;
        }
        
        // Inicializar el mapa
        this._initMap();
    },
    
    // Cargar OpenLayers dinámicamente
    _loadOpenLayers: function() {
        const self = this;
        
        // Cargar CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/ol@v7.2.2/ol.css';
        document.head.appendChild(cssLink);
        
        // Cargar JS
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.jsdelivr.net/npm/ol@v7.2.2';
        script.onload = function() {
            self._initMap();
        };
        document.head.appendChild(script);
    },
    
    // Inicialización del mapa
    _initMap: function () {
        const node = this.$n();
        
        // Crear capas base
        this._createBaseLayers();
        
        // Convertir coordenadas WGS84 a proyección del mapa (Mercator)
        const center = ol.proj.transform([this._longitude, this._latitude], 'EPSG:4326', 'EPSG:3857');
        
        // Crear vista
        this._view = new ol.View({
            center: center,
            zoom: this._zoom
        });
        
        // Crear capa de marcadores
        this._markerLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        
        // Crear mapa
        this._map = new ol.Map({
            target: node,
            layers: [
                this._baseLayers[this._mapType], // Capa base inicial
                this._markerLayer  // Capa de marcadores
            ],
            view: this._view
        });
        
        // Actualizar controles
        this._updateControls();
        
        // Configurar eventos
        this._setupEvents();
        
        // Si hay marcadores, añadirlos
        if (this._markers && this._markers.length > 0) {
            for (let i = 0; i < this._markers.length; i++) {
                this._addMarkerToMap(this._markers[i], i);
            }
        }
    },
    
    // Crear capas base disponibles
    _createBaseLayers: function() {
        // OpenStreetMap
        this._baseLayers.osm = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        
        // Satellite (Bing Maps Aerial)
        this._baseLayers.satellite = new ol.layer.Tile({
            visible: false,
            source: new ol.source.XYZ({
                attributions: ['© Esri, Maxar, Earthstar Geographics, and the GIS User Community'],
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
        });
        
        // Terrain (Stamen Terrain)
        this._baseLayers.terrain = new ol.layer.Tile({
            visible: false,
            source: new ol.source.XYZ({
                attributions: ['Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                               'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, ' +
                               'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                               'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>'],
                url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
            })
        });
    },
    
    // Actualizar capa base según mapType
    _updateBaseLayer: function() {
        // Ocultar todas las capas base
        for (let type in this._baseLayers) {
            this._baseLayers[type].setVisible(false);
        }
        
        // Mostrar capa seleccionada
        if (this._baseLayers[this._mapType]) {
            this._baseLayers[this._mapType].setVisible(true);
        } else {
            // Si no existe la capa, usar OSM como fallback
            this._baseLayers.osm.setVisible(true);
        }
    },
    
    // Actualizar los controles según la configuración
    _updateControls: function() {
        // Eliminar controles existentes
        const controls = this._map.getControls();
        controls.clear();
        
        // Si showControls está habilitado, añadir controles estándar
        if (this._showControls) {
            controls.extend([
                new ol.control.Zoom(),
                new ol.control.ScaleLine(),
                new ol.control.Attribution({
                    collapsible: true
                }),
                new ol.control.FullScreen()
            ]);
        }
    },
    
    // Configurar eventos del mapa
    _setupEvents: function () {
        const self = this;
        
        // Evento de clic en mapa
        this._map.on('click', function (event) {
            // Verificar si se hizo clic en un marcador
            const feature = self._map.forEachFeatureAtPixel(event.pixel, function(feature) {
                return feature;
            });
            
            if (!feature) {
                // No se hizo clic en un marcador, enviar evento de clic en mapa
                const coords = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
                self.fire('onMapClick', {
                    data: [coords[1], coords[0]] // [lat, lng]
                }, { toServer: true });
            }
        });
    },
    
    // Añadir un marcador al mapa
    _addMarkerToMap: function (markerData, index) {
        const self = this;
        
        // Crear punto geométrico
        const point = new ol.geom.Point(
            ol.proj.transform([markerData.lng, markerData.lat], 'EPSG:4326', 'EPSG:3857')
        );
        
        // Crear feature
        const feature = new ol.Feature({
            geometry: point,
            name: markerData.title || '',
            description: markerData.description || '',
            index: index
        });
        
        // Estilo para el marcador
        const markerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: '#FF0000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#FFFFFF',
                    width: 2
                })
            }),
            text: new ol.style.Text({
                text: markerData.title || '',
                offsetY: -15,
                fill: new ol.style.Fill({
                    color: '#333333'
                }),
                stroke: new ol.style.Stroke({
                    color: '#FFFFFF',
                    width: 3
                })
            })
        });
        
        // Aplicar estilo
        feature.setStyle(markerStyle);
        
        // Añadir a la capa de marcadores
        this._markerLayer.getSource().addFeature(feature);
        
        // Guardar referencia al marcador
        this._markers[index] = {
            ...markerData,
            feature: feature
        };
        
        // Configurar popup y evento de clic
        if (markerData.description) {
            // Configurar popup en clic (usando overlay)
            const container = document.createElement('div');
            container.className = 'ol-popup';
            
            const closer = document.createElement('a');
            closer.href = '#';
            closer.className = 'ol-popup-closer';
            
            const content = document.createElement('div');
            content.innerHTML = markerData.description;
            
            container.appendChild(closer);
            container.appendChild(content);
            
            const overlay = new ol.Overlay({
                element: container,
                positioning: 'bottom-center',
                stopEvent: false,
                offset: [0, -10]
            });
            
            this._map.addOverlay(overlay);
            
            // Cerrar popup
            closer.onclick = function() {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };
            
            // Evento de clic en el mapa para features
            this._map.on('click', function(evt) {
                const featureClicked = self._map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                
                if (featureClicked === feature) {
                    // Mostrar popup
                    const coordinate = feature.getGeometry().getCoordinates();
                    overlay.setPosition(coordinate);
                    
                    // Disparar evento
                    self.fire('onMarkerClick', {
                        data: [index]
                    }, { toServer: true });
                }
            });
        } else {
            // Si no hay descripción, solo configurar el evento
            this._map.on('click', function(evt) {
                const featureClicked = self._map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                
                if (featureClicked === feature) {
                    self.fire('onMarkerClick', {
                        data: [index]
                    }, { toServer: true });
                }
            });
        }
    },
    
    // Limpiar recursos al cerrar
    unbind_: function () {
        if (this._map) {
            this._map.setTarget(null);
            this._map = null;
        }
        
        // Limpiar referencias
        this._view = null;
        this._markerLayer = null;
        this._baseLayers = {};
        this._markers = [];
        
        this.$supers(zkoss.component.map.openlayers.OLMap, 'unbind_', arguments);
    },
    
    // Manejador de comandos del servidor
    service_: function (comando, args) {
        switch (comando) {
            case 'addMarker':
                this._handleAddMarker(args);
                break;
            case 'removeMarker':
                this._handleRemoveMarker(args.index);
                break;
            case 'clearMarkers':
                this._handleClearMarkers();
                break;
            case 'centerMap':
                this._handleCenterMap(args.lat, args.lng);
                break;
            case 'setMapView':
                this._handleSetMapView(args.lat, args.lng, args.zoom);
                break;
            default:
                this.$supers(zkoss.component.map.openlayers.OLMap, 'service_', arguments);
        }
    },
    
    // Añadir marcador
    _handleAddMarker: function (markerData) {
        if (!this._map) return;
        
        // Añadir marcador al final del array
        const index = this._markers.length;
        this._addMarkerToMap(markerData, index);
    },
    
    // Eliminar marcador
    _handleRemoveMarker: function (index) {
        if (!this._map || !this._markers[index]) return;
        
        // Eliminar marcador de la capa
        this._markerLayer.getSource().removeFeature(this._markers[index].feature);
        
        // Eliminar del array
        this._markers.splice(index, 1);
    },
    
    // Limpiar todos los marcadores
    _handleClearMarkers: function () {
        if (!this._map) return;
        
        // Limpiar capa de marcadores
        this._markerLayer.getSource().clear();
        
        // Limpiar array
        this._markers = [];
    },
    
    // Centrar mapa
    _handleCenterMap: function (lat, lng) {
        if (!this._view) return;
        
        const center = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
        this._view.setCenter(center);
    },
    
    // Establecer vista completa
    _handleSetMapView: function (lat, lng, zoom) {
        if (!this._view) return;
        
        const center = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
        this._view.setCenter(center);
        this._view.setZoom(zoom);
    }
});
