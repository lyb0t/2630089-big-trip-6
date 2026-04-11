import { render, RenderPosition } from "../framework/render";
import SortingView from "../view/Sorting";

export default class SortingPresenter {
  #sortingModel = null;
  #pointsModel = null;
  #sortingView = null;
  constructor({ pointsModel, sortingModel }) {
    this.#pointsModel = pointsModel;
    this.#sortingModel = sortingModel;
    this.#sortingModel.addChangeListener((newSortType) => {
      this.#sortingView.changeSelectedSort(newSortType);
    });

    this.#pointsModel.addLoadListener((result) => {
      if (result) {
        this.present();
      }
    });
  }

  present() {
    this.#sortingView = new SortingView((e, newSortType) => {
      this.#sortingModel.sortType = newSortType;
    });
    const contentContainer = document.querySelector(".trip-events");
    render(this.#sortingView, contentContainer, RenderPosition.AFTERBEGIN);
  }
}
