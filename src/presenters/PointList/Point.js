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
    this._pointView = null;
    this.#point = point;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  _toggleFavorite = async () => {
    // this.#point.isFavorite = !this.#point.isFavorite;
    const newPoint = structuredClone(this.#point);
    newPoint.isFavorite = !newPoint.isFavorite;
    return await this._onSubmit(newPoint);
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

    replace(this._editForm, this._pointView);
  };

  closeEditForm = () => {
    if (!this._editForm) {
      return;
    }
    replace(this._pointView, this._editForm);
    this._editForm.remove();
    this._editForm = null;
  };

  closeAndSaveEditForm = async (point) => {
    if (!point) {
      throw new Error("no point in closeAndSaveEditForm");
    }
    await this._onSubmit(point);
  };

  remove() {
    remove(this._pointView);
    if (this._editForm) {
      this._editForm.remove();
    }
  }

  updatePoint(point) {
    this.#point = point;
    this._pointView.updateElement(point);
  }

  present() {
    console.log("this.#point", this.#point);
    const contentContainer = document.querySelector(".trip-events");

    this._pointView = new PointView({
      point: this.#point,
      offers: this.#offersModel.offers,
      onEdit: this.openEditForm,
      onFavoriteClick: async () => await this._toggleFavorite(),
    });

    render(this._pointView, contentContainer, RenderPosition.BEFOREEND);
  }
}
