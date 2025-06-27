package com.zkoss.component.map.core;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;

/**
 * Evento generado cuando se hace clic en un marcador del mapa
 */
public class MarkerClickEvent extends Event {
    private static final long serialVersionUID = 1L;
    
    private final int markerIndex;
    
    /**
     * Constructor para el evento de clic en marcador
     * 
     * @param name Nombre del evento (normalmente "onMarkerClick")
     * @param target Componente que generó el evento
     * @param markerIndex Índice del marcador que recibió el clic
     */
    public MarkerClickEvent(String name, Component target, int markerIndex) {
        super(name, target);
        this.markerIndex = markerIndex;
    }
    
    /**
     * Obtiene el índice del marcador que recibió el clic
     * @return Índice del marcador en la colección de marcadores
     */
    public int getMarkerIndex() {
        return markerIndex;
    }
}
