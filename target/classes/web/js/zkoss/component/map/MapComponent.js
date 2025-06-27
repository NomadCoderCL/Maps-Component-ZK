/**
 * Componente de Mapa para ZK Framework
 * Integración con OpenLayers
 */
zkoss.component.map.MapComponent = zk.$extends(zul.Widget, {
    
    // Variables del componente
    _map: null,
    _view: null,
    _vectorSource: null,
    _vectorLayer: null,
    _markers: [],
    
    // Propiedades
    _latitude: 40.4168,
    _longitude: -3.7038,
    _zoom: 10,
    _mapType: 'osm',
    _showControls: true,
    _allowMarkers: true,
    
    $define: {
        latitude: function (v) {
            this._latitude = v;
            if (this._view) {
                this._view.setCenter(ol.proj.fromLonLat([this._longitude, this._latitude]));
            }
        },
        longitude: function (v) {
            this._longitude = v;
            if (this._view) {
                this._view.setCenter(ol.proj.fromLonLat([this._longitude, this._latitude]));
            }
        },
        zoom: function (v) {
            this._zoom = v;
            if (this._view) {
                this._view.setZoom(v);
            }
        },
        mapType: function (v) {
            this._mapType = v;
            this._updateMapType();
        },
        showControls: function (v) {
            this._showControls = v;
            this._updateControls();
        },
        allowMarkers: function (v) {
            this._allowMarkers = v;
        }
    },
    
    bind_: function () {
        this.$supers(zkoss.component.map.MapComponent, 'bind_', arguments);
        this._initMap();
    },
    
    unbind_: function () {
        if (this._map) {
            this._map.setTarget(null);
            this._map = null;
        }
        this.$supers(zkoss.component.map.MapComponent, 'unbind_', arguments);
    },
    
    _initMap: function () {
        var self = this;
        
        // Crear fuente de vectores para marcadores
        this._vectorSource = new ol.source.Vector();
        this._vectorLayer = new ol.layer.Vector({
            source: this._vectorSource,
            style: this._createMarkerStyle()
        });
        
        // Crear vista del mapa
        this._view = new ol.View({
            center: ol.proj.fromLonLat([this._longitude, this._latitude]),
            zoom: this._zoom
        });
        
        // Crear mapa
        this._map = new ol.Map({
            target: this.$n(),
            layers: [
                this._createBaseLayer(),
                this._vectorLayer
            ],
            view: this._view,
            controls: this._showControls ? ol.control.defaults() : []
        });
        
        // Agregar event listeners
        this._map.on('click', function (evt) {
            self._handleMapClick(evt);
        });
        
        // Cargar marcadores existentes
        this._loadMarkers();
    },
    
    _createBaseLayer: function () {
        switch (this._mapType) {
            case 'satellite':
                return new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        attributions: 'Tiles © Esri'
                    })
                });
            case 'terrain':
                return new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
                        attributions: 'Tiles © Esri'
                    })
                });
            default:
                return new ol.layer.Tile({
                    source: new ol.source.OSM()
                });
        }
    },
    
    _createMarkerStyle: function () {
        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ff0000">' +
                    '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' +
                    '</svg>'
                )
            })
        });
    },
    
    _updateMapType: function () {
        if (this._map) {
            var layers = this._map.getLayers();
            layers.removeAt(0); // Remover capa base actual
            layers.insertAt(0, this._createBaseLayer()); // Agregar nueva capa base
        }
    },
    
    _updateControls: function () {
        if (this._map) {
            var controls = this._map.getControls();
            controls.clear();
            if (this._showControls) {
                ol.control.defaults().forEach(function (control) {
                    controls.push(control);
                });
            }
        }
    },
    
    _handleMapClick: function (evt) {
        var coordinate = ol.proj.toLonLat(evt.coordinate);
        var longitude = coordinate[0];
        var latitude = coordinate[1];
        
        // Enviar evento al servidor
        this.fire('onMapClick', {
            latitude: latitude,
            longitude: longitude
        });
        
        // Si se permiten marcadores, agregar uno automáticamente
        if (this._allowMarkers) {
            this.addMarkerClient(latitude, longitude, 'Nuevo Marcador', '');
        }
    },
    
    _loadMarkers: function () {
        var markersData = this.$n().getAttribute('data-markers');
        if (markersData) {
            try {
                var markers = JSON.parse(markersData);
                for (var i = 0; i < markers.length; i++) {
                    this.addMarkerClient(markers[i].lat, markers[i].lng, markers[i].title, markers[i].description);
                }
            } catch (e) {
                console.error('Error parsing markers data:', e);
            }
        }
    },
    
    // Métodos públicos
    addMarkerClient: function (lat, lng, title, description) {
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])),
            title: title,
            description: description,
            index: this._markers.length
        });
        
        this._vectorSource.addFeature(feature);
        this._markers.push(feature);
        
        // Agregar listener para click en marcador
        var self = this;
        feature.on('click', function () {
            self.fire('onMarkerClick', {
                markerIndex: feature.get('index')
            });
        });
    },
    
    removeMarkerClient: function (index) {
        if (index >= 0 && index < this._markers.length) {
            var feature = this._markers[index];
            this._vectorSource.removeFeature(feature);
            this._markers.splice(index, 1);
            
            // Reindexar marcadores restantes
            for (var i = index; i < this._markers.length; i++) {
                this._markers[i].set('index', i);
            }
        }
    },
    
    clearMarkersClient: function () {
        this._vectorSource.clear();
        this._markers = [];
    },
    
    centerMapClient: function (lat, lng) {
        if (this._view) {
            this._view.setCenter(ol.proj.fromLonLat([lng, lat]));
        }
    },
    
    setMapViewClient: function (lat, lng, zoom) {
        if (this._view) {
            this._view.setCenter(ol.proj.fromLonLat([lng, lat]));
            this._view.setZoom(zoom);
        }
    },
    
    // Manejo de comandos del servidor
    doAddMarker_: function (evt) {
        var data = evt.data;
        this.addMarkerClient(data.lat, data.lng, data.title, data.description);
    },
    
    doRemoveMarker_: function (evt) {
        this.removeMarkerClient(evt.data);
    },
    
    doClearMarkers_: function (evt) {
        this.clearMarkersClient();
    },
    
    doCenterMap_: function (evt) {
        var data = evt.data;
        this.centerMapClient(data[0], data[1]);
    },
    
    doSetMapView_: function (evt) {
        var data = evt.data;
        this.setMapViewClient(data[0], data[1], data[2]);
    }
});
