import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
const stayFormSlice = createSlice({
  name: "stayForm",
  initialState: {
    value: {
      destination: "",
      checkIn: new Date().toISOString(),
      checkOut: addDays(new Date(), 1).toISOString(),
      rooms: 1,
      guests: 1,
      promocode: "",
    },
  },
  reducers: {
    setStayForm(state, action) {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
  },
});

export const { setStayForm } = stayFormSlice.actions;
export default stayFormSlice.reducer;
