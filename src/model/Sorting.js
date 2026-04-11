const sortFuncs = {
  day: (points) =>
    [...points].sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom)),
  time: (points) =>
    [...points].sort((a, b) => {
      const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
      const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
      return durationB - durationA;
    }),
  price: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
};

export class SortingModel {
  #sortType = "day";

  #changeListeners = [];
  addChangeListener(listener) {
    this.#changeListeners.push(listener);
  }

  sortPoints(points, sortType) {
    const sortedPoints = sortFuncs[sortType || this.#sortType](points);
    return sortedPoints;
  }

  get sortType() {
    return this.#sortType;
  }

  set sortType(sortType) {
    if (!Object.keys(sortFuncs).includes(sortType)) {
      throw new Error(`sortType can be: ${Object.keys(sortFuncs).join(", ")}`);
    }
    this.#sortType = sortType;
    this.#changeListeners.forEach((listener) => listener(sortType));
  }
}
