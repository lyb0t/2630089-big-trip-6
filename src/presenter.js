import { render, RenderPosition } from "./framework/render";
import { mockPoints } from "./mock/point";
import PointListPresenter from "./presenters/PointList";
import FiltersView from "./view/Filters";
import SortingView from "./view/Sorting";

export default function present() {
  const filters = new FiltersView();

  const contentContainer = document.querySelector(".trip-events");
  render(
    filters,
    document.querySelector(".trip-controls__filters"),
    RenderPosition.BEFOREEND
  );

  // render(createForm, contentContainer, RenderPosition.BEFOREEND);
  // render(
  //   new EditFormView(mockPoints[0], onSubmitEdit),
  //   contentContainer,
  //   RenderPosition.BEFOREEND
  // );

  const pointListPresenter = new PointListPresenter(mockPoints);
  pointListPresenter.present();

  render(
    new SortingView((e, sortType) =>
      pointListPresenter.changeSortType(sortType)
    ),
    contentContainer,
    RenderPosition.AFTERBEGIN
  );
}
