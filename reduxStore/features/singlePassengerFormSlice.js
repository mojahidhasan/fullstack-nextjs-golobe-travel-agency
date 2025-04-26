import { createSlice } from "@reduxjs/toolkit";

export const defaultPassengerFormValue = {
  title: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  passportNumber: "",
  passportExpiryDate: "",
  gender: "",
  country: "",
  frequentFlyerNumber: "",
  frequentFlyerAirline: "",
  phoneNumber: {
    dialCode: "+358",
    number: "",
  },
  email: "",

  // helper props
  passengerType: "",
  isPrimary: false,
  errors: {},
  saveDetails: false,
};

const singlePassengerForm = createSlice({
  name: "singlePassengerForm",
  initialState: {
    value: defaultPassengerFormValue,
  },
  reducers: {
    setPassengerForm(state, action) {
      const newValue = { ...state.value, ...action.payload };
      state.value = newValue;
    },
    resetPassengerForm(state) {
      state.value = defaultPassengerFormValue;
    },
  },
});

export const { setPassengerForm, resetPassengerForm } =
  singlePassengerForm.actions;
export default singlePassengerForm.reducer;

// reduxStore\features\singlePassengerFormSlice.js
