import { createElement } from "../framework/render";
import AbstractView from "../framework/view/abstract-view";
import {
  capitalizeFirstLetter,
  dateDifference,
  formatToMonthDay,
} from "../utils";

// const mockDestination = {
//   id: "cfe416cq-10xa-ye10-8077-2fs9a01edcab",
//   description:
//     "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
//   name: "Chamonix",
//   pictures: [
//     {
//       src: "http://picsum.photos/300/200?r=0.0762563005163317",
//       description: "Chamonix parliament building",
//     },
//   ],
// };

// const mockOffer = {
//   id: "b4c3e4e6-9053-42ce-b747-e281314baa31",
//   title: "Upgrade to a business class",
//   price: 120,
// };
// export const mockPoints = [
//   {
//     id: "f4b62099-293f-4c3d-a702-94eec4a2808c",
//     basePrice: 1100,
//     dateFrom: "2019-07-10T22:55:56.845Z",
//     dateTo: "2019-07-11T11:22:13.375Z",
//     destination: mockDestination,
//     isFavorite: false,
//     offers: [mockOffer],
//     type: "taxi",
//   },
// ];

export default class PointView extends AbstractView {
  constructor(point, onEdit, onFavoriteClick) {
    super();
    this._initPoint = point;
    this.onEdit = onEdit;
    this.onFavoriteClick = onFavoriteClick;
  }

  _getOfferLiTemplate(offer) {
    return `<li class="event__offer" data-offer-id="${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`;
  }

  setDateFrom(dateFrom) {
    const el = this.element;
    el.querySelector(".event__date").textContent = formatToMonthDay(dateFrom);
    const timeEl = el.querySelector(".event__start-time");
    timeEl.setAttribute("datetime", dateFrom);
    timeEl.textContent = `
       ${new Date(dateFrom).getHours()} : ${new Date(dateFrom).getMinutes()}
     `;

    const diffEl = el.querySelector(".event__duration");
    diffEl.textContent = dateDifference(
      dateFrom,
      diffEl.getAttribute("data-date-to")
    ).diffStr;
  }

  setDateTo(dateTo) {
    const el = this.element;
    const timeEl = el.querySelector(".event__end-time");
    timeEl.setAttribute("datetime", dateTo);
    timeEl.textContent = `
       ${new Date(dateTo).getHours()} : ${new Date(dateTo).getMinutes()}
     `;

    const diffEl = el.querySelector(".event__duration");
    diffEl.textContent = dateDifference(
      diffEl.getAttribute("data-date-from"),
      dateTo
    ).diffStr;
  }

  setType(type) {
    this.element.querySelector(".event__title").textContent =
      capitalizeFirstLetter(type);
  }

  setBasePrice(basePrice) {
    this.element.querySelector(".event__price-value").textContent = basePrice;
  }

  addOffer(offer) {
    const container = this.element.querySelector(".event__selected-offers");
    const elem = this._getOfferLiTemplate(offer);
    container.append(elem);
  }

  removeOffer(id) {
    const container = this.element.querySelector(".event__selected-offers");
    const lis = container.querySelectorAll(`li[data-offer-id="${id}"]`);
    lis.forEach((li) => this.removeElement(li));
  }

  favoriteActiveClass = ".event__favorite-btn--active";
  setIsFavorite(isFavorite) {
    const btn = this.element.querySelector(".event__favorite-btn");
    if (isFavorite) {
      btn.classList.remove(this.favoriteActiveClass);
    } else {
      btn.classList.add(this.favoriteActiveClass);
    }
  }

  toggleIsFavorite() {
    const btn = this.element.querySelector(".event__favorite-btn");
    btn.classList.toggle(this.favoriteActiveClass);
  }

  get template() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="2019-03-18">${formatToMonthDay(
            this._initPoint.dateFrom
          )}
          </time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${
              this._initPoint.type
            }.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalizeFirstLetter(
            this._initPoint.type
          )}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${
                this._initPoint.dateFrom
              }">${`
      ${new Date(this._initPoint.dateFrom).getHours()} : ${new Date(
      this._initPoint.dateFrom
    ).getMinutes()}
    `}</time>
              &mdash;
              <time class="event__end-time" datetime="${
                this._initPoint.dateTo
              }">${`
      ${new Date(this._initPoint.dateTo).getHours()} : ${new Date(
      this._initPoint.dateTo
    ).getMinutes()}
    `}</time>
            </p>
            <p class="event__duration" data-date-from="${
              this._initPoint.dateFrom
            }" data-date-to="${this._initPoint.dateTo}">${
      dateDifference(this._initPoint.dateFrom, this._initPoint.dateTo).diffStr
    }</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${
              this._initPoint.basePrice
            }</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._initPoint.offers.map((offer) =>
              this._getOfferLiTemplate(offer)
            )}
            
          </ul>
          <button class="event__favorite-btn ${
            !this._initPoint.isFavorite ? "" : "event__favorite-btn--active"
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

  get element() {
    if (this._element) {
      return this._element;
    }
    const elem = createElement(this.template);
    const editBtn = elem.querySelector(".event__rollup-btn");
    editBtn.addEventListener("click", (e) => this.onEdit(e, this, elem));

    const favBtn = elem.querySelector(".event__favorite-btn");
    favBtn.addEventListener("click", (e) => {
      this.onFavoriteClick(e, this, elem);
      this.toggleIsFavorite();
    });
    this._element = elem;
    return this._element;
  }
}
