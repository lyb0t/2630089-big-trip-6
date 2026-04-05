import {
  remove,
  render,
  RenderPosition,
  replace,
} from "../../framework/render";
import EditFormView from "../../view/EditForm";
import PointView from "../../view/Point";
import DestinationsModel from "../../model/Destinations";
import OffersModel from "../../model/Offers";

export default class PointPresenter {
  #point = null;

  constructor(point, onOpenEditForm, onSubmit, onDelete) {
    if (!point) {
      throw new Error("No point");
    }
    this.id = point.id;
    this._onOpenEditForm = onOpenEditForm;
    this._onSubmit = onSubmit;
    this._onDelete = onDelete;
    this._editForm = null;
    this._onKeyUp = null;
    this._pointView = null;
    this.#point = point;
  }

  toggleFavorite = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
  };

  openEditForm = () => {
    this._onOpenEditForm();
    this._editForm = new EditFormView(
      this.#point,
      DestinationsModel.destinations,
      OffersModel.offers,
      (point) => {
        this.closeAndSaveEditForm(point);
      },
      () => this.closeEditForm(),
      () => {
        this._onDelete(this.#point.id);
      }
    );

    const close = () => {};
    this._onKeyUp = (e) => {
      if (e.key === "Escape") {
        // eslint-disable-next-line no-use-before-define
        close(this._editForm);
      }
    };
    document.addEventListener("keyup", this._onKeyUp);

    replace(this._editForm, this._pointView);
  };

  closeEditForm = () => {
    if (!this._editForm) {
      return;
    }
    replace(this._pointView, this._editForm);
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener("keyup", this._onKeyUp);
    this._onKeyUp = null;
    this._editForm = null;
  };

  closeAndSaveEditForm = (point) => {
    if (!point) {
      throw new Error("no point in closeAndSaveEditForm");
    }
    this.closeEditForm();
    this.#point = point;
    this._onSubmit(point);
  };

  remove() {
    remove(this._pointView);
  }

  present() {
    const contentContainer = document.querySelector(".trip-events");
    this._pointView = new PointView(
      this.#point,
      this.openEditForm,
      this.toggleFavorite
    );
    render(this._pointView, contentContainer, RenderPosition.BEFOREEND);
  }
}
