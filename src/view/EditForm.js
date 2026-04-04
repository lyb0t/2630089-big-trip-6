import flatpickr from "flatpickr";
import AbstractStatefulView from "../framework/view/abstract-stateful-view";
import { mockDestinations } from "../mock/point";
import { capitalizeFirstLetter } from "../utils";
import "flatpickr/dist/flatpickr.min.css";

export default class EditFormView extends AbstractStatefulView {
  constructor(point, onSubmit, onReject = onSubmit) {
    super(point);
    this._datePickerFrom = null;
    this._datePickerTo = null;
    this.onSubmit = onSubmit;
    this.onReject = onReject;
  }

  _destroyDatePickers() {
    if (this._datePickerFrom) {
      this._datePickerFrom.destroy();
      this._datePickerFrom = null;
    }
    if (this._datePickerTo) {
      this._datePickerTo.destroy();
      this._datePickerTo = null;
    }
  }

  _initDatePickers() {
    const fromInput = this.element.querySelector("#event-start-time-1");
    const toInput = this.element.querySelector("#event-end-time-1");

    if (fromInput && !this._datePickerFrom) {
      this._datePickerFrom = flatpickr(fromInput, {
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

    if (toInput && !this._datePickerTo) {
      this._datePickerTo = flatpickr(toInput, {
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
    this.element.addEventListener("submit", (e) =>
      this.onSubmit(e, this._state)
    );
    this.element
      .querySelector(".event__rollup-btn")
      .addEventListener("click", this.onReject);

    this.element
      .querySelector(".event__reset-btn")
      .addEventListener("click", this.onReject);

    this.element
      .querySelector(".event__type-group")
      .addEventListener("change", (e) => {
        this.updateElement({
          type: e.target.value,
        });
      });

    this.element
      .querySelector(".event__input--destination")
      .addEventListener("blur", (e) => {
        this.updateElement({
          destination: e.target.value,
        });
      });

    this._initDatePickers();
  }

  _findDestination(name) {
    return mockDestinations.find((dest) => dest.name === name);
  }

  get template() {
    const destination = this._findDestination(this._state.destination);
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

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(this._state.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
              this._state.destination
            }" list="destination-list-1">
            <datalist id="destination-list-1">
            ${mockDestinations
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
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${this._state.offers.map(
                (offer) => `
                <div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" checked>
                  <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </label>
                </div>
                `
              )}
            </div>
          </section>
          ${
            !destination
              ? ""
              : `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${
                destination.description
              }</p>
              ${
                !(destination.pictures?.length > 0)
                  ? ""
                  : `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destination.pictures.map(
                      (pic) =>
                        `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`
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
