import actionDB from "@/pages/api/DB/actionDB";
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchHomeData = createAsyncThunk("home/fetchHomeData",

  async ({ loadingIntroHome, loadingFatherInfor, loadingImage }: { loadingIntroHome: boolean, loadingFatherInfor: boolean, loadingImage: boolean }) => {
    const request = [];
    if (loadingIntroHome)
      request.push(axios.post('/api/DB/CRUDintroHome', { "action": actionDB.GETDATA, "data": { "type": "introduct" } }))
    else
      request.push({})
    if (loadingFatherInfor)
      request.push(axios.post('/api/DB/CRUDfatherInfor', { "action": actionDB.GETLISTDATA }))
    else
      request.push({})
    if (loadingImage)
      request.push(axios.post("/api/DB/CRUDintroHome", { "action": actionDB.GETDATA, "data": { "type": "image" } }))
    else
      request.push({})

    const result = await Promise.all(request);
    // console.log("request", result)
    const [dataDescription, dataFatherIntro, dataImage] = result.map((res) => res.data)

    return { dataDescription, dataFatherIntro, dataImage };
  }
)


const initialState = {
  dataDescription: null,
  dataFatherIntro: [],
  dataImagePath: null,
  loading: true,
  error: null,
}

const homeRedux = createSlice({
  name: 'homeData',
  initialState,
  reducers: {
    handleHomeFatherIntro_Add: (state, action) => {

      try {
        const data = {
          "id": action.payload.id,
          "name": action.payload.name,
          "introduction": action.payload.introduction,
          "office": action.payload.office,
          "time_start": action.payload.time_start,
          "id_image_path": action.payload.id_image_path,
          "image_path": {
            "id_image_path": action.payload.id_image_path,
            "image_path": action.payload.image_path
          },
        }
        state.dataFatherIntro.push(data)
      } catch (error) {
        console.log("resux add father infor", error)
      }
    },
    handleHomeFatherIntro_Update: (state, action) => {
      try {
        const data = {
          "id": action.payload.id,
          "name": action.payload.name,
          "introduction": action.payload.introduction,
          "office": action.payload.office,
          "time_start": action.payload.time_start,
          "id_image_path": action.payload.id_image_path,
          "image_path": {
            "id_image_path": action.payload.id_image_path,
            "image_path": action.payload.image_path
          },
        }
        const possition = state.dataFatherIntro.findIndex((item) => item.id === action.payload.id)
        if (possition != -1)
          state.dataFatherIntro[possition] = { ...state.dataFatherIntro[possition], ...data }
        // console.log(state.dataFatherIntro)
      } catch (error) {
        console.log("redux update father infor", error)
      }
    },
    handleHomeFatherIntro_Delete: (state, action) => {

      try {
        const index = state.dataFatherIntro.findIndex((item) => item.id === action.payload.id)
        if (index != -1)
          state.dataFatherIntro = state.dataFatherIntro.filter((item) => item.id !== action.payload.id)
      } catch (error) {
        console.log("redux delete father infor", error)
      }
    },

    handleHomeDescription: (state, action) => {
      state.dataDescription = action.payload
    },
    handleHomeImagePath: (state, action) => {
      state.dataDescription = action.payload

    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHomeData.pending, (state) => {
      state.loading = true;
      state.error = null
    })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        // console.log('action.payload data', action.payload)
        if (action.payload.dataDescription !== undefined)
          state.dataDescription = action.payload.dataDescription
        if (action.payload.dataFatherIntro !== undefined)
          state.dataFatherIntro = action.payload.dataFatherIntro
        if (action.payload.dataImage !== undefined)
          state.dataImagePath = action.payload.dataImage
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message
      })
  }

})

export const {
  handleHomeDescription,
  handleHomeImagePath,
  handleHomeFatherIntro_Add, handleHomeFatherIntro_Delete, handleHomeFatherIntro_Update } = homeRedux.actions;
export default homeRedux.reducer;

