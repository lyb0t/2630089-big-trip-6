import { createElement } from "../render";

export default class Base {
  constructor() {
    if (new.target === Base) {
      throw new Error("Can't use without new");
    }
  }

  getTemplate() {
    throw new Error("No implementation for Base.getTemplate");
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
