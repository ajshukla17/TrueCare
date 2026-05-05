


import express from "express"
import cors from "cors"

import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/admin.route.js"
import doctorRoute from "./routes/doctor.route.js";
import userRouter from "./routes/user.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import Route from "./routes/ai.route.js";


//app config
const app =express()
const Port = process.env.PORT || 3000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors({
  origin: "*",
  credentials: true
}));

//api endpoint
app.use('/api/admin',adminRouter)
app.use("/api/doctor",doctorRoute)
app.use("/api/user",userRouter)
app.use("/api/ai", Route);
app.use("/api/prescription", prescriptionRouter);

app.get('/',(req,res)=>{
    res.send("hello")
})



app.listen(Port  ,()=>{
    console.log("port connected",Port);
})