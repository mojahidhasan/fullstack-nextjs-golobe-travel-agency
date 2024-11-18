import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
export const defaultFlightFormValue = {
  from: "",
  to: "",
  departureAirportCode: "",
  arrivalAirportCode: "",
  trip: "oneway",
  departDate: new Date().toString(),
  returnDate: "",
  passenger: {
    adult: 1,
    children: 0,
  },
  class: "economy",
  promocode: "",
  firstAvailableFlightDate: new Date().toString(),
  lastAvailableFlightDate: addDays(new Date(), 9).toString(),
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
