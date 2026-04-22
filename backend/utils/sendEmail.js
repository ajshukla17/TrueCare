import { transporter } from "../config/email.js";

export const sendAppointmentEmail = async (userEmail, data) => {
  try {
    const mailOptions = {

      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Appointment Confirmation 🏥",
      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f8; padding:20px;">
  
  <div style="max-width:500px; margin:auto; background:white; border-radius:12px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    
    <h2 style="color:#2563eb; margin-bottom:10px;">
      🏥 Appointment Confirmed
    </h2>

    <p style="color:#555; font-size:14px; margin-bottom:20px;">
      Your appointment has been successfully booked. Here are your booking details:
    </p>

    <div style="background:#f1f5f9; padding:15px; border-radius:10px;">

      <p style="margin:8px 0; font-size:15px;">
        <strong>👨‍⚕️ Doctor:</strong> ${data.doctorName}
      </p>

      <p style="margin:8px 0; font-size:15px;">
        <strong>📅 Date:</strong> ${data.date}
      </p>

      <p style="margin:8px 0; font-size:15px;">
        <strong>⏰ Time:</strong> ${data.time}
      </p>

      <p style="margin:8px 0; font-size:15px;">
        <strong>💰 Fees:</strong> ₹${data.fees}
      </p>
      <p style="margin-top:20px; font-size:14px; color:#444;">
      Please arrive 10 minutes before your scheduled time.
    </p>
    </div>
    <p style="margin-top:20px; font-size:14px; color:#2563eb; font-weight:500;">
      Thank you for booking with us 💙
    </p>
  </div>
</div>
`,
    };

    await transporter.sendMail(mailOptions);
  
  }
  catch (error){
    console.log("❌ Email send error:", error.message);
  }
};