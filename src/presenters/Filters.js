import { render, RenderPosition } from "../framework/render";
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

    this.#filtersModel.addChangeListener((newFilter) =>
      this.#filtersView.changeFilter(newFilter),
    );

    this.#pointsModel.addLoadListener((result) => {
      if (!result) {
        this.#filtersView.disable();
      }
    });

    this.present();
  }

  async present() {
    console.log("Filters present");
    this.#filtersView = new FiltersView((newFilter) => {
      this.#filtersModel.filter = newFilter;
      this.#sortingModel.sortType = "day";
    });
    const contentContainer = document.querySelector(".trip-controls__filters");
    render(this.#filtersView, contentContainer, RenderPosition.BEFOREEND);
  }
}
