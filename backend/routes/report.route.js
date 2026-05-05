import express from "express";
import { uploadReport, getMyReports, deleteReport } from "../controllers/report.controller.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const reportRouter = express.Router();


reportRouter.post("/upload", authUser, upload.single("reportFile"), uploadReport);

reportRouter.get("/my-reports", authUser, getMyReports);

// Delete report
reportRouter.post("/delete", authUser, deleteReport);

export default reportRouter;