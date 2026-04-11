import present from "./presenter";

import DestinationsModel from "./model/Destinations";
import OffersModel from "./model/Offers";

import { PointsModel } from "./model/Points";
import { FiltersModel } from "./model/Filters";
import { SortingModel } from "./model/Sorting";

const start = async () => {
  await DestinationsModel.loadDestinations();
  await OffersModel.loadOffers();
  const pointsModel = new PointsModel({ destinationsModel: DestinationsModel });
  const filtersModel = new FiltersModel();
  const sortingModel = new SortingModel();
  present({
    pointsModel,
    filtersModel,
    sortingModel,
    destinationsModel: DestinationsModel,
    offersModel: OffersModel,
  });

  await pointsModel.loadPoints();
};

start();
