import AbstractView from "../framework/view/abstract-view";

export default class BigMsgView extends AbstractView {
  #msg = null;
  constructor(msg) {
    super();
    this.#msg = msg;
  }

  get template() {
    return `
      <p class="trip-events__msg">${this.#msg}</p>
    `;
  }
}
