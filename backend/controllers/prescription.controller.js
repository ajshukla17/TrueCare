import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";

// CREATE
export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const prescription = await Prescription.create({
      appointmentId,
      doctorId: appointment.docId,
      patientId: appointment.userId,
      medicines,
      notes,
    });
    

    res.json({
      success: true,
      message: "Prescription created",
      prescription,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// GET USER PRESCRIPTIONS
export const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED

    const prescriptions = await Prescription.find({
      patientId: userId,
    }).populate("doctorId", "name speciality");
   
    res.json({ success: true, prescriptions });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
