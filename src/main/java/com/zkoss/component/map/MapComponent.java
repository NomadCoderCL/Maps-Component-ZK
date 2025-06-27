package com.zkoss.component.map;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.WrongValueException;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zul.impl.XulElement;
import org.zkoss.json.JSONObject;
import org.zkoss.json.JSONArray;

/**
 * Componente de mapa interactivo para ZK Framework
 * Integra OpenLayers para proporcionar funcionalidad de mapas
 */
public class MapComponent extends XulElement {
    
    private static final long serialVersionUID = 1L;
    
    // Propiedades del mapa
    private double latitude = 40.4168; // Madrid por defecto
    private double longitude = -3.7038;
    private int zoom = 10;
    private String mapType = "osm"; // osm, satellite, terrain
    private boolean showControls = true;
    private boolean allowMarkers = true;
    private String width = "100%";
    private String height = "400px";
    
    // Marcadores y capas
    private JSONArray markers = new JSONArray();
    private JSONArray layers = new JSONArray();
    
    public MapComponent() {
        super();
    }
    
    @Override
    public String getZclass() {
        return "z-mapcomponent";
    }
    
    // Getters y Setters
    public double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(double latitude) {
        if (latitude < -90 || latitude > 90) {
            throw new WrongValueException("Latitude debe estar entre -90 y 90");
        }
        this.latitude = latitude;
        smartUpdate("latitude", latitude);
    }
    
    public double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(double longitude) {
        if (longitude < -180 || longitude > 180) {
            throw new WrongValueException("Longitude debe estar entre -180 y 180");
        }
        this.longitude = longitude;
        smartUpdate("longitude", longitude);
    }
    
    public int getZoom() {
        return zoom;
    }
    
    public void setZoom(int zoom) {
        if (zoom < 0 || zoom > 20) {
            throw new WrongValueException("Zoom debe estar entre 0 y 20");
        }
        this.zoom = zoom;
        smartUpdate("zoom", zoom);
    }
    
    public String getMapType() {
        return mapType;
    }
    
    public void setMapType(String mapType) {
        this.mapType = mapType;
        smartUpdate("mapType", mapType);
    }
    
    public boolean isShowControls() {
        return showControls;
    }
    
    public void setShowControls(boolean showControls) {
        this.showControls = showControls;
        smartUpdate("showControls", showControls);
    }
    
    public boolean isAllowMarkers() {
        return allowMarkers;
    }
    
    public void setAllowMarkers(boolean allowMarkers) {
        this.allowMarkers = allowMarkers;
        smartUpdate("allowMarkers", allowMarkers);
    }
    
    @Override
    public String getWidth() {
        return width;
    }
    
    @Override
    public void setWidth(String width) {
        this.width = width;
        smartUpdate("width", width);
    }
    
    @Override
    public String getHeight() {
        return height;
    }
    
    @Override
    public void setHeight(String height) {
        this.height = height;
        smartUpdate("height", height);
    }
    
    // Métodos para manejar marcadores
    public void addMarker(double lat, double lng, String title, String description) {
        JSONObject marker = new JSONObject();
        marker.put("lat", lat);
        marker.put("lng", lng);
        marker.put("title", title);
        marker.put("description", description);
        markers.add(marker);
        
        response("addMarker", marker);
    }
    
    public void removeMarker(int index) {
        if (index >= 0 && index < markers.size()) {
            markers.remove(index);
            response("removeMarker", index);
        }
    }
    
    public void clearMarkers() {
        markers.clear();
        response("clearMarkers", null);
    }
    
    public JSONArray getMarkers() {
        return markers;
    }
    
    // Método para centrar el mapa
    public void centerMap(double lat, double lng) {
        setLatitude(lat);
        setLongitude(lng);
        JSONObject data = new JSONObject();
        data.put("lat", lat);
        data.put("lng", lng);
        response("centerMap", data);
    }
    
    // Método para establecer vista del mapa
    public void setMapView(double lat, double lng, int zoom) {
        this.latitude = lat;
        this.longitude = lng;
        this.zoom = zoom;
        JSONObject data = new JSONObject();
        data.put("lat", lat);
        data.put("lng", lng);
        data.put("zoom", zoom);
        response("setMapView", data);
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
        render(renderer, "allowMarkers", allowMarkers);
        render(renderer, "markers", markers.toString());
    }
    
    // Eventos del mapa
    public void service(org.zkoss.zk.au.AuRequest request, boolean everError) {
        final String cmd = request.getCommand();
        if ("onMapClick".equals(cmd)) {
            handleMapClick(request);
        } else if ("onMarkerClick".equals(cmd)) {
            handleMarkerClick(request);
        } else {
            super.service(request, everError);
        }
    }
    
    private void handleMapClick(org.zkoss.zk.au.AuRequest request) {
        final Object[] data = request.getData();
        if (data != null && data.length >= 2) {
            double lat = ((Number) data[0]).doubleValue();
            double lng = ((Number) data[1]).doubleValue();
            
            MapClickEvent event = new MapClickEvent("onMapClick", this, lat, lng);
            Events.postEvent(event);
        }
    }
    
    private void handleMarkerClick(org.zkoss.zk.au.AuRequest request) {
        final Object[] data = request.getData();
        if (data != null && data.length >= 1) {
            int markerIndex = ((Number) data[0]).intValue();
            
            MarkerClickEvent event = new MarkerClickEvent("onMarkerClick", this, markerIndex);
            Events.postEvent(event);
        }
    }
}
