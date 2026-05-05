import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  reportType: {
    type: String,
    required: true,
    enum: ["X-Ray", "MRI", "CT Scan", "Blood Test", "ECG", "Ultrasound", "Pathology", "Other"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  filePublicId: {
    type: String, // Cloudinary public_id for deletion
  },
  fileType: {
    type: String, // 'image' or 'pdf'
  },
  description: {
    type: String,
    default: "",
  },
  doctorName: {
    type: String,
    default: "",
  },
  reportDate: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);
export default reportModel;