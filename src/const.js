const POINT_TYPES = [
  "taxi",
  "bus",
  "train",
  "ship",
  "drive",
  "flight",
  "check-in",
  "sightseeing",
  "restaurant",
];

const API_ROUTES = {
  loadPoints: "/points",
  putPoint: (id) => `/points/${id}`,
  deletePoint: (id) => `/points/${id}`,

  destinations: "/destinations",
  offers: "/offers",
};

export { POINT_TYPES, API_ROUTES };
