import { configureStore } from "@reduxjs/toolkit";

import flightFormSlice from "@/reduxStore/features/flightFormSlice";
import stayFormSlice from "@/reduxStore/features/stayFormSlice";
import singlePassengerFormSlice from "@/reduxStore/features/singlePassengerFormSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      flightForm: flightFormSlice,
      stayForm: stayFormSlice,
      singlePassengerForm: singlePassengerFormSlice,
    },
  });
};
