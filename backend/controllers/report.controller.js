import reportModel from "../models/report.model.js";
import { v2 as cloudinary } from "cloudinary";

// Upload a new report
const uploadReport = async (req, res) => {
  try {
    const userId = req.userId; // set by authUser middleware
    const { title, reportType, description, doctorName, reportDate } = req.body;

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }
    if (!title || !reportType) {
      return res.json({ success: false, message: "Title and report type are required" });
    }

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",  // handles images and PDFs
      folder: "trucare_reports",
    });

    const newReport = new reportModel({
      patientId: userId,
      title,
      reportType,
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
      fileType: uploadResult.resource_type,
      description: description || "",
      doctorName: doctorName || "",
      reportDate: reportDate || "",
    });

    await newReport.save();

    res.json({ success: true, message: "Report uploaded successfully", report: newReport });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reports for logged-in patient
const getMyReports = async (req, res) => {
  try {
    const userId = req.userId;
    const reports = await reportModel.find({ patientId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportId } = req.body;

    const report = await reportModel.findOne({ _id: reportId, patientId: userId });
    if (!report) {
      return res.json({ success: false, message: "Report not found or unauthorized" });
    }

    // Delete from Cloudinary
    if (report.filePublicId) {
      await cloudinary.uploader.destroy(report.filePublicId, {
        resource_type: report.fileType === "image" ? "image" : "raw",
      });
    }

    await reportModel.findByIdAndDelete(reportId);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { uploadReport, getMyReports, deleteReport };