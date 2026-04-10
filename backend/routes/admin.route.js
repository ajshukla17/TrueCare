import express from "express";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
} from "../controllers/admin.controller.js";

import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

// 🔥 UPDATE IMPORT (add setAvailability)
import { changeAvailibity, setAvailability } from "../controllers/doctor.controller.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailibity);

// 🔥 ADD THIS ROUTE
adminRouter.post("/set-availability", authAdmin, setAvailability);

adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointments", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;