package com.zkoss.component.map.leaflet;

import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.json.JSONObject;

import com.zkoss.component.map.core.AbstractMapComponent;
import com.zkoss.component.map.core.MapClickEvent;
import com.zkoss.component.map.core.MarkerClickEvent;

/**
 * Componente de mapa interactivo para ZK Framework que utiliza Leaflet
 */
public class LFMapComponent extends AbstractMapComponent {
    
    private static final long serialVersionUID = 1L;
    
    private String tileProvider = "osm"; // Proveedor de tiles: osm, mapbox, etc
    private String tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // URL para los tiles
    private String attribution = "© OpenStreetMap contributors"; // Atribución para el mapa
    private String accessToken = ""; // Token de acceso para proveedores que lo requieren (Mapbox)
    
    public LFMapComponent() {
        super();
    }
    
    @Override
    public String getZclass() {
        return "z-lfmapcomponent";
    }
    
    /**
     * Establece el proveedor de tiles
     * @param tileProvider Proveedor (osm, mapbox, etc)
     */
    public void setTileProvider(String tileProvider) {
        this.tileProvider = tileProvider;
        configureTileProvider();
        smartUpdate("tileProvider", tileProvider);
        smartUpdate("tileUrl", tileUrl);
        smartUpdate("attribution", attribution);
    }
    
    /**
     * Obtiene el proveedor de tiles actual
     * @return Proveedor de tiles
     */
    public String getTileProvider() {
        return tileProvider;
    }
    
    /**
     * Establece el token de acceso para proveedores como Mapbox
     * @param accessToken Token de acceso
     */
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        configureTileProvider();
        smartUpdate("accessToken", accessToken);
        smartUpdate("tileUrl", tileUrl);
    }
    
    /**
     * Obtiene el token de acceso actual
     * @return Token de acceso
     */
    public String getAccessToken() {
        return accessToken;
    }
    
    /**
     * Configura los detalles del proveedor de tiles
     */
    private void configureTileProvider() {
        switch (tileProvider.toLowerCase()) {
            case "mapbox":
                this.tileUrl = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
                this.attribution = "© <a href=\"https://www.mapbox.com/about/maps/\">Mapbox</a> © <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>";
                break;
            case "carto":
                this.tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
                this.attribution = "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>, © <a href=\"https://carto.com/attributions\">CARTO</a>";
                break;
            case "esri":
                this.tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
                this.attribution = "© Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
                break;
            default:
                this.tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
                this.attribution = "© OpenStreetMap contributors";
        }
    }
    
    @Override
    protected void handleAddMarker(JSONObject marker) {
        response("addMarker", marker);
    }
    
    @Override
    protected void handleRemoveMarker(int index) {
        response("removeMarker", index);
    }
    
    @Override
    protected void handleClearMarkers() {
        response("clearMarkers", null);
    }
    
    @Override
    protected void handleCenterMap(double lat, double lng) {
        JSONObject data = new JSONObject();
        data.put("lat", lat);
        data.put("lng", lng);
        response("centerMap", data);
    }
    
    @Override
    protected void handleSetMapView(double lat, double lng, int zoom) {
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
        render(renderer, "tileProvider", tileProvider);
        render(renderer, "tileUrl", tileUrl);
        render(renderer, "attribution", attribution);
        render(renderer, "accessToken", accessToken);
    }
    
    // Eventos del mapa
    @Override
    public void service(AuRequest request, boolean everError) {
        final String cmd = request.getCommand();
        if ("onMapClick".equals(cmd)) {
            handleMapClick(request);
        } else if ("onMarkerClick".equals(cmd)) {
            handleMarkerClick(request);
        } else {
            super.service(request, everError);
        }
    }
    
    private void handleMapClick(AuRequest request) {
        final Object[] data = request.getData();
        if (data != null && data.length >= 2) {
            double lat = ((Number) data[0]).doubleValue();
            double lng = ((Number) data[1]).doubleValue();
            
            MapClickEvent event = new MapClickEvent("onMapClick", this, lat, lng);
            Events.postEvent(event);
        }
    }
    
    private void handleMarkerClick(AuRequest request) {
        final Object[] data = request.getData();
        if (data != null && data.length >= 1) {
            int markerIndex = ((Number) data[0]).intValue();
            
            MarkerClickEvent event = new MarkerClickEvent("onMarkerClick", this, markerIndex);
            Events.postEvent(event);
        }
    }
}
