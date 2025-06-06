import toast from "react-hot-toast";
import { baseURL } from "../const";
import { api } from "./apiInterceptor";
import axios from "axios";

export const apiCallHandler = async ({endpoint, method = 'GET', data = null, headers = {}, signal = null, onUploadProgress}) => {
    try {
        return await api({
            url: `${baseURL}${endpoint}`,
            method,
            data,
            headers,
            withCredentials: true,
            signal,
            onUploadProgress,
        });
    } catch (error) {
        if (axios.isCancel(error)) return;

        // Handle 401 Unauthorized 
        if (error?.response?.status === 401) return

        // Handle Other API Errors
        if (error?.response) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } else if (error.request) {
            toast.error("No response from server!");
        } else {
            toast.error(error)
        }

        return Promise.reject(error);
    }
};