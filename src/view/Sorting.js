import { createElement } from "../framework/render";
import AbstractView from "../framework/view/abstract-view";

export default class SortingView extends AbstractView {
  constructor(onChange) {
    super();
    this._onChange = onChange;
  }

  get template() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <div data-sort-type="day" class="trip-sort__item  trip-sort__item--day">
          <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
          <label class="trip-sort__btn" for="sort-day">Day</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div data-sort-type="time" class="trip-sort__item  trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
          <label class="trip-sort__btn" for="sort-time">Time</label>
        </div>

        <div data-sort-type="price" class="trip-sort__item  trip-sort__item--price">
          <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
          <label class="trip-sort__btn" for="sort-price">Price</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--offer">
          <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
          <label class="trip-sort__btn" for="sort-offer">Offers</label>
        </div>
    </form>
    `;
  }

  get element() {
    if (this._element) {
      return this._element;
    }
    const elem = createElement(this.template);
    const sortInputs = elem.querySelectorAll(
      ".trip-sort__item[data-sort-type] input"
    );
    sortInputs.forEach((input) =>
      input.addEventListener("change", (e) =>
        this._onChange(e, input.parentElement.getAttribute("data-sort-type"))
      )
    );
    this._element = elem;
    return this._element;
  }
}
