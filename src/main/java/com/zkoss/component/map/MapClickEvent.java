package com.zkoss.component.map;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;

/**
 * Evento que se dispara cuando se hace clic en el mapa
 */
public class MapClickEvent extends Event {
    
    private static final long serialVersionUID = 1L;
    
    private final double latitude;
    private final double longitude;
    
    public MapClickEvent(String name, Component target, double latitude, double longitude) {
        super(name, target);
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    /**
     * @return La latitud donde se hizo clic
     */
    public double getLatitude() {
        return latitude;
    }
    
    /**
     * @return La longitud donde se hizo clic
     */
    public double getLongitude() {
        return longitude;
    }
    
    @Override
    public String toString() {
        return "MapClickEvent{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
