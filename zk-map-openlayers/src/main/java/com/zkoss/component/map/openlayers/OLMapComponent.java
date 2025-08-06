package com.zkoss.component.map.openlayers;

import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.json.JSONObject;

import com.zkoss.component.map.core.AbstractMapComponent;
import com.zkoss.component.map.core.MapClickEvent;
import com.zkoss.component.map.core.MarkerClickEvent;

/**
 * Componente de mapa interactivo para ZK Framework que utiliza OpenLayers
 */
public class OLMapComponent extends AbstractMapComponent {
    
    private static final long serialVersionUID = 1L;
    
    public OLMapComponent() {
        super();
    }
    
    @Override
    public String getZclass() {
        return "z-olmapcomponent";
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
