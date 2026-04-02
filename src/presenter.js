import EditForm from "./view/EditForm";
import Filters from "./view/Filters";
import Sorting from "./view/Sorting";
import Point from "./view/Point";
import { render, RenderPosition } from "./render";
import CreateForm from "./view/CreateForm";

export default function present() {
  const createForm = new CreateForm();
  const editForm = new EditForm();
  const filters = new Filters();
  const sorting = new Sorting();
  const point = new Point();

  const contentContainer = document.querySelector(".trip-events");
  render(
    filters,
    document.querySelector(".trip-controls__filters"),
    RenderPosition.BEFOREEND
  );
  render(sorting, contentContainer, RenderPosition.BEFOREEND);
  render(createForm, contentContainer, RenderPosition.BEFOREEND);
  render(point, contentContainer, RenderPosition.BEFOREEND);
  render(point, contentContainer, RenderPosition.BEFOREEND);
  render(editForm, contentContainer, RenderPosition.BEFOREEND);
  render(point, contentContainer, RenderPosition.BEFOREEND);
}
