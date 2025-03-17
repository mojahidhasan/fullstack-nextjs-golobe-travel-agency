import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";

const d = new Date();
export const defaultFlightFormValue = {
  from: "",
  to: "",
  departureAirportCode: "",
  arrivalAirportCode: "",
  tripType: "one_way",
  desiredDepartureDate: d.toISOString(),
  desiredReturnDate: "",
  passengers: {
    adult: 1,
    child: 0,
    infant: 0,
  },
  class: "economy",
  promoCode: "",
  firstAvailableFlightDate: d.toISOString(),
  lastAvailableFlightDate: addDays(d, 9).toISOString(),
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
