import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import './NavigationPanel.css';

// Haversine formula to calculate distance between two lat/lng points (in meters)
function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Reverse mapping: floor code to floor number
function resolveFloorNumber(floorCode) {
  const reverseMap = {
    "XS01": -1,
    "XPTE": 0,
    "XP01": 1,
    "XP02": 2,
    "XP03": 3,
    "XP04": 4,
    "XP05": 5,
  };
  return reverseMap[floorCode] ?? floorCode;
}

export default function NavigationPanel({ originRoom, destinationRoom, routeNodes, onClose }) {
  const totalDistance = useMemo(() => {
    if (!routeNodes || routeNodes.length < 2) return 0;
    return routeNodes.reduce((sum, pos, idx, arr) => {
      if (idx === 0) return 0;
      return sum + haversineDistance(arr[idx - 1], pos);
    }, 0);
  }, [routeNodes]);

  const walkingSpeed = 1.4; // m/s
  const estimatedTimeMin = useMemo(() => Math.ceil((totalDistance / walkingSpeed) / 60), [totalDistance]);

  const floorChange = useMemo(() => {
    if (!originRoom || !destinationRoom) return false;
    return originRoom.floor_id !== destinationRoom.floor_id;
  }, [originRoom, destinationRoom]);

  if (!originRoom || !destinationRoom || routeNodes.length === 0) return null;

  return (
    <div
      className="navigation-panel"
      style={{
        background: 'linear-gradient(135deg,rgba(20, 83, 142, 0.48) 0%, #e5e7eb 100%)',
        border: '1px solid #d1d5db',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
    >
      <button onClick={onClose} className="nav-close-btn">
        <X className="w-4 h-4" />
      </button>

      <h2 className="nav-title">Navigation</h2>

      <div className="route-summary">
        <div className="route-point">
          <br />
          <div className="point-name">{originRoom.name}</div>
          <div className="point-floor">Floor {resolveFloorNumber(originRoom.floor_id)}</div>
        </div>

        <div className="route-arrow">
          <span className="route-time">{estimatedTimeMin} min</span>
        </div>

        <div className="route-point">
          <br />
          <div className="point-name">{destinationRoom.name}</div>
          <div className="point-floor">Floor {resolveFloorNumber(destinationRoom.floor_id)}</div>
        </div>
      </div>

      {floorChange && (
        <p className="nav-warning">Attention: change of floor requested</p>
      )}

      <p className="nav-detail">
        Distanza: <strong>{(totalDistance / 1000).toFixed(2)} km</strong>
      </p>
    </div>
  );
}

NavigationPanel.propTypes = {
  originRoom: PropTypes.shape({ name: PropTypes.string, floor_id: PropTypes.string }).isRequired,
  destinationRoom: PropTypes.shape({ name: PropTypes.string, floor_id: PropTypes.string }).isRequired,
  routeNodes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onClose: PropTypes.func.isRequired,
};
