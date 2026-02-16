const Route = require("../models/Route");

// Add new route (admin)
exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Search routes
exports.searchRoutes = async (req, res) => {
  const { source, destination } = req.query;

  const routes = await Route.find({
    source,
    destination
  });

  res.json(routes);
};

exports.getDestinationsBySource = async (req, res) => {
  const { source } = req.query;

  if (!source) {
    return res.json([]);
  }

  const destinations = await Route.distinct("destination", {
    source: source
  });

  res.json(destinations);
};