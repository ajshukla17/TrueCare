import dotenv from 'dotenv'
dotenv.config()

import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctor.model.js'
import appointmentModel from '../models/appointment.model.js'
import razorpay from 'razorpay'
import { sendAppointmentEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

//api to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body




        if (!email || !name || !password) {
            return res.json({ success: false, message: "missing details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })

        }
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong Password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData)

        const user = await newUser.save()

        //_id -> token

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })




    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

//api for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "user dose not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        res.json({ success: false, message: "coming from loginUser fnc" })
    }
}
//api to get user Profile data

const getProfile = async (req, res) => {
    try {

        const userId = req.user?.id || req.body?.userId;
        if (!userId) return res.status(400).json({ success: false, message: 'User id not available' });

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

        return res.json({ success: true, userData });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//API to update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

       
        if (!name || !phone || !address || !dob) {
            return res.json({ success: false, message: "missing details" })
        }

        // ✅ Parse address safely
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (e) {
            return res.json({ success: false, message: "Invalid address format" });
        }

        // ✅ Single update call with all fields including image
        const updateData = {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender: gender || ""
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            updateData.image = imageUpload.secure_url
        }

        // ✅ { new: true } returns updated doc, { runValidators: false } skips enum check
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: false }
        )

       

        res.json({ success: true, message: "Profile updated successfully" })

    } catch (error) {
       
        res.json({ success: false, message: error.message })
    }
}






//  API to book the appointment -logic

//  API to book the appointment -logic

const bookAppointement = async (req, res) => {
    try {

        const userId = req.user?.id;
        let { docId, slotDate, slotTime, isEmergency } = req.body;

        if (!docId) {
            return res.json({ success: false, message: "Doctor ID missing" });
        }

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        // ⚡ EMERGENCY LOGIC
        if (isEmergency) {
            const date = new Date();

            slotDate = slotDate || `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
            slotTime = slotTime || "ASAP";
        }

        // ❗ NORMAL BOOKING VALIDATION
        if (!isEmergency && (!slotDate || !slotTime)) {
            return res.json({ success: false, message: "Slot required for normal booking" });
        }

        let slot_booked = docData.slot_booked || {};

        // ❗ ONLY NORMAL BOOKING CHECK
        if (!isEmergency) {
            if (slot_booked[slotDate]) {

                if (slot_booked[slotDate].includes(slotTime)) {
                    return res.json({ success: false, message: "Slot already booked" });
                }

                slot_booked[slotDate].push(slotTime);

            } else {
                slot_booked[slotDate] = [slotTime];
            }
        }

        const userData = await userModel.findById(userId).select("-password");

        const docDataObj = docData.toObject();
        delete docDataObj.slot_booked;

        const finalAmount = isEmergency
            ? (docData.emergencyFee || docData.fees * 2)
            : docData.fees;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataObj,
            amount: finalAmount,
            slotTime,
            slotDate,
            isEmergency: isEmergency || false,
            date: Date.now()
        };

        await new appointmentModel(appointmentData).save();

        if (!isEmergency) {
            await doctorModel.findByIdAndUpdate(docId, { slot_booked });
        }

        res.json({
            success: true,
            message: isEmergency
                ? "⚡ Emergency Appointment Booked"
                : "Appointment Booked Successfully"
        });

    } catch (error) {
       
        res.json({ success: false, message: error.message });
    }
};

//api to get user appointment for frontend my-appointment page
const listAppoint = async (req, res) => {
    try {
        const userId = req.user.id;

        const appointments = await appointmentModel
            .find({ userId })
            .populate("docId") // 🔥 THIS fetches doctor info
            .populate("prescriptionId");

        res.json({ success: true, appointments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//Api for cancel the appointments
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        //varify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "unautherized action" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
    
        res.json({ success: false, message: error.message });

    }
}


// 🔐 Razorpay instance
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// ===============================
// 💳 CREATE PAYMENT ORDER
// ===============================
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment cancelled or not found",
            });
        }

        // ✅ amount is already correct (emergency fee handled at booking time)
        const finalAmount = appointmentData.amount;

        const options = {
            amount: finalAmount * 100, // convert to paise
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        const order = await razorpayInstance.orders.create(options);

        return res.json({
            success: true,
            order,
            payableAmount: finalAmount,
            isEmergency: appointmentData.isEmergency,
        });

    } catch (error) {
    
        return res.json({
            success: false,
            message: error.message,
        });
    }
};


// ===============================
// ✅ VERIFY PAYMENT + SEND EMAIL
// ===============================



const verifyRazorpay = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentId,
        } = req.body;

        console.log("verify api called");

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (
            expectedSignature !== razorpay_signature
        ) {
            return res.json({
                success: false,
                message: "Invalid Signature",
            });
        }

        const appointment =
            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                { payment: true },
                { new: true }
            );

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        const user = await userModel.findById(
            appointment.userId
        );

        const doctor =
            await doctorModel.findById(
                appointment.docId
            );

        if (!user || !doctor) {
            return res.json({
                success: false,
                message: "User/Doctor not found",
            });
        }

      

        // email separately handled
        try {
            await sendAppointmentEmail(
                user.email,
                {
                    doctorName: doctor.name,
                    date: appointment.slotDate,
                    time: appointment.slotTime,
                    fees: appointment.amount,
                }
            );

            console.log("Email sent");
        } catch (mailError) {
            console.log(
                "MAIL ERROR:",
                mailError.message
            );
        }

        return res.json({
            success: true,
            message: "Payment Successful",
        });
    } catch (error) {
        console.log(
            "VERIFY ERROR:",
            error.message
        );

        return res.json({
            success: false,
            message: error.message,
        });
    }
};







export { registerUser, loginUser, getProfile, updateProfile, bookAppointement, listAppoint, cancelAppointment, paymentRazorpay, verifyRazorpay }