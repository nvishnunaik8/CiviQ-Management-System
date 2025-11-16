import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet icons fix (so markers show correctly when bundling)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * MapView
 * Props:
 *  - issues: array of issue objects (each must have location.coordinates = [lng, lat])
 *  - center: [lat, lng]
 *  - zoom: number
 *  - onMarkerClick(issue): optional callback when user clicks "Open" in popup
 */
export default function MapView({ issues = [], center = [20.5937, 78.9629], zoom = 6, onMarkerClick }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '80vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {issues.map(issue => {
        const coords = issue?.location?.coordinates;
        if (!coords || coords.length < 2) return null;
        const [lng, lat] = coords;

        return (
          <Marker key={issue._id} position={[lat, lng]}>
            <Popup minWidth={200}>
              <div style={{ maxWidth: 220 }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>{issue.title || issue.category}</strong>
                <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>
                  {issue.description ? (issue.description.length > 140 ? issue.description.slice(0, 137) + '...' : issue.description) : ''}
                </div>

                {issue.imageUrl && (
                  <img src={issue.imageUrl} alt="issue" style={{ width: '100%', height: 100, objectFit: 'cover', marginBottom: 6 }} />
                )}

                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button onClick={() => onMarkerClick && onMarkerClick(issue)} style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                    Open
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
