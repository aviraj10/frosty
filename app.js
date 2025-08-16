let map;
let marker;

function initMap() {
    const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India center
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: defaultLocation,
    });
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
    });
}

// SOS Button click
document.getElementById("sosBtn").addEventListener("click", () => {
    alert("SOS sent to 3 contacts!");
    // Here you can call Firebase Function to send SMS via Twilio
});
