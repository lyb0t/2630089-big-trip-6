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
        (dest) => dest.id === orig.destination,
      ),
      isFavorite: orig.is_favorite,
      offers: orig.offers,
      type: orig.type,
    };
  }

  pointDemapper(point) {
    return {
      id: point.id,
      base_price: Number(point.basePrice),
      date_from: point.dateFrom,
      date_to: point.dateTo,
      destination: point.destination.id,
      is_favorite: point.isFavorite,
      offers: point.offers,
      type: point.type,
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
      this.points = this.#points.filter((p) => p.id !== id);
      return true;
    }
    return false;
  }

  async addPoint(point) {
    const res = await myFetch(API_ROUTES.postPoint, {
      method: "POST",
      body: this.pointDemapper(point),
    });

    if (res.ok) {
      const result = this.pointMapper(res.body);
      this.points = [...this.#points, result];
      return result;
    }
    return null;
  }

  async updatePoint(point) {
    const res = await myFetch(API_ROUTES.putPoint(point.id), {
      method: "PUT",
      body: this.pointDemapper(point),
    });

    if (res.ok) {
      const result = this.pointMapper(res.body);
      this.points = this.#points.map((p) => (p.id === point.id ? result : p));
      return result;
    }
    return null;
  }
}

export const POINT_TYPES = [
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
