import {
  remove,
  render,
  RenderPosition,
  replace,
} from "../../framework/render";
import EditFormView from "../../view/EditForm";
import PointView from "../../view/Point";

export default class PointPresenter {
  #point = null;
  #destinationsModel = null;
  #offersModel = null;
  constructor({
    destinationsModel,
    offersModel,
    point,
    onOpenEditForm,
    onSubmit,
    onDelete,
  }) {
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
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  toggleFavorite = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
  };

  openEditForm = () => {
    this._onOpenEditForm();
    this._editForm = new EditFormView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onSubmit: async (e, point) => await this.closeAndSaveEditForm(point),
      onReject: () => this.closeEditForm(),
      onDelete: async () => await this._onDelete(this.#point.id),
    });

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
    document.removeEventListener("keyup", this._onKeyUp);
    this._onKeyUp = null;
    this._editForm = null;
    console.log(this._pointView);
  };

  closeAndSaveEditForm = async (point) => {
    console.log("point", point);
    if (!point) {
      throw new Error("no point in closeAndSaveEditForm");
    }
    this.closeEditForm();
    const res = await this._onSubmit(point);
    if (res) {
      this.#point = point;
      this._pointView.updateElement(point);
    }
  };

  remove() {
    remove(this._pointView);
    remove(this._editForm);
  }

  updatePoint(point) {
    this.#point = point;
    this._pointView.updateElement(point);
  }

  present() {
    console.log(this.#point);
    const contentContainer = document.querySelector(".trip-events");
    this._pointView = new PointView({
      point: this.#point,
      offers: this.#offersModel.offers,
      onEdit: this.openEditForm,
      onFavoriteClick: this.toggleFavorite,
    });
    console.log(this._pointView);
    render(this._pointView, contentContainer, RenderPosition.BEFOREEND);
  }
}
