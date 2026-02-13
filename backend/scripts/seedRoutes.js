require("dotenv").config();
const mongoose = require("mongoose");
const Route = require("../src/models/Route");

const MONGO_URI = process.env.MONGO_URI;
const cityPairs = [
  // Delhi & North India
  ["Delhi", "Agra", 230],
  ["Delhi", "Jaipur", 280],
  ["Delhi", "Dehradun", 250],
  ["Delhi", "Chandigarh", 245],
  ["Delhi", "Lucknow", 550],
  ["Delhi", "Manali", 540],
  ["Delhi", "Haridwar", 220],
  ["Delhi", "Rishikesh", 240],
  ["Delhi", "Amritsar", 450],
  ["Delhi", "Shimla", 350],
  ["Delhi", "Jammu", 600],
  ["Delhi", "Varanasi", 820],
  ["Delhi", "Kanpur", 500],

  // Uttar Pradesh Belt
  ["Lucknow", "Kanpur", 90],
  ["Lucknow", "Varanasi", 320],
  ["Kanpur", "Varanasi", 330],
  ["Agra", "Lucknow", 330],
  ["Agra", "Jaipur", 240],
  ["Varanasi", "Prayagraj", 120],

  // Rajasthan
  ["Jaipur", "Udaipur", 395],
  ["Jaipur", "Jodhpur", 340],
  ["Jaipur", "Bikaner", 335],
  ["Udaipur", "Jodhpur", 250],
  ["Jodhpur", "Bikaner", 250],

  // Mumbai Region
  ["Mumbai", "Pune", 150],
  ["Mumbai", "Nashik", 165],
  ["Mumbai", "Surat", 280],
  ["Mumbai", "Ahmedabad", 530],
  ["Mumbai", "Indore", 585],
  ["Pune", "Nashik", 210],
  ["Pune", "Kolhapur", 230],
  ["Pune", "Aurangabad", 240],

  // Gujarat
  ["Ahmedabad", "Vadodara", 110],
  ["Ahmedabad", "Surat", 270],
  ["Surat", "Vadodara", 150],
  ["Rajkot", "Ahmedabad", 215],
  ["Vadodara", "Rajkot", 300],

  // Madhya Pradesh
  ["Indore", "Bhopal", 195],
  ["Bhopal", "Jabalpur", 330],
  ["Indore", "Ujjain", 55],
  ["Bhopal", "Gwalior", 420],

  // Karnataka
  ["Bengaluru", "Mysuru", 145],
  ["Bengaluru", "Chennai", 350],
  ["Bengaluru", "Hyderabad", 570],
  ["Bengaluru", "Hubli", 410],
  ["Mysuru", "Mangalore", 250],

  // Tamil Nadu
  ["Chennai", "Coimbatore", 500],
  ["Chennai", "Madurai", 460],
  ["Chennai", "Salem", 340],
  ["Coimbatore", "Madurai", 215],

  // Telangana & AP
  ["Hyderabad", "Vijayawada", 275],
  ["Hyderabad", "Visakhapatnam", 620],
  ["Vijayawada", "Visakhapatnam", 350],
  ["Hyderabad", "Warangal", 150],

  // Odisha (Odisa Tier Cities)
  ["Bhubaneswar", "Puri", 60],
  ["Bhubaneswar", "Cuttack", 30],
  ["Bhubaneswar", "Rourkela", 320],
  ["Bhubaneswar", "Sambalpur", 320],
  ["Cuttack", "Sambalpur", 280],
  ["Puri", "Berhampur", 170],
  ["Bhubaneswar", "Balasore", 200],
  ["Balasore", "Kolkata", 230],

  // West Bengal
  ["Kolkata", "Durgapur", 170],
  ["Kolkata", "Siliguri", 560],
  ["Durgapur", "Asansol", 50],

  // Punjab / Haryana
  ["Chandigarh", "Ludhiana", 110],
  ["Chandigarh", "Patiala", 75],
  ["Ludhiana", "Amritsar", 140],
  ["Panipat", "Delhi", 95],

  // Himachal
  ["Shimla", "Manali", 250],
  ["Chandigarh", "Manali", 310],

  // Bihar
  ["Patna", "Gaya", 110],
  ["Patna", "Varanasi", 260],

  // Jharkhand
  ["Ranchi", "Jamshedpur", 130],
  ["Ranchi", "Patna", 330]
];

async function seedRoutes() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");

  for (const [source, destination, distanceKm] of cityPairs) {
    const exists = await Route.findOne({ source, destination });

    if (!exists) {
      await Route.create({ source, destination, distanceKm });
      console.log(`Created route: ${source} → ${destination}`);
    }
  }

  console.log("Route seeding done ✅");
  process.exit();
}

seedRoutes();