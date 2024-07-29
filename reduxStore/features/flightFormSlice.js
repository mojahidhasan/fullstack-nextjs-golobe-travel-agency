import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
const value = {
  from: "",
  to: "",
  departIataCode: "",
  arriveIataCode: "",
  trip: "Round-Trip",
  depart: new Date().toISOString(),
  return: addDays(new Date(), 7).toISOString(),
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
    price: [50, 1200],
    departureTime: [],
  },
};

const flightFormSlice = createSlice({
  name: "flightForm",
  initialState: {
    value,
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
      state.filters = { ...state.filters, ...action.payload };
    },
    setFilterRate: (state, action) => {
      state.filters.rate = action.payload;
    },
    setFilterAirlines: (state, action) => {
      if (action.payload.add) {
        state.filters.airlines.push(action.payload.add);
      } else if (action.payload.remove) {
        state.filters.airlines = state.filters.airlines.filter((val) => {
          return val !== action.payload.remove;
        });
      }
    },
    setFilterTrips: (state, action) => {
      if (action.payload.add) {
        state.filters.trips.push(action.payload.add);
      } else if (action.payload.remove) {
        state.filters.trips = state.filters.trips.filter((val) => {
          return val !== action.payload.remove;
        });
      }
    },
  },
});

export const {
  setFlightForm,
  setFlightFormFilters,

  getFlightForm,
  setFilterAirlines,
  setFilterRate,
  setFilterTrips,
  setFilterPrice,
  setFilterDepartureTime,

  resetFilters,
} = flightFormSlice.actions;
export default flightFormSlice.reducer;

// reduxStore\features\flightFormSlice.js
