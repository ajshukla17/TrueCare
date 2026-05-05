import express from "express";
import { uploadReport, getMyReports, deleteReport } from "../controllers/report.controller.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const reportRouter = express.Router();

// Upload a new report (multipart/form-data with file)
reportRouter.post("/upload", upload.single("reportFile"), authUser, uploadReport);

// Get all reports for the logged-in patient
reportRouter.get("/my-reports", authUser, getMyReports);

// Delete a report
reportRouter.post("/delete", authUser, deleteReport);

export default reportRouter;