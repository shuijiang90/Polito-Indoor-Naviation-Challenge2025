import React, { useState } from 'react';
import SearchBar from './SearchBar';
import './DirectionsPanel.css';  // import del file CSS

export default function DirectionsPanel({ rooms, destinationRoom, onStart, onClose }) {
  const [origin, setOrigin] = useState(null);

  return (
    <div className="directions-panel">
      <h3>Indicazioni</h3>
      <div className="field">
        <label>Punto di partenza</label>
        <SearchBar
          rooms={rooms}
          onRoomSelect={(room) => setOrigin(room)}
          embedded={true}
        />
      </div>
      <div className="field">
        <br/>
        <label>Destinazione</label>
        <input
          type="text"
          value={`${destinationRoom.name} (${destinationRoom.room_id})`}
          disabled
          className="readonly-input"
        />
      </div>
      <div className="buttons">
        <button
          disabled={!origin}
          onClick={() => onStart(origin, destinationRoom)}
          className="btn btn-primary"
        >
          Avvia
        </button>
        <button
          onClick={onClose}
          className="btn btn-secondary"
        >
          Annulla 
        </button>
      </div>
    </div>
  );
}
