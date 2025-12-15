let map;
let currentQuestionIndex = 0;
let correctCount = 0;


const locations = [
    {
        name: "Student Health",
        bounds: {
            north: 34.2384,
            south: 34.2380,
            east: -118.5257,
            west: -118.5267
        }
    },
    {
        name: "Arbor Grill",
        bounds: {
            north: 34.2414,
            south: 34.24095,
            east: -118.5295,
            west: -118.5301
        }
    },
    {
        name: "Library",
        bounds: {
            north: 34.2405,
            south: 34.2395,
            east: -118.5286,
            west: -118.5301
        }
    },
    {
        name: "Live Oak Hall",
        bounds: {
            north: 34.2384,
            south: 34.2382,
            east: -118.5277,
            west: -118.5287
        }
    },
    {
        name: "Eucalyptus Hall",
        bounds: {
            north: 34.2387,
            south: 34.2385,
            east: -118.5277,
            west: -118.5287
        }
    },


];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.2400, lng: -118.5280 },
        zoom: 17,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        gestureHandling: "none",
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });




    // const testBox = new google.maps.Rectangle({
    //     map: map,
    //     bounds: {
    //         north: 34.2415,
    //         south: 34.2401,
    //         east: -118.5275,
    //         west: -118.5282
    //     },
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    //     strokeColor: "#FF0000"
    // });

    shuffleArray(locations);

    locations.forEach(loc => {
        const rect = new google.maps.Rectangle({
            map: map,
            bounds: loc.bounds,
            fillColor: "#808080",
            fillOpacity: 0.25,
            strokeColor: "#555555",
            strokeWeight: 1,
            clickable: true
        });

        const originalBounds = loc.bounds;
        const hoverBounds = enlargeBounds(originalBounds, 1.10);

        rect.addListener("mouseover", () => {
            rect.setOptions({
                fillOpacity: 0.45,         
                strokeWeight: 2,
                bounds: hoverBounds        
            });
        });

        // Restore effect (mouseout)
        rect.addListener("mouseout", () => {
            rect.setOptions({
                fillOpacity: 0.25,
                strokeWeight: 1,
                bounds: originalBounds
            });
        });

        rect.addListener("dblclick", (event) => {
            checkAnswer(event.latLng);
        });
    });


    askQuestion();

    // Listen for double-click answers
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


window.onload = initMap;

function askQuestion() {
    const q = locations[currentQuestionIndex].name;
    document.getElementById("currentQuestion").innerText = q;
}

function checkAnswer(latLng) {
    const loc = locations[currentQuestionIndex];

    const within =
        latLng.lat() < loc.bounds.north &&
        latLng.lat() > loc.bounds.south &&
        latLng.lng() < loc.bounds.east &&
        latLng.lng() > loc.bounds.west;

    if (within) {
        correctCount++;
        showArea(loc.bounds, "#00FF00"); // green
        document.getElementById("feedback").innerText = "Correct!";
    } else {
        showArea(loc.bounds, "#FF0000"); // red
        document.getElementById("feedback").innerText = "Incorrect!";
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= locations.length) {
        endGame();
    } else {
        askQuestion();
    }
}

function showArea(bounds, color) {
    new google.maps.Rectangle({
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        bounds: bounds
    });
}

function endGame() {
    document.getElementById("currentQuestion").innerText = "";
    document.getElementById("feedback").innerText = `Game Over!`;
    document.getElementById("score").innerText =
        `${correctCount} Correct, ${locations.length - correctCount} Incorrect`;
}

function enlargeBounds(bounds, scale) {
    const north = bounds.north;
    const south = bounds.south;
    const east = bounds.east;
    const west = bounds.west;

    // Calculate center
    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;

    // Half-size of bounds
    const halfLat = (north - south) / 2 * scale;
    const halfLng = (east - west) / 2 * scale;

    // New scaled bounds
    return {
        north: centerLat + halfLat,
        south: centerLat - halfLat,
        east: centerLng + halfLng,
        west: centerLng - halfLng
    };
}