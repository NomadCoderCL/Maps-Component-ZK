package com.zkoss.component.map.core;

import org.zkoss.zk.ui.Component;
import org.zkoss.zul.impl.XulElement;
import org.zkoss.json.JSONObject;
import org.zkoss.json.JSONArray;

/**
 * Clase base abstracta para componentes de mapa
 * Implementa la interfaz MapComponentInterface y proporciona
 * funcionalidad común para todos los tipos de mapas
 */
public abstract class AbstractMapComponent extends XulElement implements MapComponentInterface {
    
    private static final long serialVersionUID = 1L;
    
    // Propiedades del mapa
    protected double latitude = 40.4168; // Madrid por defecto
    protected double longitude = -3.7038;
    protected int zoom = 10;
    protected String mapType = "osm"; // Tipo de mapa por defecto
    protected boolean showControls = true;
    protected JSONArray markers = new JSONArray();
    
    @Override
    public double getLatitude() {
        return latitude;
    }
    
    @Override
    public void setLatitude(double latitude) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude debe estar entre -90 y 90");
        }
        this.latitude = latitude;
        smartUpdate("latitude", latitude);
    }
    
    @Override
    public double getLongitude() {
        return longitude;
    }
    
    @Override
    public void setLongitude(double longitude) {
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude debe estar entre -180 y 180");
        }
        this.longitude = longitude;
        smartUpdate("longitude", longitude);
    }
    
    @Override
    public int getZoom() {
        return zoom;
    }
    
    @Override
    public void setZoom(int zoom) {
        if (zoom < 0 || zoom > 20) {
            throw new IllegalArgumentException("Zoom debe estar entre 0 y 20");
        }
        this.zoom = zoom;
        smartUpdate("zoom", zoom);
    }
    
    @Override
    public String getMapType() {
        return mapType;
    }
    
    @Override
    public void setMapType(String mapType) {
        this.mapType = mapType;
        smartUpdate("mapType", mapType);
    }
    
    @Override
    public boolean isShowControls() {
        return showControls;
    }
    
    @Override
    public void setShowControls(boolean showControls) {
        this.showControls = showControls;
        smartUpdate("showControls", showControls);
    }
    
    @Override
    public JSONArray getMarkers() {
        return markers;
    }
    
    @Override
    public void addMarker(double lat, double lng, String title, String description) {
        JSONObject marker = new JSONObject();
        marker.put("lat", lat);
        marker.put("lng", lng);
        marker.put("title", title);
        marker.put("description", description);
        markers.add(marker);
        
        // La implementación específica debe manejar cómo actualizar el mapa
        handleAddMarker(marker);
    }
    
    @Override
    public void removeMarker(int index) {
        if (index >= 0 && index < markers.size()) {
            markers.remove(index);
            
            // La implementación específica debe manejar cómo actualizar el mapa
            handleRemoveMarker(index);
        }
    }
    
    @Override
    public void clearMarkers() {
        markers.clear();
        
        // La implementación específica debe manejar cómo actualizar el mapa
        handleClearMarkers();
    }
    
    @Override
    public void centerMap(double lat, double lng) {
        setLatitude(lat);
        setLongitude(lng);
        
        // La implementación específica debe manejar cómo actualizar el mapa
        handleCenterMap(lat, lng);
    }
    
    @Override
    public void setMapView(double lat, double lng, int zoom) {
        setLatitude(lat);
        setLongitude(lng);
        setZoom(zoom);

        // La implementación específica debe manejar cómo actualizar el mapa
        handleSetMapView(lat, lng, zoom);
    }
    
    @Override
    public Component getComponent() {
        return this;
    }
    
    @Override
    protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer)
            throws java.io.IOException {
        super.renderProperties(renderer);
        render(renderer, "latitude", latitude);
        render(renderer, "longitude", longitude);
        render(renderer, "zoom", zoom);
        render(renderer, "mapType", mapType);
        render(renderer, "showControls", showControls);
        render(renderer, "markers", markers.toString());
    }
    
    // Métodos abstractos que las implementaciones específicas deben implementar
    
    /**
     * Maneja la adición de un marcador específico para la implementación del mapa
     * @param marker El objeto JSON que representa el marcador
     */
    protected abstract void handleAddMarker(JSONObject marker);
    
    /**
     * Maneja la eliminación de un marcador específico para la implementación del mapa
     * @param index El índice del marcador a eliminar
     */
    protected abstract void handleRemoveMarker(int index);
    
    /**
     * Maneja la eliminación de todos los marcadores para la implementación del mapa
     */
    protected abstract void handleClearMarkers();
    
    /**
     * Maneja el centrado del mapa para la implementación específica
     * @param lat Latitud del nuevo centro
     * @param lng Longitud del nuevo centro
     */
    protected abstract void handleCenterMap(double lat, double lng);
    
    /**
     * Maneja el establecimiento de vista del mapa para la implementación específica
     * @param lat Latitud del centro
     * @param lng Longitud del centro
     * @param zoom Nivel de zoom
     */
    protected abstract void handleSetMapView(double lat, double lng, int zoom);
}
