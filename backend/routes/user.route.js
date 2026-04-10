import express from "express";

import { registerUser ,loginUser , getProfile ,updateProfile, bookAppointement, listAppoint, cancelAppointment, paymentRazorpay, verifyRazorpay } from "../controllers/user.controller.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";


const userRouter =express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single("image"),authUser,updateProfile)  // 1->passing form data  2 -> auhtenticate the user and get the user id 
userRouter.post("/book-appointment",authUser,bookAppointement)
userRouter.get("/appointments" ,authUser ,listAppoint)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)
userRouter.post("/payment-razorpay",authUser,paymentRazorpay)
userRouter.post("/verify-razorpay",authUser,verifyRazorpay)



export  default userRouter