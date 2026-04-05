const sortFuncs = {
  day: (points) =>
    [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),
  time: (points) =>
    [...points].sort((a, b) => {
      const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
      const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
      return durationA - durationB;
    }),
  price: (points) => [...points].sort((a, b) => a.basePrice - b.basePrice),
};

export class SortingModel {
  #sortType = "day";

  #changeListeners = [];
  addChangeListener(listener) {
    this.#changeListeners.push(listener);
  }

  sortPoints(points) {
    const sortedPoints = sortFuncs[this.#sortType](points);
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
