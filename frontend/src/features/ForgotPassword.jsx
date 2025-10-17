import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPasswordApi } from './auth/AuthApi'; // Assuming AuthApi.js is one level up

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

const themePrimaryDark = 'text-blue-700';

// --- The Refactored Component ---
export const ForgotPassword = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    // Local State Management (Replacing Redux)
    const [status, setStatus] = useState('idle'); // 'idle', 'pending', 'fullfilled', 'rejected'
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Error Toast Effect
    useEffect(() => {
        if (error) {
            toast.error(error?.message);
            // Clear error after showing toast, similar to Redux clearing action
            setError(null); 
        }
    }, [error]);

    // Success Toast Effect
    useEffect(() => {
        if (status === 'fullfilled' && successMessage) {
            toast.success(successMessage?.message);
            // Clear success message after showing toast
            setSuccessMessage(null);
        }
    }, [status, successMessage]);
    
    // Clear status on unmount
    useEffect(() => {
        return () => {
            setStatus('idle');
        }
    }, []);

    const handleForgotPassword = async (data) => {
        setStatus('pending');
        setError(null);
        setSuccessMessage(null);
        
        try {
            const result = await forgotPasswordApi(data);
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
            
            <div className="flex flex-col space-y-4">
                
                <div className="bg-white shadow-lg rounded-xl">
                    
                    <form 
                        className="flex flex-col space-y-4 w-[95vw] p-4 sm:w-[30rem] sm:p-6" 
                        noValidate 
                        onSubmit={handleSubmit(handleForgotPassword)}
                    >
                        
                        <div className="flex flex-col space-y-1">
                            
                            <h2 className="text-xl font-semibold text-gray-800">
                                {status === 'fullfilled' ? "Email has been sent!" : "Forgot Your Password?"}
                            </h2>
                            
                            <p className="text-sm text-gray-500">
                                {status === 'fullfilled'
                                    ? "Please check your inbox and click on the received link to reset your password"
                                    : "Enter your registered email below to receive password reset link"}
                            </p>
                        </div>
                        
                        {status !== 'fullfilled' && (
                            <>
                                <motion.div whileHover={{ y: -2 }}>
                                    <TextField 
                                        type="email" // Added type for better mobile support
                                        className="mt-1" 
                                        {...register("email", {
                                            required: "Please enter an email", 
                                            pattern: {
                                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i, // Simplified regex
                                                message: "Enter a valid email"
                                            }
                                        })}
                                        placeholder='Enter email'
                                        error={errors.email}
                                    />
                                    {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
                                    <LoadingButton 
                                        loading={status === 'pending'} 
                                        type='submit' 
                                        className="h-10 text-base"
                                    >
                                        Send Password Reset Link
                                    </LoadingButton>
                                </motion.div>
                            </>
                        )}
                    </form>
                </div>
                
                <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }} className="mt-2 w-fit">
                    <Link 
                        to={'/login'} 
                        className="text-sm text-gray-700 w-fit no-underline block hover:text-gray-900 transition-colors"
                    >
                        Go back to <span className={`font-medium ${themePrimaryDark}`}>login</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};


// import React, { useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     clearForgotPasswordError, 
//     clearForgotPasswordSuccessMessage, 
//     forgotPasswordAsync,
//     resetForgotPasswordStatus,
//     selectForgotPasswordError, 
//     selectForgotPasswordStatus, 
//     selectForgotPasswordSuccessMessage 
// } from './auth/AuthSlice';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// // Custom Hook to approximate MUI's useMediaQuery(theme.breakpoints.down(500))
// // In a real project, you would use a utility hook or rely purely on Tailwind's default breakpoints (sm is 640px)
// // We will use a Tailwind approach: small screens (default) vs. medium screens (md: or lg:)
// // For the 500px check, we'll use a standard 'sm' breakpoint (640px) logic as the closest standard.
// // For simplicity in this functional component, we will define 'is500' based on a fixed JS check if necessary,
// // but the Tailwind classes will handle most of the responsiveness naturally.

// // --- Assuming Custom/HTML Components for the UI ---
// const TextField = ({ className, error, ...props }) => (
//     <input 
//         className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`} 
//         type="text" 
//         {...props} 
//     />
// );

// const FormHelperText = ({ children, error }) => (
//     <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
//         {children}
//     </p>
// );

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

// // We need to define the theme color used for the link manually in Tailwind
// const themePrimaryDark = 'text-blue-700'; // Example Tailwind color for primary.dark

