import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import actionDB from "../DB/actionDB"

const infor_type = {
    user_token: "",
    role: -1,
    is_active: true,
    infor: {
        name: "",
        birth_day: "",
        address: "",
        job: "",
        number_phone: "",
        self_introduc: "",
        reading: false,
        canRead: false,
        situation: "",
        image_path: {
            image_path: ""
        }
    }
}



export const fetchYoungInfor = createAsyncThunk("young/fetchInfor",
    async ({ user_token }: { user_token: string }) => {
        let data: typeof infor_type = null;
        try {
            const result = await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": user_token } })
            if (result.status === 200 && result.data)
                data = result.data
        } catch (error) {
            console.error(error)
        }

        return data;
    }
)

export const fetchYoungMember = createAsyncThunk("young/fetchMember",
    async () => {
        let data: [typeof infor_type] = null;
        try {
            const result = await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETLISTDATA })
            if (result.status === 200 && result.data)
                data = result.data
        } catch (error) {
            console.error(error)
        }
        return data;
    }
)



const initialState = {
    infor: infor_type,
    member: [infor_type],
    loading: true
}

const YoungState = createSlice({
    'name': 'youngRedux',
    initialState,
    reducers: {
        updateinfor: (state, action) => {

            state.infor.infor = action.payload
        },
        updateMember: (state, action) => {
            state.member = action.payload
            // console.log(state.member)
        }
    },
    extraReducers(builder) {

        // handel infor data 
        builder.addCase(fetchYoungInfor.pending, (state) => {
            state.loading = true
        }).addCase(fetchYoungInfor.fulfilled, (state, action) => {
            state.infor = action.payload
            state.loading = false
        }).addCase(fetchYoungInfor.rejected, (state, action) => {
            state.infor = null;
            state.loading = false
            console.error(action.error)
        })


        // handle member data
        builder.addCase(fetchYoungMember.pending, (state) => {
            state.loading = true
        }).addCase(fetchYoungMember.fulfilled, (state, action) => {
            state.member = action.payload
            state.loading = false
        }).addCase(fetchYoungMember.rejected, (state, action) => {
            state.member = null;
            state.loading = false
            console.error(action.error)
        })

    },

})

export const { updateMember, updateinfor } = YoungState.actions
export default YoungState.reducer;