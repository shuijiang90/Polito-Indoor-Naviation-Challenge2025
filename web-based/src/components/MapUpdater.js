// src/components/MapUpdater.js
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ rooms }) {
  const map = useMap();

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;

    // Helper per estrarre tutti i latlng
    const allLatlngs = rooms.flatMap(room => {
      if (!room.geometry || room.geometry.type !== "Polygon") return [];
      return room.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    });

    if (allLatlngs.length === 0) return;

    if (rooms.length === 1) {
      // Se c'è solo una stanza, centriamo e manteniamo un buon zoom
      map.setView(allLatlngs[0], 18, { animate: true });
    } else {
      // Se ci sono più stanze, adattiamo i bounds per farle stare tutte
      map.fitBounds(allLatlngs, { padding: [20, 20], animate: true });
    }
  }, [rooms, map]);

  return null;
}
