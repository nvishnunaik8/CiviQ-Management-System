import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ issues, getStatusColor }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <MapContainer center={[40.7589, -73.9851]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {issues.map(
        (issue) =>
          issue.latitude &&
          issue.longitude && (
            <Marker
              key={issue.issue_id}
              position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
              eventHandlers={{ click: () => setSelectedMarker(issue) }}
              icon={L.icon({
                iconUrl: `https://via.placeholder.com/32/${getStatusColor(issue.status)}/ffffff?text=%20`,
                iconSize: [32, 32],
              })}
            >
              <Popup>
                <div>
                  <strong>{issue.title}</strong>
                  <p>{issue.category}</p>
                  <p>{issue.address}</p>
                  <p>Status: {issue.status}</p>
                </div>
              </Popup>
            </Marker>
          ),
      )}
    </MapContainer>
  );
}
