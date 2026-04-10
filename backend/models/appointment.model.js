import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },

    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: {
        type: Number,
        required: true
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Boolean,
        default: false

    },
    isCompleted: {
        type: Boolean,
        default: false

    },
    prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "prescription",
        default: null
    },
    isEmergency: {
        type: Boolean,
        default: false
    },

    priorityLevel: {
        type: String,
        enum: ["normal", "emergency"],
        default: "normal"
    },

    emergencyFee: {
        type: Number,
        default: 0
    }

})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel