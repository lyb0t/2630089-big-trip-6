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

  findOfferById(type, id) {
    const offersObj = this.offers.find((offer) => offer.type === type);
    const offers = offersObj ? offersObj.offers : [];

    return offers.find((offer) => offer.id === id);
  }
}

// Создаём единственный экземпляр и сразу его экспортируем
export default new OffersModel();
