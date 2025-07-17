import { configureStore } from "@reduxjs/toolkit";

import flightFormSlice from "@/reduxStore/features/flightFormSlice";
import stayFormSlice from "@/reduxStore/features/stayFormSlice";
import singlePassengerFormSlice from "@/reduxStore/features/singlePassengerFormSlice";
import hotelRoomsSelectorSlice from "@/reduxStore/features/hotelRoomSelectorSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      flightForm: flightFormSlice,
      stayForm: stayFormSlice,
      singlePassengerForm: singlePassengerFormSlice,
      hotelRoomsSelector: hotelRoomsSelectorSlice,
    },
  });
};
