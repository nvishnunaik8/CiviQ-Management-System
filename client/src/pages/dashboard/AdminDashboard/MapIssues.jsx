import React, { useContext, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ThemeContext } from "../../../Context/ThemeContext";

// --- Added Helper ---
function AutoZoom({ issues }) {
  const map = useMap();

  useEffect(() => {
    const validIssues = issues
      .filter(
        (i) =>
          (i.latitude && i.longitude) ||
          (i.location && i.location.lat && i.location.lng)
      )
      .map((i) => [
        i.latitude || i.location.lat,
        i.longitude || i.location.lng,
      ]);

    if (validIssues.length > 0) {
      const bounds = L.latLngBounds(validIssues);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [issues, map]);

  return null;
}

// Optional: custom marker icon
const createIcon = (color = "#1976d2") =>
  new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-" +
      color +
      ".png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

export default function MapIssues({ issues }) {
  const { isDark } = useContext(ThemeContext);
const darkMap ="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const lightMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-md border ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
      style={{ height: "80vh", transition: "background-color 0.3s" }}
    >
    <MapContainer
  center={[17.385, 78.4867]}
  zoom={12}
  scrollWheelZoom={true}
  style={{ height: "100%", width: "100%" }}
>
  <TileLayer
    url={isDark ? darkMap : lightMap}
    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
  />

  <AutoZoom issues={issues} />

  {issues
    .filter(
      (i) =>
        (i.latitude && i.longitude) ||
        (i.location && i.location.lat && i.location.lng)
    )
    .map((issue) => {
      const lat = issue.latitude || issue.location.lat;
      const lng = issue.longitude || issue.location.lng;

      return (
        <Marker
          key={issue.id}
          position={[lat, lng]}
          icon={createIcon(isDark ? "blue" : "red")}
        >
          <Popup>
            <strong>{issue.title}</strong>
            <br />
            {issue.description}
            <br />
            {issue.department && <em>{issue.department}</em>}
          </Popup>
        </Marker>
      );
    })}
</MapContainer>

    </div>
  );
}
