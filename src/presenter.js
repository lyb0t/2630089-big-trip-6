import CreateEventPresenter from "./presenters/CreateEvent";
import FiltersPresenter from "./presenters/Filters";
import PointListPresenter from "./presenters/PointList";
import SortingPresenter from "./presenters/Sorting";
import TripInfoPresenter from "./presenters/TripInfo";

export default function present({
  pointsModel,
  filtersModel,
  sortingModel,
  destinationsModel,
  offersModel,
}) {
  const filtersPresenter = new FiltersPresenter({
    pointsModel,
    filtersModel,
    sortingModel,
  });

  const sortingPresenter = new SortingPresenter({ pointsModel, sortingModel });

  const tripInfoPresenter = new TripInfoPresenter({ pointsModel, offersModel, sortingModel });

  const pointListPresenter = new PointListPresenter({
    pointsModel,
    filtersModel,
    sortingModel,
    destinationsModel,
    offersModel,
  });

  const createEventPresenter = new CreateEventPresenter({
    pointsModel,
    destinationsModel,
    offersModel,
    filtersModel,
    sortingModel,
    addBtnSelector: ".trip-main__event-add-btn",
    onOpen: () => pointListPresenter.closeAllForms(),
  });
  pointListPresenter.setCloseCreationForm(() =>
    createEventPresenter.removeEditForm(),
  );
}
