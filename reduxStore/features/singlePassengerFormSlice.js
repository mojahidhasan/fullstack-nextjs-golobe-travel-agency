import { createSlice } from "@reduxjs/toolkit";

export const defaultPassengerPreference = {
  key: "",
  passengerType: "",
  seating: {
    position: "any",
    location: "any",
    legroom: "none",
    quietZone: false,
    nearLavatory: "",
  },
  baggage: {
    type: "any",
    extraAllowance: false,
    specialHandling: false,
  },
  meal: {
    type: "standard",
    specialMealType: "",
  },
  specialAssistance: {
    wheelchair: false,
    boarding: false,
    elderlyInfant: false,
    medicalEquipment: false,
  },
  other: {
    entertainment: false,
    wifi: false,
    powerOutlet: false,
  },
  errors: {},
};
export const defaultPassengerFormValue = {
  passengerType: "",
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
  key: "",
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
