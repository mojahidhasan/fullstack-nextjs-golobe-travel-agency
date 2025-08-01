import { createSlice } from "@reduxjs/toolkit";
import { addYears } from "date-fns";

const d = new Date().toLocaleString("en-CA", {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const defaultFlightFormValue = {
  // main props
  from: {},
  to: {},
  tripType: "one_way",
  desiredDepartureDate: "",
  desiredReturnDate: "",
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  class: "economy",
  // helper props
  availableFlightDateRange: {
    from: Date.parse(d),
    to: addYears(Date.parse(d), 100).getTime(),
  },
  filters: {
    rates: [], // 1,2,3,4,5
    airlines: [], // EK, FZ, EY
    priceRange: [400, 2000], // min, max
    departureTime: [0, 86340000], // 24 hours in milliseconds , min and max
  },
  defaultFilterValues: {
    rates: [], // 1,2,3,4,5
    airlines: [], // EK, FZ, EY
    priceRange: [400, 2000],
    departureTime: [0, 86340000], // 24 hours in milliseconds , min and max
  },
  errors: {},
};

const flightFormSlice = createSlice({
  name: "flightForm",
  initialState: {
    value: defaultFlightFormValue,
  },
  reducers: {
    setFlightForm(state, action) {
      let newValue = { ...state.value, ...action.payload };
      if (action.payload?.passengers) {
        const passengerObj = newValue?.passengers;
        const totalPassengers = Object.values(passengerObj).reduce(
          (acc, value) => +acc + +value,
          0,
        );
        if (+totalPassengers > 9) {
          newValue.errors = {
            ...state.value.errors,
            passengers: "Total passengers cannot be more than 9",
          };
        } else if (+passengerObj.adults < +passengerObj.infants) {
          newValue.errors = {
            ...state.value.errors,
            passengers: "Infants cannot be more than adults",
          };
        } else {
          const { passengers, ...restErrors } = newValue.errors || {};
          newValue.errors = restErrors;
        }
      }
      state.value = newValue;
    },
    setFlightFormFilters(state, action) {
      state.value.filters = { ...state.value.filters, ...action.payload };
    },
    setDefaultFlightFilters(state, action) {
      state.value.defaultFilterValues = {
        ...defaultFlightFormValue.defaultFilterValues,
        ...action.payload,
      };
    },
    resetFilters(state, action) {
      state.value.filters = state.value.defaultFilterValues;
    },
  },
});

export const {
  setFlightForm,
  setDefaultFlightFilters,
  setFlightFormFilters,
  resetFilters,
} = flightFormSlice.actions;
export default flightFormSlice.reducer;

// reduxStore\features\flightFormSlice.js
