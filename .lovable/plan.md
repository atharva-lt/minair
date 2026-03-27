

# HYPRO — Zone-Based AQI Map Page

## Overview
Add a new "HYPRO" page featuring an interactive AQI map of Chennai using `react-leaflet` and OpenStreetMap tiles. Zones are shown as color-coded circles with click-to-reveal AQI details.

---

## Architecture

```text
src/
├── lib/zone-data.ts          ← Zone coordinates + mock AQI data
├── components/
│   ├── MapView.tsx            ← Leaflet map with CircleMarkers + popups
│   └── AqiMapLegend.tsx       ← Color legend overlay
├── pages/Hypro.tsx            ← Page wrapper
```

---

## Plan

### 1. Install dependencies
- `react-leaflet`, `leaflet`, `@types/leaflet`
- Import Leaflet CSS in `index.css`

### 2. Zone data module (`src/lib/zone-data.ts`)
- Export an array of zones: `{ name, lat, lon, aqi, healthMessage }`
- 5 zones: North, South, East, West, Central Chennai
- Helper function `getAqiColor(aqi)` returning green/yellow/orange/red

### 3. MapView component (`src/components/MapView.tsx`)
- `MapContainer` centered on Chennai (13.08, 80.27), zoom 12
- Render each zone as a `CircleMarker` with radius ~800m, fill color from `getAqiColor`
- `Popup` on click showing zone name, AQI value, and health message
- Full height, responsive container

### 4. AQI legend (`src/components/AqiMapLegend.tsx`)
- Positioned bottom-right over the map
- Shows 4 color swatches with AQI ranges (0-50, 51-100, 101-150, 151+)

### 5. HYPRO page (`src/pages/Hypro.tsx`)
- Renders `MapView` full-width with a small title header
- Clean layout matching existing page styles

### 6. Routing & sidebar
- Add `/hypro` route in `App.tsx`
- Add "HYPRO" entry with `MapPin` icon to sidebar items in `AppSidebar.tsx`

---

## Technical Notes
- Leaflet requires its CSS imported globally to render tiles/controls correctly
- `CircleMarker` (pixel-based) will be used instead of `Circle` (meter-based) for consistent sizing across zoom levels
- Zone data is decoupled from UI, making it easy to swap mock data for live API later

