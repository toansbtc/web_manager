import { createSlice } from "@reduxjs/toolkit"

const controlLogin = createSlice({
    name: "controlLoggin",
    initialState: {
        isopenLoggin: false
    },
    reducers: {
        openClose_Login: (state, action) => {
            state.isopenLoggin = action.payload
        }
    }
})

export const { openClose_Login } = controlLogin.actions
export default controlLogin.reducer