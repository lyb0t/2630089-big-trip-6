import { API_ROUTES } from "../const";
import { myFetch } from "../utils";

class DestinationsModel {
  destinations = [];

  async loadDestinations() {
    if (this.destinations.length !== 0) {
      return;
    }
    const res = await myFetch(API_ROUTES.destinations);
    if (res.ok) {
      this.destinations = res.body;
    }
  }
}

// Создаём единственный экземпляр и сразу его экспортируем
export default new DestinationsModel();