// // --- The Converted Component ---
// export const ForgotPassword = () => {
//     const { register, handleSubmit, reset, formState: { errors } } = useForm();
//     const dispatch = useDispatch();
//     const status = useSelector(selectForgotPasswordStatus);
//     const error = useSelector(selectForgotPasswordError);
//     const successMessage = useSelector(selectForgotPasswordSuccessMessage);

//     // Instead of is500 check in JS, we use Tailwind's responsive classes (sm: equivalent)
//     // The width logic is handled directly in the className: 'w-[95vw] sm:w-[30rem] p-4 sm:p-6'

//     useEffect(() => {
//         if (error) {
//             toast.error(error?.message);
//         }
//         return () => {
//             dispatch(clearForgotPasswordError());
//         }
//     }, [error]);

//     useEffect(() => {
//         if (status === 'fullfilled') {
//             toast.success(successMessage?.message);
//         }
//         return () => {
//             dispatch(clearForgotPasswordSuccessMessage());
//         }
//     }, [status]);

//     useEffect(() => {
//         return () => {
//             dispatch(resetForgotPasswordStatus());
//         }
//     }, []);

//     const handleForgotPassword = async (data) => {
//         dispatch(forgotPasswordAsync(data));
//         reset();
//     };

//     return (
//         // Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}
//         <div className="w-screen h-screen flex justify-center items-center bg-gray-50"> 
            
//             {/* Stack rowGap={'1rem'} */}
//             <div className="flex flex-col space-y-4">
                
//                 {/* Stack component={Paper} elevation={2} */}
//                 <div className="bg-white shadow-lg rounded-xl">
                    
//                     {/* Stack component={'form'} width={is500?"95vw":'30rem'} p={is500?"1rem":'1.5rem'} rowGap={'1rem'} */}
//                     <form 
//                         className="flex flex-col space-y-4 w-[95vw] p-4 sm:w-[30rem] sm:p-6" // Tailwind for responsiveness
//                         noValidate 
//                         onSubmit={handleSubmit(handleForgotPassword)}
//                     >
                        
//                         {/* Stack rowGap={'.4rem'} */}
//                         <div className="flex flex-col space-y-1">
                            
//                             {/* Typography variant='h5' fontWeight={600} */}
//                             <h2 className="text-xl font-semibold text-gray-800">
//                                 {status === 'fullfilled' ? "Email has been sent!" : "Forgot Your Password?"}
//                             </h2>
                            
//                             {/* Typography color={'text.secondary'} variant='body2' */}
//                             <p className="text-sm text-gray-500">
//                                 {status === 'fullfilled'
//                                     ? "Please check your inbox and click on the received link to reset your password"
//                                     : "Enter your registered email below to receive password reset link"}
//                             </p>
//                         </div>
                        
//                         {status !== 'fullfilled' && (
//                             <>
//                                 {/* Email Field - motion.div whileHover={{y:-2}} */}
//                                 <motion.div whileHover={{ y: -2 }}>
//                                     {/* TextField fullWidth sx={{mt:1}} */}
//                                     <TextField 
//                                         // fullwidth 
//                                         className="mt-1" 
//                                         {...register("email", {
//                                             required: "Please enter a email", 
//                                             pattern: {
//                                                 value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
//                                                 message: "Enter a valid email"
//                                             }
//                                         })}
//                                         placeholder='Enter email'
//                                         error={errors.email}
//                                     />
//                                     {/* FormHelperText sx={{fontSize:".9rem",mt:1}} */}
//                                     {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
//                                 </motion.div>

//                                 {/* Submit Button - motion.div whileHover={{scale:1.020}} whileTap={{scale:1}} */}
//                                 <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
//                                     {/* LoadingButton sx={{height:'2.5rem'}} fullWidth loading={status==='pending'} type='submit' variant='contained' */}
//                                     <LoadingButton 
//                                         loading={status === 'pending'} 
//                                         type='submit' 
//                                         className="h-10 text-base"
//                                     >
//                                         Send Password Reset Link
//                                     </LoadingButton>
//                                 </motion.div>
//                             </>
//                         )}
//                     </form>
//                 </div>
                
//                 {/* back to login navigation */}
//                 {/* motion.div whileHover={{x:2}} whileTap={{scale:1.050}} mt={2} */}
//                 <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }} className="mt-2 w-fit">
//                     {/* Typography component={Link} sx={{textDecoration:"none",color:"text.primary",width:"fit-content"}} */}
//                     <Link 
//                         to={'/login'} 
//                         className="text-sm text-gray-700 w-fit no-underline block hover:text-gray-900 transition-colors"
//                     >
//                         Go back to <span className={`font-medium ${themePrimaryDark}`}>login</span>
//                     </Link>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };