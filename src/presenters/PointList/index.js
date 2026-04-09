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
    // pointsModel.addChangeListener(() => {
    //   this.present();
    // });
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

  presentPoint(id) {
    const pr = this.#pointsPresenters.find((p) => p.id === id);
    if (!pr) {
      console.warn(`PointPresenter with id=${id} not found`);
      return;
    }
    pr.present();
  }

  present() {
    console.log("PointList present");
    this.closeAllForms();
    this.removePointPresenters();
    const filteredPoints = this.#filtersModel.filterPoints(
      this.#pointsModel.points
    );

    const sortedPoints = this.#sortingModel.sortPoints(filteredPoints);

    this.#pointsPresenters = sortedPoints.map(
      (point) =>
        new PointPresenter({
          destinationsModel: this.#destinationsModel,
          offersModel: this.#offersModel,
          point,
          onOpenEditForm: () => this.closeAllForms(),
          onSubmit: (newPoint) => {
            this.#pointsModel.points = this.#pointsModel.points.map((val) =>
              val.id === newPoint.id ? newPoint : val
            );
            // this.present();
          },
          onDelete: () => {
            this.closeAllForms();
            this.#pointsModel.removePoint(point.id);
          },
        })
    );
    this.#pointsPresenters.forEach((presenter) => presenter.present());
  }
}
