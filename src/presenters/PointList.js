import PointPresenter from "./Point";

const sortFuncs = {
  day: (points) => [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),
  time: (points) => [...points].sort((a, b) => {
    const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
    const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
    return durationA - durationB;
  }),
  price: (points) => [...points].sort((a, b) => a.basePrice - b.basePrice),
};

export default class PointList {
  constructor(points, sortType) {
    this._initPoints = points;
    this._points = points;
    this._sortType = sortType;
  }

  closeAllForms(presenters) {
    presenters.forEach((pr) => {
      pr.closeEditForm();
    });
  }

  changeSortType(sortType) {
    if (this._sortType === sortType) {
      return;
    }
    this._sortType = sortType;
    this.pointsPresenters.forEach((presenter) => presenter.remove());

    const sortedPoints = sortFuncs[sortType](this._initPoints);
    this._points = sortedPoints;
    this.present();
  }

  present() {
    this.pointsPresenters = this._points.map(
      (point) =>
        new PointPresenter(point, () => this.closeAllForms(this.pointsPresenters))
    );
    this.pointsPresenters.forEach((presenter) => presenter.present());
  }
}
