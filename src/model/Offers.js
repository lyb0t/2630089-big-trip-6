import { API_ROUTES } from "../const";
import { myFetch } from "../utils";

class OffersModel {
  offers = [];

  async loadOffers() {
    if (this.offers.length !== 0) {
      return;
    }
    const res = await myFetch(API_ROUTES.offers);
    if (res.ok) {
      this.offers = res.body;
    }
  }
}

// Создаём единственный экземпляр и сразу его экспортируем
export default new OffersModel();
