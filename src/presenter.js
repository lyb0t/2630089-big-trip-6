import FiltersPresenter from "./presenters/Filters";
import PointListPresenter from "./presenters/PointList";
import SortingPresenter from "./presenters/Sorting";

export default function present(pointsModel, filtersModel, sortingModel) {
  const filtersPresenter = new FiltersPresenter(filtersModel, sortingModel);
  filtersPresenter.present();
  // render(createForm, contentContainer, RenderPosition.BEFOREEND);
  // render(
  //   new EditFormView(mockPoints[0], onSubmitEdit),
  //   RenderPosition.BEFOREEND
  // );

  const sortingPresenter = new SortingPresenter(sortingModel);
  sortingPresenter.present();

  const pointListPresenter = new PointListPresenter(
    pointsModel,
    filtersModel,
    sortingModel
  );
  pointListPresenter.present();
}
