import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appDispatch } from "./store";
import { fetchHomeData } from "./homeDataSlice";

const FetchDataPage = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<appDispatch>();

    useEffect(() => {
        // Dispatch your fetchHomeData action when the app loads
        dispatch(
            fetchHomeData({
                loadingIntroHome: true,
                loadingFatherInfor: true,
                loadingImage: true,
            })
        );
    }, [dispatch]);

    return <>{children}</>;
};

export default FetchDataPage;

