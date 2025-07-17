import { createSlice } from "@reduxjs/toolkit";

export const defaultRooms = [];
const hotelRoomsSelector = createSlice({
  name: "hotelRoomsSelector",
  initialState: {
    value: defaultRooms,
  },
  reducers: {
    addRoom(state, action) {
      state.value.push(action.payload);
    },
    removeRoomById(state, action) {
      const keyedRooms = state.value.filter((r) => r._id === action.payload);
      keyedRooms.pop();
      const excludedKeyedRooms = state.value.filter(
        (r) => r._id !== action.payload,
      );
      state.value = [...excludedKeyedRooms, ...keyedRooms];
    },
    setRooms(state, action) {
      if (!action.payload || !Array.isArray(action.payload)) {
        console.error("Invalid payload for setRooms, expected an array");
        return;
      }
      state.value = action.payload;
    },
  },
});

export const { addRoom, removeRoomById, setRooms } = hotelRoomsSelector.actions;
export default hotelRoomsSelector.reducer;

// reduxStore\features\singlePassengerFormSlice.js
