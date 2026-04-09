import FiltersPresenter from "./presenters/Filters";
import PointListPresenter from "./presenters/PointList";
import SortingPresenter from "./presenters/Sorting";

export default function present({
  pointsModel,
  filtersModel,
  sortingModel,
  destinationsModel,
  offersModel,
}) {
  const filtersPresenter = new FiltersPresenter({ filtersModel, sortingModel });
  filtersPresenter.present();

  const sortingPresenter = new SortingPresenter({ sortingModel });
  sortingPresenter.present();

  const pointListPresenter = new PointListPresenter({
    pointsModel,
    filtersModel,
    sortingModel,
    destinationsModel,
    offersModel,
  });
  pointListPresenter.present();
}
