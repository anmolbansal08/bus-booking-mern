require("dotenv").config();
const mongoose = require("mongoose");
const Bus = require("../src/models/Bus");
const Route = require("../src/models/Route");

const MONGO_URI = process.env.MONGO_URI;

const operatorNames = [
  "HriKri Travels",
  "Royal Express",
  "Mountain Rider",
  "Night Queen",
  "CityLine Coaches",
  "GreenLine Travels",
  "Skyway Express",
  "Silver Arrow",
  "Comfort Cruiser",
  "Volvo Premium"
];

const busTypes = [
  "AC Sleeper",
  "Non-AC Seater",
  "AC Seater",
  "Luxury Sleeper",
  "Semi Sleeper"
];

function generateAvailability() {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 100);

  return {
    from: today.toISOString().split("T")[0],
    to: future.toISOString().split("T")[0],
    daysOfWeek: ["MON","TUE","WED","THU","FRI","SAT","SUN"]
  };
}

function calculateSeatPrice(distanceKm, type) {
  const baseFare = 200;
  const perKmRate = type === "SLEEPER" ? 2.8 : 1.8;
  const raw = baseFare + distanceKm * perKmRate;
  return Math.round(raw / 10) * 10;
}

function randomAmenities() {
  const all = [
    "Charging Point",
    "Water Bottle",
    "Blanket",
    "CCTV",
    "GPS Tracking",
    "Reading Light",
    "Emergency Exit",
    "Fire Extinguisher"
  ];

  const shuffled = all.sort(() => 0.5 - Math.random());
  const count = 3 + Math.floor(Math.random() * 3);
  return shuffled.slice(0, count);
}

function generateSeatLayout(distanceKm) {
  const seats = [];

  for (let i = 1; i <= 20; i++) {
    seats.push({
      seatNumber: `L${i}`,
      deck: "LOWER",
      type: "SEATER",
      price: calculateSeatPrice(distanceKm, "SEATER"),
      femaleOnly: i % 7 === 0
    });
  }

  for (let i = 1; i <= 10; i++) {
    seats.push({
      seatNumber: `U${i}`,
      deck: "UPPER",
      type: "SLEEPER",
      price: calculateSeatPrice(distanceKm, "SLEEPER"),
      femaleOnly: i % 9 === 0
    });
  }

  return seats;
}

function randomTime(startHour = 18) {
  const hour = startHour + Math.floor(Math.random() * 6);
  const min = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

async function seedBuses() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");

  const routes = await Route.find();

  if (!routes.length) {
    console.log("No routes found. Seed routes first.");
    process.exit();
  }

  const busesToInsert = [];

  for (const route of routes) {
    const distanceKm = route.distanceKm || 300;

    const busCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < busCount; i++) {
      const operator =
        operatorNames[Math.floor(Math.random() * operatorNames.length)];

      const type =
        busTypes[Math.floor(Math.random() * busTypes.length)];

      busesToInsert.push({
        name: `${operator} (${type})`,
        routeId: route._id,
        departureTime: randomTime(18),
        arrivalTime: randomTime(4),
        seatLayout: generateSeatLayout(distanceKm),
        amenities: randomAmenities(),
        availability: generateAvailability(),
        busInfo: {
          highlights: [
            `${type} coach`,
            `${distanceKm} km route`,
            "Professional staff"
          ],
          routeStops: [route.source, route.destination],
          boardingPoints: [],
          droppingPoints: []
        },
        isSeeded: true
      });
    }
  }

  await Bus.insertMany(busesToInsert);
  console.log(`Inserted ${busesToInsert.length} buses 🚀`);
  process.exit();
}

seedBuses();