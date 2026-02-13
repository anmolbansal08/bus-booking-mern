const mongoose = require("mongoose");
const Bus = require("../src/models/Bus");
const Route = require("../src/models/Route");

const MONGO_URI = process.env.MONGO_URI || "REMOVED";

const cityPairs = [
  // Delhi NCR & North
  ["Delhi", "Agra"],
  ["Delhi", "Jaipur"],
  ["Delhi", "Dehradun"],
  ["Delhi", "Chandigarh"],
  ["Delhi", "Haridwar"],
  ["Delhi", "Rishikesh"],
  ["Delhi", "Shimla"],
  ["Delhi", "Manali"],
  ["Delhi", "Lucknow"],
  ["Delhi", "Amritsar"],
  ["Delhi", "Jodhpur"],
  ["Delhi", "Udaipur"],

  // Rajasthan cluster
  ["Jaipur", "Udaipur"],
  ["Jaipur", "Jodhpur"],
  ["Jaipur", "Kota"],
  ["Udaipur", "Jodhpur"],
  ["Jodhpur", "Bikaner"],

  // Punjab / Haryana
  ["Chandigarh", "Amritsar"],
  ["Chandigarh", "Ludhiana"],
  ["Chandigarh", "Patiala"],
  ["Ludhiana", "Amritsar"],

  // Uttar Pradesh
  ["Lucknow", "Kanpur"],
  ["Lucknow", "Varanasi"],
  ["Kanpur", "Agra"],
  ["Varanasi", "Prayagraj"],
  ["Agra", "Mathura"],

  // Maharashtra
  ["Mumbai", "Pune"],
  ["Mumbai", "Nashik"],
  ["Mumbai", "Aurangabad"],
  ["Pune", "Nashik"],
  ["Pune", "Kolhapur"],
  ["Nagpur", "Amravati"],

  // Gujarat
  ["Ahmedabad", "Surat"],
  ["Ahmedabad", "Vadodara"],
  ["Surat", "Vadodara"],
  ["Rajkot", "Ahmedabad"],

  // Karnataka
  ["Bengaluru", "Mysuru"],
  ["Bengaluru", "Hubli"],
  ["Bengaluru", "Mangalore"],
  ["Mysuru", "Mangalore"],

  // Tamil Nadu
  ["Chennai", "Coimbatore"],
  ["Chennai", "Madurai"],
  ["Chennai", "Salem"],
  ["Coimbatore", "Madurai"],
  ["Madurai", "Trichy"],

  // Telangana / Andhra
  ["Hyderabad", "Vijayawada"],
  ["Hyderabad", "Warangal"],
  ["Vijayawada", "Visakhapatnam"],
  ["Visakhapatnam", "Rajahmundry"],

  // Odisha
  ["Bhubaneswar", "Cuttack"],
  ["Bhubaneswar", "Puri"],
  ["Bhubaneswar", "Sambalpur"],
  ["Cuttack", "Rourkela"],

  // West Bengal
  ["Kolkata", "Durgapur"],
  ["Kolkata", "Siliguri"],
  ["Kolkata", "Asansol"],

  // MP / Central
  ["Indore", "Bhopal"],
  ["Indore", "Ujjain"],
  ["Bhopal", "Jabalpur"]
];

function getNext100DaysRange() {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 100);

  return {
    from: today.toISOString().split("T")[0],
    to: future.toISOString().split("T")[0]
  };
}

function randomTime() {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() / 0.6) * 30;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function createSeatLayout() {
  const seats = [];
  for (let i = 1; i <= 20; i++) {
    seats.push({
      seatNumber: `L${i}`,
      deck: "LOWER",
      type: i <= 10 ? "SEATER" : "SLEEPER",
      price: i <= 10 ? 699 : 999,
      femaleOnly: i === 1 || i === 11
    });
  }
  return seats;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  const availabilityRange = getNext100DaysRange();

  for (const [source, destination] of cityPairs) {
    let route = await Route.findOne({ source, destination });

    if (!route) {
      route = await Route.create({ source, destination });
      console.log(`Created route ${source} → ${destination}`);
    }

    for (let i = 0; i < 3; i++) {
      await Bus.create({
        name: `${source}-${destination} Express ${i + 1}`,
        routeId: route._id,
        departureTime: randomTime(),
        arrivalTime: randomTime(),
        seatLayout: createSeatLayout(),
        amenities: ["Charging Point", "Water Bottle"],
        availability: {
          from: availabilityRange.from,
          to: availabilityRange.to,
          daysOfWeek: ["MON","TUE","WED","THU","FRI","SAT","SUN"]
        }
      });
    }

    console.log(`Seeded buses for ${source} → ${destination}`);
  }

  console.log("Seeding complete 🚀");
  process.exit();
}

seed();