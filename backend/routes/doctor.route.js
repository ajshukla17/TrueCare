import express from "express";

import { doctorList, loginDr , appointmentsDoctor,doctorProfile,updateDoctorProfile , doctorDashboard ,completeAppointment } from "../controllers/doctor.controller.js";
import authDoctor from "../middleware/authDoctor.js";


const doctorRoute =express.Router()

doctorRoute.get("/list",doctorList)
doctorRoute.post("/login",loginDr)
doctorRoute.get("/appointments",authDoctor,appointmentsDoctor)
doctorRoute.get('/profile', authDoctor, doctorProfile);
doctorRoute.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRoute.get("/dashboard", authDoctor, doctorDashboard);
doctorRoute.post("/complete-appointment", authDoctor, completeAppointment);

export default doctorRoute