import { render, RenderPosition } from "../framework/render";
import FiltersView from "../view/Filters";

export default class FiltersPresenter {
  #filtersModel = null;
  #filtersView = null;
  #sortingModel = null;
  constructor({filtersModel, sortingModel}) {
    this.#filtersModel = filtersModel;
    this.#sortingModel = sortingModel;
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
