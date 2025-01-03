import { configureStore } from "@reduxjs/toolkit";

import flightFormSlice from "@/reduxStore/features/flightFormSlice";
import stayFormSlice from "@/reduxStore/features/stayFormSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      flightForm: flightFormSlice,
      stayForm: stayFormSlice,
    },
  });
};
