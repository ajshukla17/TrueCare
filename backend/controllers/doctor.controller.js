import doctorModel from '../models/doctor.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointment.model.js'

// 🔹 Change Availability Toggle
const changeAvailibity = async(req,res)=>{
    try {
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)

        await doctorModel.findByIdAndUpdate(docId,{
            available : !docData.available
        })

        res.json({success:true,message: "Availibilty Changed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"went wrong -> changeAvailibity"})
    }
}


// 🔹 Get Doctor List
const doctorList = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        .select(['-password' ,"-email"])

        res.json({success:true,doctors})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"went wrong -> doctorlist"})
    }
}


// 🔥 NEW API → SET DOCTOR TIMING
const setAvailability = async (req, res) => {
    try {
        const { doctorId, timing } = req.body;

        const doctor = await doctorModel.findById(doctorId);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Ensure availability array exists
        if (!doctor.availability) {
            doctor.availability = [];
        }

        // Find existing day
        let dayIndex = doctor.availability.findIndex(
            (d) => d.day === timing.day
        );

        if (dayIndex === -1) {
            // ✅ Add new day with CLEAN session structure
            doctor.availability.push({
                day: timing.day,
                sessions: [{
                    start: timing.start,
                    end: timing.end,
                    duration: timing.duration
                }]
            });
        } else {
            // ✅ Add session ONLY (no extra day field inside session)
            doctor.availability[dayIndex].sessions.push({
                start: timing.start,
                end: timing.end,
                duration: timing.duration
            });
        }

        await doctor.save();

        res.json({ success: true, message: "Timing added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// 🔹 Doctor Login
const loginDr = async(req,res)=>{
    try {

        const {email,password} = req.body

        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false , message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true ,token})
        } else {
            return res.json({success:false , message:"Invalid Credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"login error"})
    }
}

//api to get doctor appointments for doctor panel
const appointmentsDoctor =async(req,res) => {
    try{
        const docId =req.docId;
        const appointments =await appointmentModel.find({docId}) 
        res.json({success:true ,appointments})

    }
    catch (error){
          console.log(error);
        res.json({success:false,message:"login error"})

    }
}
const doctorProfile = async (req, res) => {
    try {

        const docId = req.docId;

        const doctor = await doctorModel.findById(docId).select('-password');

        res.json({
            success: true,
            doctor
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
};

const updateDoctorProfile = async (req, res) => {
    try {

        const docId = req.docId;

        const {
            name,
            email,
            phone,
            address,
            fees,
            experience,
            about,
            timing,
            password
        } = req.body;

        let updateData = {
            name,
            email,
            phone,
            address,
            fees,
            experience,
            about,
            timing
        };

        // ✅ If password is provided → hash it
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        await doctorModel.findByIdAndUpdate(docId, updateData);

        res.json({
            success: true,
            message: "Profile Updated Successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Update failed" });
    }
};

const doctorDashboard = async (req, res) => {
    try {

        const docId = req.docId;

        // ✅ Get appointments
        const appointments = await appointmentModel.find({ docId });

        // ✅ Earnings (only paid)
        let earnings = 0;
        appointments.forEach(item => {
            if (item.payment) {
                earnings += item.amount;
            }
        });

        // ✅ Unique patients
        const uniquePatients = new Set();
        appointments.forEach(item => {
            uniquePatients.add(item.userId);
        });

        // ✅ Doctor profile
        const doctor = await doctorModel.findById(docId).select("-password");

        res.json({
            success: true,
            dashboard: {
                earnings,
                totalAppointments: appointments.length,
                totalPatients: uniquePatients.size,
                recentAppointments: appointments.slice(-5).reverse(),
                doctor
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Dashboard error" });
    }
};
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment completed" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export 
{
    changeAvailibity,
    doctorList,
    loginDr,
    setAvailability   ,
    appointmentsDoctor,
    doctorProfile,
    updateDoctorProfile,
    doctorDashboard,
    completeAppointment
}