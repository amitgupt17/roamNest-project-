
  const map = L.map('map').setView(mapConfig.coordinates,10);

  L.tileLayer(`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${mapConfig.token}`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
   
    crossOrigin: true
  }).addTo(map);
function createColoredMarker(color = 'red') {
   const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 39" width="24" height="39">
         <path d="M12 0C5.373 0 0 5.373 0 12c0 10.5 12 27 12 27s12-16.5 12-27c0-6.627-5.373-12-12-12z" fill="${color}"/>
         <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
   `;

   return L.divIcon({
      className: 'custom-marker', 
      html: svg,
      iconSize: [24, 39],
      iconAnchor: [12, 39],
      popupAnchor: [0, -35] 
   });
}
  L.marker(mapConfig.coordinates,{ icon: createColoredMarker('red') })
    .addTo(map)
    .bindPopup(`<h4>${mapConfig.titles}</h4><p>Exact Location provided after booking</p>`)
    .openPopup();