import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    isLogin: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login : (state, action) => {
            return {
                userData: action.payload, 
                isLogin: true
            }
        },
        logout: (state, action) => {
            return {
                userData: null,
                isLogin: false
            }
        },
        addSocketId: (state, action) => {
            return {
                userData: {...state.userData, socketId: action.payload},
                isLogin: true
            }
        }
    }
})

export const {login, logout, addSocketId} = userSlice.actions
export default userSlice.reducer