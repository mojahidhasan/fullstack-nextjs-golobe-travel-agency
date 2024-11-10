import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";

const defaultValue = {
  destination: "",
  checkIn: new Date().toString(),
  checkOut: addDays(new Date(), 1).toString(),
  rooms: 1,
  guests: 1,
  promocode: "",
  filters: {
    priceRange: [50, 1200],
    rate: [],
    freebies: [],
    amenities: [],
  },
};

const stayFormSlice = createSlice({
  name: "stayForm",
  initialState: {
    value: defaultValue,
  },
  reducers: {
    setStayForm(state, action) {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
    setStayFilter(state, action) {
      state.value.filters = {
        ...state.value.filters,
        ...action.payload,
      };
    },
    resetStayFilters(state) {
      state.value.filters = defaultValue.filters;
    },
  },
});

export const { setStayForm, setStayFilter, resetStayFilters } =
  stayFormSlice.actions;
export default stayFormSlice.reducer;
