import { configureStore } from "@reduxjs/toolkit";

import counterSlice from "./features/counterSlice";
import flightFormSlice from "./features/flightFormSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      flightForm: flightFormSlice,
    },
  });
};
