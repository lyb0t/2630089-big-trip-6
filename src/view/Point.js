import { createElement } from "../framework/render";
import AbstractView from "../framework/view/abstract-view";
import {
  capitalizeFirstLetter,
  dateDifference,
  formatToMonthDay,
} from "../utils";

export default class PointView extends AbstractView {
  constructor(point, onEdit) {
    super();
    this.point = point;
    this.onEdit = onEdit;
  }

  get template() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="2019-03-18">${formatToMonthDay(
            this.point.dateFrom
          )}
          </time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${
              this.point.type
            }.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalizeFirstLetter(
            this.point.type
          )}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${
                this.point.dateFrom
              }">${
      new Date(this.point.dateFrom).getHours() +
      ":" +
      new Date(this.point.dateFrom).getMinutes()
    }</time>
              &mdash;
              <time class="event__end-time" datetime="${this.point.dateTo}">${
      new Date(this.point.dateFrom).getHours() +
      ":" +
      new Date(this.point.dateTo).getMinutes()
    }</time>
            </p>
            <p class="event__duration">${
              dateDifference(this.point.dateFrom, this.point.dateTo).diffStr
            }</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${
              this.point.basePrice
            }</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this.point.offers.map(
              (offer) => `
              <li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </li>
            `
            )}
            
          </ul>
          <button class="event__favorite-btn event__favorite-btn--active" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  get element() {
    if (this._element) {
      return this._element;
    }
    const elem = createElement(this.template);
    const editBtn = elem.querySelector(".event__rollup-btn");
    editBtn.addEventListener("click", (e) => this.onEdit(e, this, elem));
    this._element = elem;
    return this._element;
  }
}
