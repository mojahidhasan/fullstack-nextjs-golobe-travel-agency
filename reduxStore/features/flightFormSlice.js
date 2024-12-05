import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";

const d = new Date();
export const defaultFlightFormValue = {
  from: "",
  to: "",
  departureAirportCode: "",
  arrivalAirportCode: "",
  trip: "oneway",
  departDate: d.toString(),
  returnDate: "",
  passenger: {
    adult: 1,
    children: 0,
  },
  class: "economy",
  promocode: "",
  firstAvailableFlightDate: d.toString(),
  lastAvailableFlightDate: addDays(d, 9).toString(),
  filters: {
    rates: [], // 1,2,3,4,5
    airlines: [], // EK, FZ, EY
    priceRange: [400, 2000], // min, max
    departureTime: [0, 86340000], // 24 hours in milliseconds , min and max
  },
};

const flightFormSlice = createSlice({
  name: "flightForm",
  initialState: {
    value: defaultFlightFormValue,
  },
  reducers: {
    setFlightForm(state, action) {
      state.value = {
        ...state.value,
        filters: { ...state.value.filters },
        ...action.payload,
      };
    },
    setFlightFormFilters(state, action) {
      state.value.filters = { ...state.value.filters, ...action.payload };
    },
    resetFilters(state, action) {
      state.value.filters = defaultFlightFormValue.filters;
    },
  },
});

export const { setFlightForm, setFlightFormFilters, resetFilters } =
  flightFormSlice.actions;
export default flightFormSlice.reducer;

// reduxStore\features\flightFormSlice.js
