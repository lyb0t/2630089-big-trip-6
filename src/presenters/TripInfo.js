import { remove, render, RenderPosition } from "../framework/render";
import TripInfoView from "../view/TripInfo";

export default class TripInfoPresenter {
  #pointsModel = null;
  #offersModel = null;
  #sortingModel = null;
  #view = null;
  constructor({ pointsModel, offersModel, sortingModel }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#sortingModel = sortingModel;

    this.#pointsModel.addLoadListener((result) => {
      if (result) {
        this.present();
      }
    });

    this.#pointsModel.addChangeListener(() => {
      this.present();
    });
  }

  removeView() {
    if (this.#view) {
      remove(this.#view);
    }
    this.#view = null;
  }

  _sumOffersPrice(point) {
    let sum = 0;

    for (const id of point.offers) {
      const offer = this.#offersModel.findOfferById(point.type, id);
      sum += offer.price;
    }

    return sum;
  }

  present() {
    this.removeView();
    const points = this.#sortingModel
      .sortPoints(this.#pointsModel.points, "day")
      .reverse();

    if (points.length === 0) {
      return;
    }

    const cities = points.map((p) => p.destination.name);
    const dates = [points[0].dateFrom, points[points.length - 1].dateTo];
    const totalPrice = points.reduce(
      (total, p) => total + p.basePrice + this._sumOffersPrice(p),
      0,
    );

    this.#view = new TripInfoView({
      cities: cities,
      dates: dates,
      price: totalPrice,
    });
    const contentContainer = document.querySelector(".trip-main");
    render(this.#view, contentContainer, RenderPosition.AFTERBEGIN);
  }
}
