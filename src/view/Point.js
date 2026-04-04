import flatpickr from "flatpickr";
import AbstractStatefulView from "../framework/view/abstract-stateful-view";
import { capitalizeFirstLetter } from "../utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default class PointView extends AbstractStatefulView {
  constructor(point, onEdit, onFavoriteClick) {
    super(point);
    this._onEdit = onEdit;
    this._onFavoriteClick = onFavoriteClick;
  }

  _restoreHandlers() {
    const editBtn = this.element.querySelector(".event__rollup-btn");
    editBtn.addEventListener("click", (e) =>
      this._onEdit(e, this, this.element)
    );

    const favBtn = this.element.querySelector(".event__favorite-btn");
    favBtn.addEventListener("click", (e) => {
      this._onFavoriteClick(e, this, this.element);
      this.updateElement({ isFavorite: !this._state.isFavorite });
    });
  }

  _formatDuration(dateFrom, dateTo) {
    const diffMs = dayjs(dateTo).diff(dayjs(dateFrom));
    const dur = dayjs.duration(diffMs);
    const days = Math.floor(dur.asDays());
    const hours = dur.hours();
    const minutes = dur.minutes();

    if (days > 0) {
      return `${days}D ${hours}H ${minutes}M`;
    } else if (hours > 0) {
      return `${hours}H ${minutes}M`;
    } else {
      return `${minutes}M`;
    }
  }

  get template() {
    const dateFrom = dayjs(this._state.dateFrom);
    const dateTo = dayjs(this._state.dateTo);

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom.format("YYYY-MM-DD")}">
            ${dateFrom.format("MMM D")}
          </time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${
              this._state.type
            }.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalizeFirstLetter(
            this._state.type
          )}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom.toISOString()}">
                ${dateFrom.format("HH:mm")}
              </time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo.toISOString()}">
                ${dateTo.format("HH:mm")}
              </time>
            </p>
            <p class="event__duration" data-date-from="${
              this._state.dateFrom
            }" data-date-to="${this._state.dateTo}">
              ${this._formatDuration(this._state.dateFrom, this._state.dateTo)}
            </p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${
              this._state.basePrice
            }</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._state.offers.map(
              (offer) =>
                `<li class="event__offer" data-offer-id="${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`
            )}
          </ul>
          <button class="event__favorite-btn ${
            !this._state.isFavorite ? "" : "event__favorite-btn--active"
          }" type="button">
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
}
