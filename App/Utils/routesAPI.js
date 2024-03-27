import axios from "axios";

const BASE_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
const API_KEY = "AIzaSyCxc1r3WrUaXEDvbOUQr_dnA8l4J0CAxog";
const config = {
  headers: {
    "content-type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": [
      "routes.duration",
      "routes.distanceMeters",
      "routes.polyline.encodedPolyline",
      "routes.travelAdvisory.tollInfo",
      "routes.legs.travelAdvisory.tollInfo",
    ],
  },
};
const calculateRoutes = (data) => axios.post(BASE_URL, data, config);
export default { calculateRoutes, API_KEY };
