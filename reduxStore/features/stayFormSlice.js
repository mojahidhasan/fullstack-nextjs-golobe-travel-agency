import { createSlice } from "@reduxjs/toolkit";

export const defaultHotelFormValue = {
  destination: {
    city: "",
    country: "",
  },
  checkIn: "",
  checkOut: "",
  rooms: 1,
  guests: 1,
  promocode: "",
  filters: {
    priceRange: [0, 2000],
    rates: [],
    features: [],
    amenities: [],
  },
  defaultFilterValues: {
    rates: [],
    priceRange: [0, 2000],
    amenities: [],
    features: [],
  },
  errors: {},
};

const stayFormSlice = createSlice({
  name: "stayForm",
  initialState: {
    value: defaultHotelFormValue,
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
        ...defaultHotelFormValue.defaultFilterValues,
        ...state.value.defaultFilterValues,
        ...state.value.filters,
        ...action.payload,
      };
    },
    setDefaultStayFilters(state, action) {
      state.value.defaultFilterValues = {
        ...defaultHotelFormValue.defaultFilterValues,
        ...state.value.defaultFilterValues,
        ...action.payload,
      };
    },
    resetStayFilters(state) {
      state.value.filters = state.value.defaultFilterValues;
    },
  },
});

export const {
  setStayForm,
  setStayFilter,
  setDefaultStayFilters,
  resetStayFilters,
} = stayFormSlice.actions;
export default stayFormSlice.reducer;
