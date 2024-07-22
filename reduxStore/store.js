import { configureStore } from "@reduxjs/toolkit";

import counterSlice from "@/reduxStore/features/counterSlice";
import flightFormSlice from "@/reduxStore/features/flightFormSlice";
import stayFormSlice from "@/reduxStore/features/stayFormSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      flightForm: flightFormSlice,
      stayForm: stayFormSlice,
    },
  });
};
