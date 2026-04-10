import { askAIModel } from "../config/ai.js";
import doctorModel from "../models/doctor.model.js";

// 🧠 symptom → doctor mapping
const getDoctorType = (message) => {
  message = message.toLowerCase();

  // 🦴 Bone / muscle issues
  if (
    message.includes("leg") ||
    message.includes("bone") ||
    message.includes("joint") ||
    message.includes("knee") ||
    message.includes("pain in leg")
  ) {
    return "Orthopedic";
  }

  // ❤️ Heart
  if (message.includes("chest") || message.includes("heart")) {
    return "Cardiologist";
  }

  // 👁 Eye
  if (message.includes("eye") || message.includes("vision")) {
    return "Ophthalmologist";
  }

  // 🧴 Skin
  if (message.includes("skin") || message.includes("acne") || message.includes("rash")) {
    return "Dermatologist";
  }

  // 🤒 General illness
  if (
    message.includes("fever") ||
    message.includes("cold") ||
    message.includes("cough")
  ) {
    return "General Physician";
  }

  return "General Physician";
};

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    // AI response
    const aiReply = await askAIModel(message);

    // doctor suggestion
    const doctorType = getDoctorType(message);

    const doctors = await doctorModel.find({
      speciality: doctorType,
      available: true,
    });

    res.json({
      success: true,
      reply: aiReply,
      doctorType,
      doctors,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};