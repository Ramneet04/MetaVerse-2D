import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/auth"
import profileSlice from "../slices/profileSlice"
const rootReducer = combineReducers({
    auth:authSlice,
    profile:profileSlice
})
export default rootReducer;