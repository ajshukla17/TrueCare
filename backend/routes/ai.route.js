import express from "express";
import { askAI } from "../controllers/askAi.controller.js";

const router = express.Router();

router.post("/ask-ai", askAI);

export default router;