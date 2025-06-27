package com.zkoss.component.map.core;

import org.zkoss.zk.ui.Component;
import org.zkoss.json.JSONObject;
import org.zkoss.json.JSONArray;

/**
 * Interfaz común para todos los componentes de mapa ZK
 * Define las operaciones básicas que todos los mapas deben implementar
 */
public interface MapComponentInterface {
    
    /**
     * Establece la latitud del centro del mapa
     * @param latitude Latitud en grados decimales (-90 a 90)
     */
    void setLatitude(double latitude);
    
    /**
     * Obtiene la latitud actual del centro del mapa
     * @return Latitud en grados decimales
     */
    double getLatitude();
    
    /**
     * Establece la longitud del centro del mapa
     * @param longitude Longitud en grados decimales (-180 a 180)
     */
    void setLongitude(double longitude);
    
    /**
     * Obtiene la longitud actual del centro del mapa
     * @return Longitud en grados decimales
     */
    double getLongitude();
    
    /**
     * Establece el nivel de zoom del mapa
     * @param zoom Nivel de zoom (generalmente entre 0-20)
     */
    void setZoom(int zoom);
    
    /**
     * Obtiene el nivel de zoom actual del mapa
     * @return Nivel de zoom
     */
    int getZoom();
    
    /**
     * Establece el tipo de mapa a mostrar
     * @param mapType Tipo de mapa ("osm", "satellite", "terrain", etc.)
     */
    void setMapType(String mapType);
    
    /**
     * Obtiene el tipo de mapa actual
     * @return Tipo de mapa
     */
    String getMapType();
    
    /**
     * Activa o desactiva los controles del mapa
     * @param showControls true para mostrar controles, false para ocultarlos
     */
    void setShowControls(boolean showControls);
    
    /**
     * Indica si los controles del mapa están visibles
     * @return true si los controles están visibles
     */
    boolean isShowControls();
    
    /**
     * Agrega un marcador al mapa
     * @param lat Latitud del marcador
     * @param lng Longitud del marcador
     * @param title Título del marcador
     * @param description Descripción del marcador
     */
    void addMarker(double lat, double lng, String title, String description);
    
    /**
     * Elimina un marcador específico
     * @param index Índice del marcador a eliminar
     */
    void removeMarker(int index);
    
    /**
     * Elimina todos los marcadores del mapa
     */
    void clearMarkers();
    
    /**
     * Obtiene todos los marcadores actuales
     * @return Array JSON con la información de los marcadores
     */
    JSONArray getMarkers();
    
    /**
     * Centra el mapa en unas coordenadas específicas
     * @param lat Latitud del nuevo centro
     * @param lng Longitud del nuevo centro
     */
    void centerMap(double lat, double lng);
    
    /**
     * Establece la vista del mapa (centro y zoom)
     * @param lat Latitud del centro
     * @param lng Longitud del centro
     * @param zoom Nivel de zoom
     */
    void setMapView(double lat, double lng, int zoom);
    
    /**
     * Método para obtener el elemento UI subyacente
     * @return Componente ZK que implementa el mapa
     */
    Component getComponent();
}
