import { remove, render, RenderPosition } from "../../framework/render";
import UiBlocker from "../../framework/ui-blocker/ui-blocker";
import BigMsgView from "../../view/BigMsg";
import bigMsgView from "../../view/BigMsg";
import PointPresenter from "./Point";

export default class PointList {
  #pointsModel = null;
  #filtersModel = null;
  #sortingModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsPresenters = [];
  #bigMsgView = null;
  #failMsg = null;
  #uiBlocker = null;
  #closeCreationForm = () => {};
  constructor({
    pointsModel,
    filtersModel,
    sortingModel,
    destinationsModel,
    offersModel,
  }) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#sortingModel = sortingModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#uiBlocker = new UiBlocker(0, 0);

    pointsModel.addChangeListener(() => {
      this.present();
    });
    filtersModel.addChangeListener(() => {
      this.#sortingModel.sortType = "day";
      this.present();
    });
    sortingModel.addChangeListener(() => {
      this.present();
    });
    pointsModel.addLoadListener((result) => {
      if (result) {
        this.present();
      } else {
        this.presentFailMsg();
      }
      this.removeLoader();
    });
    this.presentLoader();
  }

  setCloseCreationForm(onOpen) {
    this.#closeCreationForm = onOpen;
  }

  _removePointPresenter(id) {
    this.#pointsPresenters = this.#pointsPresenters.filter((pr) => {
      if (pr.id === id) {
        pr.remove();
        return false;
      }
      return true;
    });
  }

  _removePointPresenters() {
    this.#pointsPresenters.forEach((presenter) => presenter.remove());
    this.#pointsPresenters = [];
  }

  _removeEmptyMsg() {
    if (this.#bigMsgView) {
      remove(this.#bigMsgView);
    }
  }

  closeAllForms() {
    this.#closeCreationForm();
    this.#pointsPresenters.forEach((pr) => {
      pr.closeEditForm();
    });
  }

  presentLoader() {
    this.#uiBlocker.block();
  }

  removeLoader() {
    this.#uiBlocker.unblock();
  }

  presentFailMsg() {
    this.#failMsg = new BigMsgView("Failed to load latest route information");
    const contentContainer = document.querySelector(".trip-events");
    render(this.#failMsg, contentContainer, RenderPosition.BEFOREEND);
  }

  present() {
    console.log("PointList present");
    this.closeAllForms();
    this._removePointPresenters();
    this._removeEmptyMsg();
    const filteredPoints = this.#filtersModel.filterPoints(
      this.#pointsModel.points,
    );

    const sortedPoints = this.#sortingModel.sortPoints(filteredPoints);
    if (sortedPoints.length === 0) {
      let msg = null;
      switch (this.#filtersModel.filter) {
        case "everything":
          msg = "Click New Event to create your first point";
          break;
        case "past":
          msg = "There are no past events now";
          break;
        case "present":
          msg = "There are no present events now";
          break;
        case "future":
          msg = "There are no future events now";
          break;
      }
      this.#bigMsgView = new BigMsgView(msg);
      const contentContainer = document.querySelector(".trip-events");
      render(this.#bigMsgView, contentContainer, RenderPosition.BEFOREEND);
    } else {
      this.#pointsPresenters = sortedPoints.map(
        (point) =>
          new PointPresenter({
            destinationsModel: this.#destinationsModel,
            offersModel: this.#offersModel,
            point,
            onOpenEditForm: () => this.closeAllForms(),
            onSubmit: async (newPoint) =>
              await this.#pointsModel.updatePoint(newPoint),
            onDelete: async (id) => await this.#pointsModel.removePoint(id),
          }),
      );
      this.#pointsPresenters.forEach((presenter) => presenter.present());
    }
  }
}
