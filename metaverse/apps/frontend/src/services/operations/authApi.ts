import toast, { Toast } from "react-hot-toast";
import { endpoints } from "../apis";
import { setLoading, setToken } from "@/slices/auth";
import { setUser } from "@/slices/profileSlice";
import axios from "axios";
const {
    LOGIN_API
} = endpoints;

export function login(username,password,navigate){
    return async (dispatch)=>{
        const toastId = toast.loading("Signing in...");
        dispatch(setLoading(true));
        try {
            const response = await axios.post(LOGIN_API,{
                username,
                password
            });
            console.log(response);
            if (response.status !==200) {
                throw new Error(response.data.message)
                toast.error(response.data?.message || "Sign in Failed" );
            }
            toast.success("Sign in success");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.user?.avatar?.imageUrl ? response.data?.user?.avatar?.imageUrl : "";
            dispatch(setUser({ ...response.data.user, avatar: userImage }))
            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate("/dashboard/my-profile")
        } catch (error) {
            console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
        }
        dispatch(setLoading(false))
    toast.dismiss(toastId)
    }
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }