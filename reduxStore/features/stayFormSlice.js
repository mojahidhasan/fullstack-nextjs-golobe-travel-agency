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
    priceRange: [0, Infinity],
    rate: [],
    features: [],
    amenities: [],
  },
  filtersData: {
    minPrice: 0,
    maxPrice: 0,
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
        ...state.value.filters,
        ...action.payload,
      };
    },
    resetStayFilters(state) {
      state.value.filters = {
        ...defaultHotelFormValue.filters,
        priceRange: [
          state.value.filtersData.minPrice,
          state.value.filtersData.maxPrice,
        ],
      };
    },
  },
});

export const { setStayForm, setStayFilter, resetStayFilters } =
  stayFormSlice.actions;
export default stayFormSlice.reducer;
