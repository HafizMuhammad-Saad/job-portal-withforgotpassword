import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import { resetPasswordApi } from './auth/AuthApi'; // Assuming AuthApi.js is one level up

// --- UI Components (Same Tailwind structure as before) ---
const TextField = ({ className, error, ...props }) => (
    <input 
        className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`} 
        type="text" 
        {...props} 
    />
);

const FormHelperText = ({ children, error }) => (
    <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
        {children}
    </p>
);

const LoadingButton = ({ loading, children, className, ...props }) => (
    <button 
        className={`w-full h-10 rounded-md text-white font-medium transition duration-200 
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                    ${className}`} 
        disabled={loading}
        {...props}
    >
        {loading ? 'Processing...' : children}
    </button>
);

// --- The Refactored Component ---
export const ResetPassword = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { userId, passwordResetToken } = useParams();

    // Local State Management (Replacing Redux)
    const [status, setStatus] = useState('idle'); // 'idle', 'pending', 'fullfilled', 'rejected'
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Error Toast Effect
    useEffect(() => {
        if (error) {
            toast.error(error?.message);
            setError(null); 
        }
    }, [error]);

    // Success Toast Effect & Navigation
    useEffect(() => {
        if (status === 'fullfilled' && successMessage) {
            toast.success(successMessage?.message);
            // Navigate after success
            navigate("/login");
            setSuccessMessage(null);
        }
    }, [status, successMessage, navigate]);

    // Clear status on unmount
    useEffect(() => {
        return () => {
            setStatus('idle');
        }
    }, []);

    const handleResetPassword = async (data) => {
        setStatus('pending');
        setError(null);
        setSuccessMessage(null);

        // Construct payload with tokens from params
        const cred = { 
            password: data.password, 
            userId: userId, 
            token: passwordResetToken 
        };

        try {
            const result = await resetPasswordApi(cred);
            setSuccessMessage(result);
            setStatus('fullfilled');
        } catch (err) {
            setError(err);
            setStatus('rejected');
        } finally {
            reset();
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-50">

            <div> 
                <div className="bg-white shadow-xl rounded-xl">
                    
                    <form 
                        className="flex flex-col space-y-4 w-[95vw] p-4 sm:w-[30rem] sm:p-6"
                        noValidate 
                        onSubmit={handleSubmit(handleResetPassword)}
                    >

                        <div className="flex flex-col space-y-1">
                            
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Reset Password
                            </h2>
                            
                            <p className="text-sm text-gray-500">
                                Please enter and confirm new password
                            </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                            
                            <MotionConfig whileHover={{ y: -2 }}>

                                {/* New Password Field */}
                                <motion.div>
                                    <TextField 
                                        type='password' 
                                        className="mt-1"
                                        {...register("password", {
                                            required: "Please enter a password",
                                            pattern: {
                                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                                message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`
                                            }
                                        })}
                                        placeholder='New Password'
                                        error={errors.password}
                                    />
                                    {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                                </motion.div>
                                
                                {/* Confirm Password Field */}
                                <motion.div>
                                    <TextField 
                                        type='password' 
                                        className="mt-1"
                                        {...register("confirmPassword", {
                                            required: "Please Confirm the password",
                                            validate: (value, formValues) => value === formValues.password || "Passwords dosen't match"
                                        })}
                                        placeholder='Confirm New Password'
                                        error={errors.confirmPassword}
                                    />
                                    {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
                                </motion.div>
                                
                            </MotionConfig>
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
                            <LoadingButton 
                                loading={status === 'pending'} 
                                type='submit' 
                                className="h-10 text-base"
                            >
                                Reset Password
                            </LoadingButton>
                        </motion.div>
                    </form>
                </div>
            </div>
        </div>
    );
};


// import React, { useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     clearResetPasswordError, 
//     clearResetPasswordSuccessMessage, 
//     resetPasswordAsync, 
//     resetResetPasswordStatus, 
//     selectResetPasswordError, 
//     selectResetPasswordStatus, 
//     selectResetPasswordSuccessMessage 
// } from './auth/AuthSlice';
// import { useNavigate, useParams } from 'react-router-dom';
// import { MotionConfig, motion } from 'framer-motion';

// // --- Assuming Custom/HTML Components for the UI ---

// // Reusable Input Component styled with Tailwind
// const TextField = ({ className, error, ...props }) => (
//     <input 
//         className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'} ${className}`} 
//         type="text" 
//         {...props} 
//     />
// );

// // Reusable Helper Text styled with Tailwind
// const FormHelperText = ({ children, error }) => (
//     <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
//         {children}
//     </p>
// );

// // Reusable Loading Button styled with Tailwind
// const LoadingButton = ({ loading, children, className, ...props }) => (
//     <button 
//         className={`w-full h-10 rounded-md text-white font-medium transition duration-200 
//                     ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
//                     ${className}`} 
//         disabled={loading}
//         {...props}
//     >
//         {loading ? 'Processing...' : children}
//     </button>
// );

