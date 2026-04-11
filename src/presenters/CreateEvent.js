import { remove, render, RenderPosition } from "../framework/render";
import EditFormView from "../view/EditForm";

export default class CreateEventPresenter {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #editFormView = null;
  #addBtnSelector = null;
  constructor({ pointsModel, destinationsModel, offersModel, addBtnSelector }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#addBtnSelector = addBtnSelector;
  }

  removeEditForm() {
    if (!this.#editFormView) {
      return;
    }
    remove(this.#editFormView);
    this.#editFormView = null;
  }

  presentEditForm() {
    if (this.#editFormView) {
      return;
    }
    this.#editFormView = new EditFormView({
      point: {
        id: "",
        basePrice: 1000,
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + 86400000).toISOString(),
        destination: this.#destinationsModel.destinations[0],
        isFavorite: false,
        offers: [],
        type: "taxi",
      },
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onSubmit: async (e, point) => {
        const pointWithoutId = structuredClone(point);
        delete pointWithoutId.id;
        const result = await this.#pointsModel.addPoint(pointWithoutId);
        if (result) {
          this.removeEditForm();
        }
      },
      onReject: () => this.removeEditForm(),
      onDelete: () => this.removeEditForm(),
    });
    const contentContainer = document.querySelector(".trip-events__trip-sort");
    render(this.#editFormView, contentContainer, RenderPosition.AFTEREND);
  }

  present() {
    const addBtn = document.querySelector(this.#addBtnSelector);
    addBtn.addEventListener("click", () => this.presentEditForm());
  }
}
