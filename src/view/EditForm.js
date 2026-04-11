import flatpickr from "flatpickr";
import AbstractStatefulView from "../framework/view/abstract-stateful-view";
import { capitalizeFirstLetter } from "../utils";
import "flatpickr/dist/flatpickr.min.css";
import { POINT_TYPES } from "../model/Points";
import UiBlocker from "../framework/ui-blocker/ui-blocker";
import { remove } from "../framework/render";

export default class EditFormView extends AbstractStatefulView {
  #datePickerFrom = "";
  #datePickerTo = "";
  #destinations = [];
  #offers = [];
  #onSubmit = () => {};
  #onReject = () => {};
  #onDelete = null;

  #uiBlocker = () => {};
  constructor({
    point,
    destinations,
    offers,
    onSubmit = () => {},
    onReject = () => {},
    onDelete,
  }) {
    super(point);

    this.#datePickerFrom = null;
    this.#datePickerTo = null;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onSubmit = onSubmit;
    this.#onReject = onReject;
    this.#onDelete = onDelete;

    this.#uiBlocker = new UiBlocker(0, 0);
  }

  _toggleOffer(id) {
    const offers = this._state.offers;
    const isOffer = offers.includes(id);
    if (isOffer) {
      this._setState({
        offers: this._state.offers.filter((off) => off !== id),
      });
    } else {
      this._setState({
        ...this._state,
        offers: [...this._state.offers, id],
      });
    }
  }

  _destroyDatePickers() {
    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }
    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  _initDatePickers() {
    const fromInput = this.element.querySelector("#event-start-time-1");
    const toInput = this.element.querySelector("#event-end-time-1");

    if (fromInput && !this.#datePickerFrom) {
      this.#datePickerFrom = flatpickr(fromInput, {
        enableTime: true,
        dateFormat: "d/m/y H:i",
        defaultDate: this._state.dateFrom,
        onChange: (selectedDates) => {
          if (selectedDates[0]) {
            this.updateElement({ dateFrom: selectedDates[0].toISOString() });
          }
        },
      });
    }

    if (toInput && !this.#datePickerTo) {
      this.#datePickerTo = flatpickr(toInput, {
        enableTime: true,
        dateFormat: "d/m/y H:i",
        defaultDate: this._state.dateTo,
        onChange: (selectedDates) => {
          if (selectedDates[0]) {
            this.updateElement({ dateTo: selectedDates[0].toISOString() });
          }
        },
      });
    }
  }

  _restoreHandlers() {
    this._destroyDatePickers();
    this.element
      .querySelector(".event__save-btn")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        e.target.textContent = "Saving...";
        this.#uiBlocker.block();
        const result = await this.#onSubmit(e, this._state);
        e.target.textContent = "Save";
        this.#uiBlocker.unblock();

        if (!result) {
          this.shake();
        }
      });

    const rollup = this.element.querySelector(".event__rollup-btn");
    if (rollup) {
      rollup.addEventListener("click", (e) => {
        e.preventDefault();
        this.#onReject();
      });
    }

    const resetBtn = this.element.querySelector(".delete-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.target.textContent = "Deleting...";
        this.#uiBlocker.block();

        const result = await this.#onDelete();
        e.target.textContent = "Delete";
        this.#uiBlocker.unblock();

        if (!result) {
          this.shake();
        }
      });
    }

    const cancelBtn = this.element.querySelector(".cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", this.#onReject);
    }

    this.element
      .querySelector(".event__type-group")
      .addEventListener("change", (e) => {
        this._setState({ offers: [] });
        this.updateElement({
          type: e.target.value,
        });
      });

    this.element
      .querySelector(".event__input--destination")
      .addEventListener("blur", (e) => {
        const finded = this._findDestinationByName(e.target.value);
        if (finded) {
          this.updateElement({
            destination: finded,
          });
        } else {
          this.updateElement({
            destination: this.#destinations[0],
          });
        }
      });

    this.element.querySelectorAll(".event__offer-selector").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const checkbox = el.querySelector("input.event__offer-checkbox");
        checkbox.checked = !checkbox.checked;
        this._toggleOffer(e.currentTarget.getAttribute("data-offer-id"));
      });
    });

    this.element
      .querySelector(".event__input--price")
      .addEventListener("change", (e) => {
        this._setState({
          basePrice: e.target.value,
        });
      });

    this._escHandler = (e) => {
      if (e.key === "Escape") {
        this.#onReject(e);
      }
    };
    document.addEventListener("keyup", this._escHandler);

    this._initDatePickers();
  }

  _findDestinationByName(name) {
    return this.#destinations.find((dest) => dest.name === name);
  }

  remove() {
    document.removeEventListener("keyup", this._escHandler);
    remove(this);
  }

  get template() {
    const destination = this._state.destination;
    const offersObj = this.#offers.find(
      (offer) => offer.type === this._state.type,
    );
    const offers = offersObj ? offersObj.offers : [];
    return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${
  this._state.type
}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${POINT_TYPES.map(
    (type) => `
                    <div class="event__type-item">
                        <input id="event-type-${type}-1" ${this._state.type === type ? "checked" : ""} class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
                    </div>
                    `,
  ).join("")}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(this._state.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  this._state.destination.name
}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${this.#destinations
    .map((dest) => `<option value="${dest.name}"></option>`)
    .join("")}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${
  this._state.basePrice
}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          
          ${
  this.#onDelete
    ? "<button class=\"event__reset-btn delete-btn\" type=\"reset\">Delete</button>"
    : "<button class=\"event__reset-btn cancel-btn\">Cancel</button>"
}
          ${
  this.#onDelete
    ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`
    : ""
}
        </header>
        <section class="event__details">
        ${
  offers.length > 0
    ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">
                  Offers
            </h3>
            
            <div class="event__available-offers">
              ${offers
    .map(
      (offer) => `
                <div class="event__offer-selector" data-offer-id="${offer.id}">
                  <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${this._state.offers.includes(offer.id) ? "checked" : ""}>
                  <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </label>
                </div>
                `,
    )
    .join("")}
            </div>
          </section>`
    : ""
}
          ${
  !destination
    ? ""
    : `
            <section class="event__section  event__section--destination">
              ${
  destination.description
    ? "<h3 class=\"event__section-title  event__section-title--destination\">Destination</h3>"
    : ""
}
              ${
  destination.description
    ? `<p class="event__destination-description">
                    ${destination.description}
                  </p>`
    : ""
}

              ${
  !(destination.pictures?.length > 0)
    ? ""
    : `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destination.pictures.map(
    (pic) =>
      `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`,
  )}
                  </div>
                </div>
              `
}
            </section>
            `
}
          
        </section>
      </form>
    `;
  }
}
