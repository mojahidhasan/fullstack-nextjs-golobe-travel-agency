import { objDeepCompare } from "@/lib/utils";
import { createSlice } from "@reduxjs/toolkit";

export const defaultPassengerPreference = {
  passengerType: "",
  seating: {
    position: "",
    location: "",
    legroom: "",
    quietZone: false,
    nearLavatory: "",
  },
  baggage: {
    type: "",
    extraAllowance: false,
    specialHandling: false,
  },
  meal: {
    type: "",
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
};
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
