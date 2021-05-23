let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.9228288, lng: -57.9562555 },
    zoom: 16,
  });
}