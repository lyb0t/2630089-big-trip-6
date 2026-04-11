import PointPresenter from "./Point";

export default class PointList {
  #pointsModel = null;
  #filtersModel = null;
  #sortingModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsPresenters = [];

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

  closeAllForms() {
    this.#pointsPresenters.forEach((pr) => {
      pr.closeEditForm();
    });
  }

  present() {
    console.log("PointList present");
    this.closeAllForms();
    this._removePointPresenters();
    const filteredPoints = this.#filtersModel.filterPoints(
      this.#pointsModel.points,
    );

    const sortedPoints = this.#sortingModel.sortPoints(filteredPoints);

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
