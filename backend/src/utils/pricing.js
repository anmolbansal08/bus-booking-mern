function calculateSeatPrice(distanceKm, type = "SEATER") {
  const baseFare = 200;

  const perKmRate = type === "SLEEPER" ? 2.8 : 1.8;

  const price = baseFare + distanceKm * perKmRate;

  // round to nearest 10
  return Math.round(price / 10) * 10;
}

module.exports = { calculateSeatPrice };