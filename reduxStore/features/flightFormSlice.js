import { createSlice } from "@reduxjs/toolkit";
import { addYears } from "date-fns";

const d = new Date();
export const defaultFlightFormValue = {
  // main props
  from: {},
  to: {},
  tripType: "one_way",
  desiredDepartureDate: d.toISOString(),
  desiredReturnDate: "",
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  class: "economy",
  // helper props
  availableFlightDateRange: {
    from: d.getTime(),
    to: addYears(d, 100).getTime(),
  },
  filters: {
    rates: [], // 1,2,3,4,5
    airlines: [], // EK, FZ, EY
    priceRange: [400, 2000], // min, max
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
      const newValue = { ...state.value, ...action.payload };
      const passengerObj = newValue.passengers;
      const totalPassengers = Object.values(passengerObj).reduce(
        (acc, value) => +acc + +value,
        0
      );
      if (action.payload.passengers) {
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
          delete newValue.errors.passengers;
        }
      }
      state.value = newValue;
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
