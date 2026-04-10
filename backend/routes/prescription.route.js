import express from "express";
import {
  createPrescription,
  getUserPrescriptions
} from "../controllers/prescription.controller.js"; // ✅ add .js
import authUser from "../middleware/authUser.js";


const Prouter = express.Router();

Prouter.post("/create", createPrescription);
Prouter.post("/user", authUser, getUserPrescriptions);

export default Prouter;