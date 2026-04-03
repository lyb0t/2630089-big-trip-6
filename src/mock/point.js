const mockDestination = {
  id: "cfe416cq-10xa-ye10-8077-2fs9a01edcab",
  description:
    "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
  name: "Chamonix",
  pictures: [
    {
      src: "http://picsum.photos/300/200?r=0.0762563005163317",
      description: "Chamonix parliament building",
    },
  ],
};

const mockOffer = {
  id: "b4c3e4e6-9053-42ce-b747-e281314baa31",
  title: "Upgrade to a business class",
  price: 120,
};
export const mockPoints = [
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808c",
    basePrice: 1100,
    dateFrom: "2018-07-10T22:55:56.845Z",
    dateTo: "2019-07-11T11:22:13.375Z",
    destination: mockDestination,
    isFavorite: false,
    offers: [mockOffer],
    type: "taxi",
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808c",
    basePrice: 1120,
    dateFrom: "2019-07-10T22:55:56.845Z",
    dateTo: "2019-07-11T11:22:13.375Z",
    destination: mockDestination,
    isFavorite: false,
    offers: [mockOffer],
    type: "flight",
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808c",
    basePrice: 1130,
    dateFrom: "2019-08-10T22:55:56.845Z",
    dateTo: "2019-08-11T11:22:13.375Z",
    destination: mockDestination,
    isFavorite: false,
    offers: [mockOffer],
    type: "taxi",
  },
];
