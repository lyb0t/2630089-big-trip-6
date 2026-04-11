import { render, RenderPosition } from "../framework/render";
import EditFormView from "../view/EditForm";

export default class CreateEventPresenter {
  #pointsModel = null;
  #destinationsModel = null;
  #filtersModel = null;
  #sortingModel = null;
  #offersModel = null;
  #editFormView = null;
  #addBtnSelector = null;
  #onOpen = () => {};
  constructor({
    pointsModel,
    destinationsModel,
    offersModel,
    filtersModel,
    sortingModel,
    addBtnSelector,
    onOpen = () => {},
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;
    this.#sortingModel = sortingModel;
    this.#addBtnSelector = addBtnSelector;
    this.#onOpen = onOpen;

    this.#pointsModel.addLoadListener((result) => {
      if (!result) {
        document
          .querySelector(this.#addBtnSelector)
          .setAttribute("disabled", "true");
      }
    });

    this.present();
  }

  removeEditForm() {
    if (!this.#editFormView) {
      return;
    }
    this.#editFormView.remove();
    this.#editFormView = null;
  }

  presentEditForm() {
    if (this.#editFormView) {
      return;
    }
    this.#onOpen();
    this.#filtersModel.filter = "everything";
    this.#sortingModel.sortType = "day";
    this.#editFormView = new EditFormView({
      point: {
        id: "",
        basePrice: 0,
        dateFrom: "",
        dateTo: "",
        // dateFrom: new Date().toISOString(),
        // dateTo: new Date(Date.now() + 86400000).toISOString(),
        destination: {
          name: "",
        },
        isFavorite: false,
        offers: [],
        type: "flight",
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
    });
    const contentContainer = document.querySelector(".trip-events__trip-sort");
    render(this.#editFormView, contentContainer, RenderPosition.AFTEREND);
  }

  present() {
    const addBtn = document.querySelector(this.#addBtnSelector);
    addBtn.addEventListener("click", () => {
      if (this.#editFormView) {
        this.removeEditForm();
      } else {
        this.presentEditForm();
      }
    });
  }
}
