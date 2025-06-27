package com.zkoss.component.map.core;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;

/**
 * Evento generado cuando se hace clic en cualquier punto del mapa
 */
public class MapClickEvent extends Event {
    private static final long serialVersionUID = 1L;
    
    private final double latitude;
    private final double longitude;
    
    /**
     * Constructor para el evento de clic en mapa
     * 
     * @param name Nombre del evento (normalmente "onMapClick")
     * @param target Componente que generó el evento
     * @param lat Latitud del punto donde se hizo clic
     * @param lng Longitud del punto donde se hizo clic
     */
    public MapClickEvent(String name, Component target, double lat, double lng) {
        super(name, target);
        this.latitude = lat;
        this.longitude = lng;
    }
    
    /**
     * Obtiene la latitud del punto donde se hizo clic
     * @return Latitud en grados decimales
     */
    public double getLatitude() {
        return latitude;
    }
    
    /**
     * Obtiene la longitud del punto donde se hizo clic
     * @return Longitud en grados decimales
     */
    public double getLongitude() {
        return longitude;
    }
}
