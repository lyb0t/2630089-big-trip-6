import EditFormView from "./view/EditForm";
import FiltersView from "./view/Filters";
import SortingView from "./view/Sorting";
import PointView from "./view/Point";
import CreateFormView from "./view/CreateForm";
import { render, RenderPosition } from "./render";
import { mockPoints } from "./mock/point";

export default function present() {
  const createForm = new CreateFormView();
  const filters = new FiltersView();
  const sorting = new SortingView();

  const contentContainer = document.querySelector(".trip-events");
  render(
    filters,
    document.querySelector(".trip-controls__filters"),
    RenderPosition.BEFOREEND
  );
  render(sorting, contentContainer, RenderPosition.BEFOREEND);
  render(createForm, contentContainer, RenderPosition.BEFOREEND);
  render(new PointView(mockPoints[0]), contentContainer, RenderPosition.BEFOREEND);
  render(new PointView(mockPoints[0]), contentContainer, RenderPosition.BEFOREEND);
  render(new EditFormView(mockPoints[0]), contentContainer, RenderPosition.BEFOREEND);
  render(new PointView(mockPoints[0]), contentContainer, RenderPosition.BEFOREEND);
}
