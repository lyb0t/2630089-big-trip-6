import PointPresenter from "./Point";

export default class PointList {
  #pointsModel = null;
  #filtersModel = null;
  #sortingModel = null;
  #pointsPresenters = [];

  constructor(pointsModel, filtersModel, sortingModel) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#sortingModel = sortingModel;
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

  removePointPresenters() {
    this.#pointsPresenters.forEach((presenter) => presenter.remove());
  }

  closeAllForms() {
    this.#pointsPresenters.forEach((pr) => {
      pr.closeEditForm();
    });
  }

  async present() {
    this.closeAllForms();
    this.removePointPresenters();
    const filteredPoints = this.#filtersModel.filterPoints(
      this.#pointsModel.points
    );

    const sortedPoints = this.#sortingModel.sortPoints(filteredPoints);

    this.#pointsPresenters = sortedPoints.map(
      (point) =>
        new PointPresenter(
          point,
          () => this.closeAllForms(),
          (newPoint) => {
            this.#pointsModel.points = this.#pointsModel.points.map((val) =>
              val.id === newPoint.id ? newPoint : val
            );
            this.present();
          },
          () => {
            this.closeAllForms();
            this.#pointsModel.removePoint(point.id);
          }
        )
    );
    this.#pointsPresenters.forEach((presenter) => presenter.present());
  }
}
