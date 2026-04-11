import AbstractView from "../framework/view/abstract-view";

export default class TripInfoView extends AbstractView {
  #info = { cities: [], dates: [], price: 0 };
  constructor(info) {
    super();
    this.#info = info;
  }

  _formatDateRangeFull(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];

    if (startMonth === endMonth) {
      return `${startDay} — ${endDay} ${endMonth}`;
    } else {
      return `${startDay} ${startMonth} — ${endDay} ${endMonth}`;
    }
  }

  get template() {
    const cities =
      this.#info.cities.length > 3
        ? `${this.#info.cities[0]} &mdash; ... &mdash; ${this.#info.cities[this.#info.cities.length - 1]}`
        : this.#info.cities.join(" &mdash; ");
    const dates = this._formatDateRangeFull(...this.#info.dates);
    return `
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${cities}</h1>

              <p class="trip-info__dates">${dates}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#info.price}</span>
            </p>
          </section>
    `;
  }
}
