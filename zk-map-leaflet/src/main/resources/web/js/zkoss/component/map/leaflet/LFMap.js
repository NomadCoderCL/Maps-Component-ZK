/* LFMap.js - Componente de Leaflet para ZK
 * 
 * Define la clase LFMap (widget del lado cliente) para el componente Leaflet
 */
zkoss.component.map.leaflet.LFMap = zk.$extends(zul.Widget, {
    _map: null,           // Objeto de mapa Leaflet
    _tileLayer: null,     // Capa de tiles
    _markers: [],         // Array de marcadores
    _markerLayer: null,   // Grupo de marcadores
    _latitude: 40.4168,   // Latitud inicial
    _longitude: -3.7038,  // Longitud inicial
    _zoom: 10,            // Zoom inicial
    _mapType: 'osm',      // Tipo de mapa (standard, satellite, terrain)
    _showControls: true,  // Controles visibles
    _tileProvider: 'osm', // Proveedor de tiles
    _tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // URL de tiles
    _attribution: '© OpenStreetMap contributors', // Atribución
    _accessToken: '',     // Token para Mapbox
    
    // Getters y Setters estándar para propiedades
    $define: {
        latitude: function (val) {
            this._latitude = val;
            if (this._map) {
                this._map.setView([val, this._longitude], this._map.getZoom());
            }
        },
        longitude: function (val) {
            this._longitude = val;
            if (this._map) {
                this._map.setView([this._latitude, val], this._map.getZoom());
            }
        },
        zoom: function (val) {
            this._zoom = val;
            if (this._map) {
                this._map.setZoom(val);
            }
        },
        mapType: function (val) {
            this._mapType = val;
            this._updateTileLayer();
        },
        showControls: function (val) {
            this._showControls = val;
            if (this._map) {
                if (val) {
                    this._map.zoomControl.enable();
                } else {
                    this._map.zoomControl.disable();
                }
            }
        },
        tileProvider: function (val) {
            this._tileProvider = val;
            this._updateTileLayer();
        },
        tileUrl: function (val) {
            this._tileUrl = val;
            this._updateTileLayer();
        },
        attribution: function (val) {
            this._attribution = val;
            if (this._tileLayer) {
                this._tileLayer.setAttribution(val);
            }
        },
        accessToken: function (val) {
            this._accessToken = val;
            this._updateTileLayer();
        }
    },
    
    // Creación del widget
    bind_: function () {
        this.$supers(zkoss.component.map.leaflet.LFMap, 'bind_', arguments);
        
        // Verificar que Leaflet esté cargado
        if (typeof L === 'undefined') {
            console.error('Leaflet no está disponible');
            this.$n().innerHTML = '<div class="lfmap-error">Error: Leaflet no está disponible</div>';
            return;
        }
        
        // Inicializar el mapa
        this._initMap();
    },
    
    // Inicialización del mapa
    _initMap: function () {
        const node = this.$n();
        
        // Crear el mapa
        this._map = L.map(node, {
            center: [this._latitude, this._longitude],
            zoom: this._zoom,
            zoomControl: this._showControls
        });
        
        // Añadir capa de tiles
        this._updateTileLayer();
        
        // Configurar eventos
        this._setupEvents();
        
        // Crear capa de marcadores
        this._markerLayer = L.layerGroup().addTo(this._map);
        
        // Si hay marcadores, añadirlos
        if (this._markers && this._markers.length > 0) {
            for (let i = 0; i < this._markers.length; i++) {
                this._addMarkerToMap(this._markers[i], i);
            }
        }
    },
    
    // Actualizar capa de tiles
    _updateTileLayer: function () {
        if (!this._map) return;
        
        // Eliminar capa actual si existe
        if (this._tileLayer) {
            this._map.removeLayer(this._tileLayer);
        }
        
        // Opciones para la capa de tiles
        const options = {
            attribution: this._attribution
        };
        
        // Para Mapbox, añadir el token de acceso
        if (this._tileProvider === 'mapbox' && this._accessToken) {
            options.id = 'mapbox/streets-v11';
            options.accessToken = this._accessToken;
        }
        
        // Crear nueva capa
        this._tileLayer = L.tileLayer(this._tileUrl, options).addTo(this._map);
        
        // Si es de tipo satélite o terreno, ajustar según el proveedor
        if (this._mapType === 'satellite') {
            switch (this._tileProvider) {
                case 'mapbox':
                    if (this._accessToken) {
                        options.id = 'mapbox/satellite-v9';
                        this._tileLayer.setUrl('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}');
                        this._tileLayer.setOptions(options);
                    }
                    break;
                case 'esri':
                    this._tileLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
                    break;
            }
        }
        else if (this._mapType === 'terrain') {
            switch (this._tileProvider) {
                case 'mapbox':
                    if (this._accessToken) {
                        options.id = 'mapbox/outdoors-v11';
                        this._tileLayer.setUrl('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}');
                        this._tileLayer.setOptions(options);
                    }
                    break;
                case 'carto':
                    this._tileLayer.setUrl('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png');
                    break;
            }
        }
    },
    
    // Configurar eventos del mapa
    _setupEvents: function () {
        const self = this;
        
        // Evento de clic en mapa
        this._map.on('click', function (event) {
            self.fire('onMapClick', {
                data: [event.latlng.lat, event.latlng.lng]
            }, { toServer: true });
        });
    },
    
    // Añadir un marcador al mapa
    _addMarkerToMap: function (markerData, index) {
        const self = this;
        const marker = L.marker([markerData.lat, markerData.lng], {
            title: markerData.title || ''
        }).addTo(this._markerLayer);
        
        // Guardar referencia al marcador
        this._markers[index] = {
            ...markerData,
            marker: marker
        };
        
        // Popup para descripción
        if (markerData.description) {
            marker.bindPopup(markerData.description);
            
            marker.on('click', function () {
                marker.openPopup();
                self.fire('onMarkerClick', {
                    data: [index]
                }, { toServer: true });
            });
        } else {
            marker.on('click', function () {
                self.fire('onMarkerClick', {
                    data: [index]
                }, { toServer: true });
            });
        }
    },
    
    // Limpiar recursos al cerrar
    unbind_: function () {
        if (this._map) {
            // Eliminar eventos
            this._map.off();
            
            // Eliminar mapa
            this._map.remove();
            this._map = null;
        }
        
        // Limpiar referencias
        this._tileLayer = null;
        this._markerLayer = null;
        this._markers = [];
        
        this.$supers(zkoss.component.map.leaflet.LFMap, 'unbind_', arguments);
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
                this.$supers(zkoss.component.map.leaflet.LFMap, 'service_', arguments);
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
        
        // Eliminar marcador del mapa
        this._markerLayer.removeLayer(this._markers[index].marker);
        
        // Eliminar del array
        this._markers.splice(index, 1);
    },
    
    // Limpiar todos los marcadores
    _handleClearMarkers: function () {
        if (!this._map) return;
        
        // Limpiar capa de marcadores
        this._markerLayer.clearLayers();
        
        // Limpiar array
        this._markers = [];
    },
    
    // Centrar mapa
    _handleCenterMap: function (lat, lng) {
        if (!this._map) return;
        
        this._map.setView([lat, lng], this._map.getZoom());
    },
    
    // Establecer vista completa
    _handleSetMapView: function (lat, lng, zoom) {
        if (!this._map) return;
        
        this._map.setView([lat, lng], zoom);
    }
});
