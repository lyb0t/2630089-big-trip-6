import AbstractView from "../framework/view/abstract-view";

export default class FiltersView extends AbstractView {
  constructor(onFilterChange = () => {}) {
    super();
    const form = this.element;

    form.addEventListener("change", (event) => {
      const target = event.target;
      if (target.type === "radio" && target.name === "trip-filter") {
        onFilterChange(target.value);
      }
    });
  }

  changeFilter(newFilter) {
    const inputs = this.element.querySelectorAll(
      "input.trip-filters__filter-input",
    );
    inputs.forEach((input) =>
      input.id === `filter-${newFilter}`
        ? (input.checked = true)
        : (input.checked = false),
    );
  }

  disable(filters) {
    const inputs = this.element.querySelectorAll(
      "input.trip-filters__filter-input",
    );
    inputs.forEach((input) => {
      if (!filters) {
        input.setAttribute("disabled", "true");
        input.checked = false;
        return;
      }

      if (filters.length !== 0 && filters.includes(input.value)) {
        input.setAttribute("disabled", "true");
        input.checked = false;
      } else {
        input.removeAttribute("disabled");
      }
    });
  }

  get template() {
    return `
      <form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
        </div>
              
        <div class="trip-filters__filter">
          <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present">
          <label class="trip-filters__filter-label" for="filter-present">Present</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`;
  }
}
