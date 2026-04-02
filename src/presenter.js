import { render, RenderPosition } from "./framework/render";
import { mockPoints } from "./mock/point";
import PointPresenter from "./presenters/Point";
import FiltersView from "./view/Filters";
import SortingView from "./view/Sorting";

export default function present() {
  const filters = new FiltersView();
  const sorting = new SortingView();

  const contentContainer = document.querySelector(".trip-events");
  render(
    filters,
    document.querySelector(".trip-controls__filters"),
    RenderPosition.BEFOREEND
  );

  render(sorting, contentContainer, RenderPosition.BEFOREEND);
  // render(createForm, contentContainer, RenderPosition.BEFOREEND);
  // render(
  //   new EditFormView(mockPoints[0], onSubmitEdit),
  //   contentContainer,
  //   RenderPosition.BEFOREEND
  // );

  const closeAllForms = (presenters) => {
    presenters.forEach((pr) => pr.closeEditForm());
  };

  const pointPresenters = [
    new PointPresenter(mockPoints[0], () => closeAllForms(pointPresenters)),
    new PointPresenter(mockPoints[0], () => closeAllForms(pointPresenters)),
    new PointPresenter(mockPoints[0], () => closeAllForms(pointPresenters)),
  ];

  pointPresenters.forEach((pr) => pr.present());
}
