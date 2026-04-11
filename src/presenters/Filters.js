import { remove, render, RenderPosition } from "../framework/render";
import FiltersView from "../view/Filters";

export default class FiltersPresenter {
  #pointsModel = null;
  #filtersModel = null;
  #filtersView = null;
  #sortingModel = null;
  constructor({ pointsModel, filtersModel, sortingModel }) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#sortingModel = sortingModel;

    this.#filtersModel.addChangeListener((newFilter) => {
      this.#filtersView.changeFilter(newFilter);
      this._disableEmptyFilters();
    });

    this.#pointsModel.addChangeListener(() => {
      this._disableEmptyFilters();
    });

    this.#pointsModel.addLoadListener((result) => {
      if (!result) {
        this.#filtersView.disable();
      } else {
        this._disableEmptyFilters();
      }
    });

    this.present();
  }

  _disableEmptyFilters() {
    const disableFilters = [];
    for (const filter of this.#filtersModel.filtersKeys) {
      if (
        this.#filtersModel.filterPoints(this.#pointsModel.points, filter)
          .length === 0
      ) {
        disableFilters.push(filter);
      }
    }

    this.#filtersView.disable(disableFilters);
  }

  async present() {
    this.#filtersView = new FiltersView((newFilter) => {
      this.#filtersModel.filter = newFilter;
      this.#sortingModel.sortType = "day";
    });
    const contentContainer = document.querySelector(".trip-controls__filters");
    render(this.#filtersView, contentContainer, RenderPosition.BEFOREEND);
  }
}