// // --- The Converted Component ---
// export const ResetPassword = () => {
//     const { register, handleSubmit, reset, formState: { errors } } = useForm();
//     const dispatch = useDispatch();
//     const status = useSelector(selectResetPasswordStatus);
//     const error = useSelector(selectResetPasswordError);
//     const successMessage = useSelector(selectResetPasswordSuccessMessage);
//     const { userId, passwordResetToken } = useParams();
//     const navigate = useNavigate();
    
//     // Note: useTheme and useMediaQuery are removed, replaced by Tailwind's responsive classes.

//     useEffect(() => {
//         if (error) {
//             toast.error(error.message);
//         }
//         return () => {
//             dispatch(clearResetPasswordError());
//         }
//     }, [error]);

//     useEffect(() => {
//         if (status === 'fullfilled') {
//             toast.success(successMessage?.message);
//             navigate("/login");
//         }
//         return () => {
//             dispatch(clearResetPasswordSuccessMessage());
//         }
//     }, [status, navigate, successMessage?.message]);

//     useEffect(() => {
//         return () => {
//             dispatch(resetResetPasswordStatus());
//         }
//     }, []);

//     const handleResetPassword = async (data) => {
//         const cred = { ...data, userId: userId, token: passwordResetToken };
//         delete cred.confirmPassword;
//         dispatch(resetPasswordAsync(cred));
//         reset();
//     };

//     return (
//         // Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}
//         <div className="w-screen h-screen flex justify-center items-center bg-gray-50">

//             {/* Main Content Stack (no rowGap specified, but kept as flex container) */}
//             <div> 
                
//                 {/* Stack component={Paper} elevation={2} */}
//                 <div className="bg-white shadow-xl rounded-xl">
                    
//                     {/* Stack component={'form'} width={is500?"95vw":'30rem'} p={'1rem'} rowGap={'1rem'} */}
//                     <form 
//                         className="flex flex-col space-y-4 w-[95vw] p-4 sm:w-[30rem] sm:p-6" // 1rem = p-4, sm:w-[30rem]
//                         noValidate 
//                         onSubmit={handleSubmit(handleResetPassword)}
//                     >

//                         {/* Stack rowGap={'.3rem'} */}
//                         <div className="flex flex-col space-y-1">
                            
//                             {/* Typography variant='h4' fontWeight={600} */}
//                             <h2 className="text-2xl font-semibold text-gray-800">
//                                 Reset Password
//                             </h2>
                            
//                             {/* Typography color={'GrayText'} */}
//                             <p className="text-sm text-gray-500">
//                                 Please enter and confirm new password
//                             </p>
//                         </div>
                        
//                         {/* Password Fields Stack rowGap={'.5rem'} */}
//                         <div className="flex flex-col space-y-2">
                            
//                             {/* MotionConfig whileHover={{y:-2}} is applied to the individual motion.divs */}
//                             <MotionConfig whileHover={{ y: -2 }}>

//                                 {/* New Password Field */}
//                                 <motion.div>
//                                     {/* TextField type='password' fullWidth sx={{mt:1}} */}
//                                     <TextField 
//                                         type='password' 
//                                         className="mt-1"
//                                         {...register("password", {
//                                             required: "Please enter a password",
//                                             pattern: {
//                                                 value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
//                                                 message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`
//                                             }
//                                         })}
//                                         placeholder='New Password'
//                                         error={errors.password}
//                                     />
//                                     {/* FormHelperText sx={{mt:1}} error */}
//                                     {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
//                                 </motion.div>
                                
//                                 {/* Confirm Password Field */}
//                                 <motion.div>
//                                     {/* TextField type='password' fullWidth sx={{mt:1}} */}
//                                     <TextField 
//                                         type='password' 
//                                         className="mt-1"
//                                         {...register("confirmPassword", {
//                                             required: "Please Confirm the password",
//                                             validate: (value, formValues) => value === formValues.password || "Passwords dosen't match"
//                                         })}
//                                         placeholder='Confirm New Password'
//                                         error={errors.confirmPassword}
//                                     />
//                                     {/* FormHelperText sx={{mt:1}} error */}
//                                     {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
//                                 </motion.div>
                                
//                             </MotionConfig>
//                         </div>

//                         {/* Submit Button - motion.div whileHover={{scale:1.020}} whileTap={{scale:1}} */}
//                         <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
//                             {/* LoadingButton sx={{height:"2.5rem"}} fullWidth loading={status==='pending'} type='submit' variant='contained' */}
//                             <LoadingButton 
//                                 loading={status === 'pending'} 
//                                 type='submit' 
//                                 className="h-10 text-base"
//                             >
//                                 Reset Password
//                             </LoadingButton>
//                         </motion.div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };