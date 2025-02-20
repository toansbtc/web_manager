import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import actionDB from "../DB/actionDB"

const image_active = {
    id: 0,
    title: '',
    list_image: ""
}



export const fetchActiveImage = createAsyncThunk("active/fetchActive",
    async () => {
        let data: [typeof image_active] = null;
        try {
            const result = await axios.post('/api/DB/CRUDactiveTitle', { "action": actionDB.GETLISTDATA })
            if (result.status === 200 && result.data)
                data = result.data
        } catch (error) {
            console.error(error)
        }
        return data;
    }
)



const initialState = {
    list_image_active: [image_active],
    loading: true
}

const activeState = createSlice({
    'name': 'youngRedux',
    initialState,
    reducers: {
        updateActiveImage: (state, action) => {
            state.list_image_active = action.payload
        }
    },
    extraReducers(builder) {

        builder.addCase(fetchActiveImage.pending, (state) => {
            state.loading = true
        }).addCase(fetchActiveImage.fulfilled, (state, action) => {
            // console.log("active data", action.payload)
            state.list_image_active = action.payload
            state.loading = false
        }).addCase(fetchActiveImage.rejected, (state, action) => {
            state.list_image_active = null;
            state.loading = false
            console.error(action.error)
        })


    },

})
export const { updateActiveImage } = activeState.actions
export default activeState.reducer;