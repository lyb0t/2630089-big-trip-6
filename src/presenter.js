import EditFormView from "./view/EditForm";
import FiltersView from "./view/Filters";
import SortingView from "./view/Sorting";
import PointView from "./view/Point";
import CreateFormView from "./view/CreateForm";
import { mockPoints } from "./mock/point";
import { render, RenderPosition, replace } from "./framework/render";

export default function present() {
  const filters = new FiltersView();
  const sorting = new SortingView();

  const contentContainer = document.querySelector(".trip-events");
  render(
    filters,
    document.querySelector(".trip-controls__filters"),
    RenderPosition.BEFOREEND
  );

  const onEditPoint = (e, point) => {
    const close = (editForm) => {
      replace(point, editForm);
      document.removeEventListener("keyup", onEsc);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        close(editForm);
      }
    };
    const editForm = new EditFormView(
      point.point,
      (e) => {
        e.preventDefault();
        close(editForm);
      },
      () => close(editForm)
    );
    document.addEventListener("keyup", onEsc);

    replace(editForm, point);
  };

  render(sorting, contentContainer, RenderPosition.BEFOREEND);
  // render(createForm, contentContainer, RenderPosition.BEFOREEND);
  // render(
  //   new EditFormView(mockPoints[0], onSubmitEdit),
  //   contentContainer,
  //   RenderPosition.BEFOREEND
  // );
  render(
    new PointView(mockPoints[0], onEditPoint),
    contentContainer,
    RenderPosition.BEFOREEND
  );
  render(
    new PointView(mockPoints[0], onEditPoint),
    contentContainer,
    RenderPosition.BEFOREEND
  );
  render(
    new PointView(mockPoints[0], onEditPoint),
    contentContainer,
    RenderPosition.BEFOREEND
  );
}
