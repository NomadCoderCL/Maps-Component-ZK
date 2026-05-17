zkoss.component.map.google.GMMap = zk.$extends(zul.Widget, {
    _map: null,           // Objeto de mapa Google
    _markers: [],         // Array de marcadores
    _apiKey: '',          // API Key de Google Maps
    _latitude: 40.4168,   // Latitud inicial
    _longitude: -3.7038,  // Longitud inicial
    _zoom: 10,            // Zoom inicial
    _mapType: 'roadmap',  // Tipo de mapa (roadmap, satellite, hybrid, terrain)
    _showControls: true,  // Controles visibles

    // Getters y Setters estándar para propiedades
    $define: {
        apiKey: function (val) {
            this._apiKey = val;
            if (this._map) {
                // La key no puede cambiar una vez cargado el mapa
                console.log('La API Key no puede ser cambiada una vez inicializado el mapa');
            }
        },
        latitude: function (val) {
            this._latitude = val;
            if (this._map) {
                this._map.setCenter({ lat: val, lng: this._longitude });
            }
        },
        longitude: function (val) {
            this._longitude = val;
            if (this._map) {
                this._map.setCenter({ lat: this._latitude, lng: val });
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
            if (this._map) {
                let type;
                switch (val.toLowerCase()) {
                    case 'satellite':
                        type = google.maps.MapTypeId.SATELLITE;
                        break;
                    case 'hybrid':
                        type = google.maps.MapTypeId.HYBRID;
                        break;
                    case 'terrain':
                        type = google.maps.MapTypeId.TERRAIN;
                        break;
                    default:
                        type = google.maps.MapTypeId.ROADMAP;
                }
                this._map.setMapTypeId(type);
            }
        },
        showControls: function (val) {
            this._showControls = val;
            if (this._map) {
                this._map.setOptions({
                    zoomControl: val,
                    mapTypeControl: val,
                    scaleControl: val,
                    streetViewControl: val,
                    rotateControl: val,
                    fullscreenControl: val
                });
            }
        }
    },

    // Creación del widget
    bind_: function () {
        this.$supers(zkoss.component.map.google.GMMap, 'bind_', arguments);

        // Verificar API Key
        if (!this._apiKey) {
            console.error('Google Maps requiere una API Key válida');
            this.$n().innerHTML = '<div class="gmmap-error">Error: Se requiere una API Key de Google Maps</div>';
            return;
        }

        // Cargar la API de Google Maps si no está cargada ya
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            this._loadGoogleMapsAPI();
        } else {
            this._initMap();
        }
    },

    // Carga asincrónica de la API de Google Maps
    _loadGoogleMapsAPI: function () {
        const self = this;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this._apiKey}&callback=initGMMap_${this.uuid}`;
        script.async = true;
        script.defer = true;

        // Función global de inicialización que Google Maps llamará cuando se cargue la API
        window[`initGMMap_${this.uuid}`] = function () {
            self._initMap();
            // Limpiamos la función global después de usarla
            delete window[`initGMMap_${self.uuid}`];
        };

        document.head.appendChild(script);
    },

    // Inicialización del mapa
    _initMap: function () {
        const node = this.$n();

        // Crear opciones del mapa
        const mapOptions = {
            center: { lat: this._latitude, lng: this._longitude },
            zoom: this._zoom,
            zoomControl: this._showControls,
            mapTypeControl: this._showControls,
            scaleControl: this._showControls,
            streetViewControl: this._showControls,
            rotateControl: this._showControls,
            fullscreenControl: this._showControls
        };

        // Establecer tipo de mapa
        switch (this._mapType.toLowerCase()) {
            case 'satellite':
                mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
                break;
            case 'hybrid':
                mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                break;
            case 'terrain':
                mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
                break;
            default:
                mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
        }

        // Crear el mapa
        this._map = new google.maps.Map(node, mapOptions);

        // Configurar eventos
        this._setupEvents();

        // Si hay marcadores, añadirlos
        if (this._markers && this._markers.length > 0) {
            for (let i = 0; i < this._markers.length; i++) {
                this._addMarkerToMap(this._markers[i], i);
            }
        }
    },

    // Configurar eventos del mapa
    _setupEvents: function () {
        const self = this;

        // Evento de clic en mapa
        google.maps.event.addListener(this._map, 'click', function (event) {
            self.fire('onMapClick', {
                data: [event.latLng.lat(), event.latLng.lng()]
            }, { toServer: true });
        });
    },

    // Añadir un marcador al mapa
    _addMarkerToMap: function (markerData, index) {
        const self = this;
        const marker = new google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: this._map,
            title: markerData.title || '',
            animation: google.maps.Animation.DROP
        });

        // Guardar referencia al marcador
        this._markers[index] = {
            ...markerData,
            marker: marker
        };

        // Info Window para descripción
        if (markerData.description) {
            const infoWindow = new google.maps.InfoWindow({
                content: markerData.description
            });

            marker.addListener('click', function () {
                infoWindow.open(self._map, marker);
                self.fire('onMarkerClick', {
                    data: [index]
                }, { toServer: true });
            });
        } else {
            marker.addListener('click', function () {
                self.fire('onMarkerClick', {
                    data: [index]
                }, { toServer: true });
            });
        }
    },

    // Limpiar recursos al cerrar
    unbind_: function () {
        if (this._map) {
            // Borrar instancia del mapa
            this._map = null;
        }

        // Limpiar array de marcadores
        this._markers = [];

        this.$supers(zkoss.component.map.google.GMMap, 'unbind_', arguments);
    },

    // Manejador de comandos del servidor
    bind_: function () {
        this.$supers(zkoss.component.map.google.GMMap, 'bind_', arguments);
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
                this.$supers(zkoss.component.map.google.GMMap, 'service_', arguments);
        }
    },

    // Añadir marcador
    _handleAddMarker: function (markerData) {
        if (!this._map) return;

        // Añadir marcador al final del array
        const index = this._markers.length;
        this._addMarkerToMap(markerData, index);
        this._markers().push({
            lat: markerData.lat,
            lng: markerData.lng,
            marker: this._markers[index].marker
        });
    },

    // Eliminar marcador
    _handleRemoveMarker: function (index) {
        if (!this._map || !this._markers[index]) return;

        // Eliminar marcador del mapa
        this._markers[index].marker.setMap(null);

        // Eliminar del array
        this._markers.splice(index, 1);
    },

    // Limpiar todos los marcadores
    _handleClearMarkers: function () {
        if (!this._map) return;

        // Eliminar todos los marcadores del mapa
        for (let i = 0; i < this._markers.length; i++) {
            if (this._markers[i].marker) {
                this._markers[i].marker.setMap(null);
            }
        }

        // Limpiar array
        this._markers = [];
    },

    // Centrar mapa
    _handleCenterMap: function (lat, lng) {
        if (!this._map) return;

        this._map.setCenter({ lat: lat, lng: lng });
    },

    // Establecer vista completa
    _handleSetMapView: function (lat, lng, zoom) {
        if (!this._map) return;

        this._map.setCenter({ lat: lat, lng: lng });
        this._map.setZoom(zoom);
    }
});
