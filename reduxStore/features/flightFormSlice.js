import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
const initialState = {
  from: "",
  to: "",
  trip: "Economy",
  depart: new Date().toISOString(),
  return: addDays(new Date(), 7).toISOString(),
  passenger: "1",
  class: "",
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
  initialState,
  reducers: {
    setFrom: (state, action) => {
      state.from = action.payload;
    },
    setTo: (state, action) => {
      state.to = action.payload;
    },
    setTrip: (state, action) => {
      state.trip = action.payload;
    },
    setDepart: (state, action) => {
      state.depart = action.payload;
    },
    setReturn: (state, action) => {
      state.return = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setPassenger: (state, action) => {
      state.passenger = action.payload;
    },
    setClass: (state, action) => {
      state.class = action.payload;
    },
    setPromocode: (state, action) => {
      state.promocode = action.payload;
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
    setFilterPrice: (state, action) => {
      state.filters.price = action.payload;
    },
    setFilterDepartureTime: (state, action) => {
      state.filters.departureTime = action.payload;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setFrom,
  setTo,
  setTrip,
  setDepart,
  setReturn,
  setDate,
  setPassenger,
  setClass,
  setPromocode,

  setFilterAirlines,
  setFilterRate,
  setFilterTrips,
  setFilterPrice,
  setFilterDepartureTime,

  resetFilters,
} = flightFormSlice.actions;
export default flightFormSlice.reducer;

// reduxStore\features\flightFormSlice.js
