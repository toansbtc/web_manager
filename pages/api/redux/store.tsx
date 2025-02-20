import { configureStore } from "@reduxjs/toolkit";
import fireBaseRedux from './reduxSlice'
import homeDataSlice from "./homeDataSlice";
import activeState from "./activeDataSlice";
import openClose_logginSlice from "./openClose_logginSlice";
import youngDataSlide from "./youngDataSlide";

const store = configureStore({
    reducer: {
        fireBaseRedux,
        homedata: homeDataSlice,
        youngData: youngDataSlide,
        activeData: activeState,
        controlLogin: openClose_logginSlice
    }
})

export type rootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
export default store;
// export default function main(){};