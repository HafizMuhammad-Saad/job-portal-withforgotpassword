// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { forgotPassword, resetPassword } from './AuthApi'

// const initialState = {
//     forgotPasswordStatus: "idle",
//     forgotPasswordSuccessMessage: null,
//     forgotPasswordError: null,
//     resetPasswordStatus: "idle",
//     resetPasswordSuccessMessage: null,
//     resetPasswordError: null,
// }

// export const forgotPasswordAsync = createAsyncThunk('auth/forgotPasswordAsync', async (cred) => {
//     const res = await forgotPassword(cred)
//     return res
// })

// export const resetPasswordAsync = createAsyncThunk('auth/resetPasswordAsync', async (cred) => {
//     const res = await resetPassword(cred)
//     return res
// })

// const authSlice = createSlice({
//     name: "authSlice",
//     initialState: initialState,
//     reducers: {
//         resetForgotPasswordStatus: (state) => {
//             state.forgotPasswordStatus = 'idle'
//         },
//         clearForgotPasswordSuccessMessage: (state) => {
//             state.forgotPasswordSuccessMessage = null
//         },
//         clearForgotPasswordError: (state) => {
//             state.forgotPasswordError = null
//         },
//         resetResetPasswordStatus: (state) => {
//             state.resetPasswordStatus = 'idle'
//         },
//         clearResetPasswordSuccessMessage: (state) => {
//             state.resetPasswordSuccessMessage = null
//         },
//         clearResetPasswordError: (state) => {
//             state.resetPasswordError = null
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(forgotPasswordAsync.pending, (state) => {
//                 state.forgotPasswordStatus = 'pending'
//             })
//             .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
//                 state.forgotPasswordStatus = 'fullfilled'
//                 state.forgotPasswordSuccessMessage = action.payload
//             })
//             .addCase(forgotPasswordAsync.rejected, (state, action) => {
//                 state.forgotPasswordStatus = 'rejected'
//                 state.forgotPasswordError = action.error
//             })

//             .addCase(resetPasswordAsync.pending, (state) => {
//                 state.resetPasswordStatus = 'pending'
//             })
//             .addCase(resetPasswordAsync.fulfilled, (state, action) => {
//                 state.resetPasswordStatus = 'fullfilled'
//                 state.resetPasswordSuccessMessage = action.payload
//             })
//             .addCase(resetPasswordAsync.rejected, (state, action) => {
//                 state.resetPasswordStatus = 'rejected'
//                 state.resetPasswordError = action.error
//             })



//     }
// })

// export const selectForgotPasswordStatus=(state)=>state.AuthSlice.forgotPasswordStatus
// export const selectForgotPasswordSuccessMessage=(state)=>state.AuthSlice.forgotPasswordSuccessMessage
// export const selectForgotPasswordError=(state)=>state.AuthSlice.forgotPasswordError
// export const selectResetPasswordStatus=(state)=>state.AuthSlice.resetPasswordStatus
// export const selectResetPasswordSuccessMessage=(state)=>state.AuthSlice.resetPasswordSuccessMessage
// export const selectResetPasswordError=(state)=>state.AuthSlice.resetPasswordError

// export const {resetResendOtpStatus,clearForgotPasswordError,clearForgotPasswordSuccessMessage,resetForgotPasswordStatus,clearResetPasswordError,clearResetPasswordSuccessMessage,resetResetPasswordStatus}=authSlice.actions

// export default authSlice.reducer