import { API_ROUTES } from "../const";
import { myFetch } from "../utils";

export class PointsModel {
  #points = [];
  #destinationsModel = null;
  #changeListeners = [];

  constructor({ destinationsModel }) {
    this.#destinationsModel = destinationsModel;
  }

  addChangeListener(listener) {
    this.#changeListeners.push(listener);
  }

  get points() {
    return this.#points;
  }

  set points(newPoints) {
    this.#points = newPoints;
    this.#changeListeners.forEach((listener) => listener(newPoints));
  }

  pointMapper(orig) {
    return {
      id: orig.id,
      basePrice: orig.base_price,
      dateFrom: orig.date_from,
      dateTo: orig.date_to,
      destination: this.#destinationsModel.destinations.find(
        (dest) => dest.id === orig.destination
      ),
      isFavorite: orig.is_favorite,
      offers: orig.offers,
      type: orig.type,
    };
  }

  async loadPoints() {
    const res = await myFetch(API_ROUTES.loadPoints);
    if (res.ok) {
      this.points = res.body.map((point) => this.pointMapper(point));
    }
  }

  async removePoint(id) {
    const res = await myFetch(API_ROUTES.deletePoint(id), {
      method: "DELETE",
    });

    if (res.ok) {
      await this.loadPoints();
    }
  }

  async updatePoint(point) {
    const res = await myFetch(API_ROUTES.removePoint(point.id), {
      method: "PUT",
      body: point,
    });

    if (res.ok) {
      const result = res.json();
      this.loadPoints();
      return result;
    }
    return null;
  }
}
