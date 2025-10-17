import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

export const forgotPasswordApi = async (cred) => {
    try {
        const res = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, cred);
        return res.data;
    } catch (error) {
        // Throwing response data/error structure for component to catch
        throw error.response?.data || { message: "Network Error or Unknown Failure" };
    }
};


export const resetPasswordApi = async (cred) => {
    try {
        const res = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, cred);
        return res.data;
    } catch (error) {
        // Throwing response data/error structure for component to catch
        throw error.response?.data || { message: "Network Error or Unknown Failure" };
    }
};

// import axios from "axios";

// export const forgotPassword= async(cred) => {
//     try {
//         const res=await axios.post("api/auth/forgot-password", cred)
//         return res.data
//     } catch (error) {
//         throw error.response.data
        
//     }
// }

// export const resetPassword=async(cred)=>{
//     try {
//         const res=await axios.post("api/auth/reset-password",cred)
//         return res.data
//     } catch (error) {
//         throw error.response.data
//     }
// }