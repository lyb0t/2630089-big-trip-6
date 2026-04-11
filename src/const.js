const API_ROUTES = {
  loadPoints: "/points",
  postPoint: `/points`,
  putPoint: (id) => `/points/${id}`,
  deletePoint: (id) => `/points/${id}`,

  destinations: "/destinations",
  offers: "/offers",
};

export { API_ROUTES };
