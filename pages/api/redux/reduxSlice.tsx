import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserCredential } from "firebase/auth";
const initialState: UserCredential = {
    user: null,
    providerId: null,
    operationType: null,
}

const fireBase_Store = createSlice({
    name: 'fireBaseStore',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserCredential>) => {
            state.user = action.payload.user;
            state.providerId = action.payload.providerId;
            state.operationType = action.payload.operationType;
            console.log('payload user ', state.operationType)
        },
        logout: (state, action: PayloadAction<UserCredential>) => {
            state.user = null;
        }
    }
})

export const { login, logout } = fireBase_Store.actions;
export default fireBase_Store.reducer;