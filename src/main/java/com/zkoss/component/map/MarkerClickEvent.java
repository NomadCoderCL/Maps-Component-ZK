package com.zkoss.component.map;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;

/**
 * Evento que se dispara cuando se hace clic en un marcador
 */
public class MarkerClickEvent extends Event {
    
    private static final long serialVersionUID = 1L;
    
    private final int markerIndex;
    
    public MarkerClickEvent(String name, Component target, int markerIndex) {
        super(name, target);
        this.markerIndex = markerIndex;
    }
    
    /**
     * @return El índice del marcador que se hizo clic
     */
    public int getMarkerIndex() {
        return markerIndex;
    }
    
    /**
     * @return El componente MapComponent que contiene el marcador
     */
    public MapComponent getMapComponent() {
        return (MapComponent) getTarget();
    }
    
    @Override
    public String toString() {
        return "MarkerClickEvent{" +
                "markerIndex=" + markerIndex +
                '}';
    }
}
