import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Popup, CircleMarker, LayerGroup, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import NavigationPanel from './NavigationPanel';
import DirectionsPanel from './DirectionsPanel';
import L from 'leaflet';




const getColorByCategory = (category) => {
  const verdi = ['Siepe o Aiuola', 'Aree verdi in piena terra', 'Aree Verdi pensili'];
  const corridoi = ['Corridoio Principale', 'Cortile in porfido o pietra', 'Atrio', 'Ingresso', 'Marciapiedi o banchine in asfalto', 'Porticato', 'Viabilità non asfaltata'];
  const aule = ['Aula', 'Aula Disegno', 'Aula Informatica', 'Aula Laboratorio'];
  const lab = ['Laboratorio Didattico', 'Laboratorio Informatico di Base', 'Laboratorio Ricerca'];
  const scale = ['Scala', 'Scala esterna', 'Ascensore', 'Ascensore esterno', 'Vano Ascensore Vuoto su Piano'];
  const bagni = ['Servizi Igien. Disabili', 'Servizi Igienici', 'Servizi Igienici Donne', 'Servizi Igienici Donne / Disabili', 'Servizi Igienici Uomini', 'Servizi Igienici Uomini / Disabili'];

  if (verdi.includes(category)) return 'green';
  if (corridoi.includes(category)) return 'gray';
  if (aule.includes(category)) return 'navy';
  if (lab.includes(category)) return 'navy';
  if (scale.includes(category)) return 'navy';
  if (bagni.includes(category)) return 'navy';
  return 'white';
};

function normalizeFloor(id) {
  if (id === "XS01") return "-1";
  if (id === "XPTE") return "0";
  if (id.startsWith("XP")) return id.replace("XP", "");
  return id;
}

function RoomShape({ room, single, onInitiate }) {
  const onAdd = (e) => { if (single) e.target.openPopup(); };
  const floor = room.floor_id ? normalizeFloor(room.floor_id) : null;

  const popup = (
    <Popup>
      <strong>{room.room_id}</strong><br />
      Category: {room.category}<br />
      Name: {room.name}<br />
      {floor !== null && <>Floor: {floor}<br /></>}
      <button
        onClick={() => onInitiate(room)}
        className="btn btn-primary small"
      >
        Directions →
      </button>
    </Popup>
  );

  if (room.geometry.type === 'Polygon') {
    const coords = room.geometry.coordinates[0].map(c => [c[1], c[0]]);
    return (
      <Polygon
        key={room.id}
        positions={coords}
        pathOptions={{
          color: getColorByCategory(room.category),
          fillOpacity: 0.5,
          weight: 1,
          opacity: 0.7
        }}
        eventHandlers={{ add: onAdd }}
      >
        {popup}
      </Polygon>
    );
  }

  if (room.geometry.type === 'LineString') {
    const coords = room.geometry.coordinates.map(c => [c[1], c[0]]);
    return (
      <Polyline
        key={room.id}
        positions={coords}
        pathOptions={{ color: 'red', weight: 2, opacity: 0.4 }}
        eventHandlers={{ add: onAdd }}
      >
        {popup}
      </Polyline>
    );
  }

  console.warn('Unsupported geometry for room', room);
  return null;
}

export default function BaseMap({ rooms, allRooms }) {
  const [originRoom, setOriginRoom] = useState(null);
  const [destinationRoom, setDestinationRoom] = useState(null);
  const [routeEdges, setRouteEdges] = useState([]);
  const [routeNodes, setRouteNodes] = useState([]);

  const handleInitiate = (room) => {
    setOriginRoom(null);
    setRouteEdges([]);
    setRouteNodes([]);
    setDestinationRoom(room);
  };

  const handleStart = async (origin, destination) => {
    setOriginRoom(origin);
    setRouteEdges([]);
    setRouteNodes([]);

    try {
      const res = await fetch('http://localhost:5000/api/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originId: origin.id, destinationId: destination.id })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const path = await res.json();
      if (!Array.isArray(path) || path.length === 0) return;

      const edges = path.map(row => row.geom.coordinates.map(c => [c[1], c[0]]));
      const nodes = path.map(row => { const [lon, lat] = row.geom.coordinates[0]; return [lat, lon]; });
      setRouteEdges(edges);
      setRouteNodes(nodes);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Errore server');
    }
  };

  const handleClose = () => {
    setDestinationRoom(null);
    setOriginRoom(null);
    setRouteEdges([]);
    setRouteNodes([]);
  };

  return (
    <div className="map-wrapper relative">
      <MapContainer center={[45.063, 7.661]} zoom={16} maxZoom={25} className="map h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" maxZoom={25} />
        <MapUpdater rooms={rooms} />

        {rooms.map(room => (
          <RoomShape key={room.id} room={room} single={rooms.length === 1} onInitiate={handleInitiate} />
        ))}

        {originRoom && (
          <RoomShape key={`start-${originRoom.id}`} room={originRoom} single={false} onInitiate={() => { }} />
        )}

        {(routeEdges.length > 0 || routeNodes.length > 0) && (
          <LayerGroup key={originRoom?.id || 'route-reset'}>
            {routeEdges.map((seg, i) => <Polyline key={i} positions={seg} pathOptions={{ color: 'red', weight: 4, opacity: 0.8 }} />)}
            {routeNodes.map((pos, idx) => {
              // Nodo iniziale: bandiera verde
              console.log(routeNodes);
              const { position, node_type } = pos;

              if (idx === 0) {
                return (
                  <Marker
                    key="start"
                    position={pos}
                    icon={L.divIcon({
                      className: '',
                      html: `<div style="background: white; border-radius: 50%; padding: 4px; border: 2px solid green; display: flex;
                              justify-content: center; align-items: center; width: 32px; height: 32px;">
                              <span style="font-size: 18px;">🚶‍♂️</span>
                              </div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      popupAnchor: [0, -32],
                    })}
                  />
                );
              }

              // Nodo finale: bandiera a scacchi
              if (idx === routeNodes.length - 1) {
                return (
                  <Marker
                    key="end"
                    position={pos}
                    icon={L.divIcon({
                      className: 'custom-icon',
                      html: '<div style="background:white; border-radius:50%; padding:4px;"><span style="font-size:18px;">🏁</span></div>',
                      iconSize: [30, 30],
                      iconAnchor: [15, 15],
                    })}
                  />
                );
              }

              // Nodo di tipo connection_point → icona “scala”
              if (node_type === "connection_point") {
                return (
                  <Marker
                    key={`conn-${idx}`}
                    position={position}
                    icon={L.divIcon({
                      html: `<div style="background:#fff; border-radius:50%; padding:4px; 
                          border:2px solid #007bff; display:flex; 
                          justify-content:center; align-items:center; width:32px; height:32px;">
                   🪜
                 </div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    })}
                  />
                );
              }

              // Altri nodi intermedi
              return (
                <CircleMarker
                  key={`node-${idx}`}
                  center={pos}
                  radius={3}
                  pathOptions={{ color: 'red', fillOpacity: 1 }}
                />
              );
            })}
          </LayerGroup>
        )}
      </MapContainer>

      {destinationRoom && routeNodes.length === 0 && (
        <DirectionsPanel rooms={allRooms} destinationRoom={destinationRoom} onStart={handleStart} onClose={handleClose} />
      )}

      {/* NavigationPanel compare quando c'è un percorso */}
      {(routeEdges.length > 0 || routeNodes.length > 0) && (
        <NavigationPanel originRoom={originRoom} destinationRoom={destinationRoom} routeNodes={routeNodes} onClose={handleClose} />
      )}
    </div>
  );
}