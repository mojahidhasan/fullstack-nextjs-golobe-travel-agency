import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
export const defaultFlightFormValue = {
  from: "",
  to: "",
  originAirportCode: "",
  destinationAirportCode: "",
  trip: "Round-Trip",
  departDate: new Date().toISOString(),
  returnDate: addDays(new Date(), 7).toISOString(),
  passenger: {
    adult: 1,
    children: 0,
  },
  class: "Economy",
  promocode: "",
  filters: {
    rate: [],
    airlines: [],
    trips: [],
    priceRange: [50, 1200],
    departureTime: [50, 1200],
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
