const filters = {
  everything: (points) => points,
  future: (points) => points.filter((p) => +new Date(p.dateFrom) > Date.now()),
  present: (points) =>
    points.filter(
      (p) =>
        +new Date(p.dateFrom) <= Date.now() &&
        +new Date(p.dateTo) >= Date.now(),
    ),
  past: (points) => points.filter((p) => +new Date(p.dateTo) < Date.now()),
};

export class FiltersModel {
  #filter = "everything";

  filtersKeys = Object.keys(filters);

  #changeListeners = [];
  addChangeListener(listener) {
    this.#changeListeners.push(listener);
  }

  filterPoints(points, filter) {
    return filters[filter || this.#filter](points);
  }

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    if (!this.filtersKeys.includes(filter)) {
      throw new Error(`filter can be: ${Object.keys(filters).join(", ")}`);
    }
    this.#filter = filter;
    this.#changeListeners.forEach((listener) => listener(filter));
  }
}
