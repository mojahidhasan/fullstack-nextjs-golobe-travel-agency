import { createSlice } from "@reduxjs/toolkit";
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
