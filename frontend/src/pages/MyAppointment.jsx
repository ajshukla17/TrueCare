import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyAppointment() {
  const { backendurl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendurl + "/api/user/appointments",
        { headers: { token } }
      );
      console.log("API RESPONSE:", data);
      if (data.success) {
        setAppointments(data.appointments.reverse());

      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID?.replace(/"/g, "");
        const rzp = new window.Razorpay({
          key: keyId,
          amount: data.order.amount,
          currency: data.order.currency,
          order_id: data.order.id,
          handler: async (response) => {
            await axios.post(
              backendurl + "/api/user/verify-razorpay",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointmentId   // 🔥 IMPORTANT
              },
              { headers: { token } }
            );

            getUserAppointment();
          },
        });

        rzp.open();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) getUserAppointment();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-20">

      {/* 🔷 Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My <span className="text-blue-600">Appointments</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your bookings, payments, and prescriptions
        </p>
      </div>

      {/* 🔷 Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No appointments booked yet
        </div>
      )}

      {/* 🔷 Appointment Cards */}
      <div className="space-y-6">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-6"
          >

            {/* Doctor Image */}
            <img
              src={item.docId.image}
              alt=""
              className="w-24 h-24 rounded-xl object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.docId.name}
              </h3>

              <p className="text-sm text-gray-500">
                {item.docId.speciality}
              </p>

              <p className="text-sm mt-2 text-gray-600">
                📍 {item.docId.address?.line1}, {item.docId.address?.line2}
              </p>

              <p className="text-sm mt-2 font-medium text-gray-700">
                🗓 {slotDateFormat(item.slotDate)} | ⏰ {item.slotTime}
              </p>
            </div>

            {/* Status + Actions */}
            <div className="flex flex-col gap-2 justify-center">

              {/* Paid */}
              {!item.cancelled && item.payment && (
                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm text-center">
                  ✔ Paid
                </span>
              )}

              {/* Pay */}
              {!item.cancelled && !item.payment && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="px-4 py-2 rounded-lg border hover:bg-blue-600 hover:text-white text-sm transition"
                >
                  Pay Now
                </button>
              )}

              {/* Cancel */}
              {!item.cancelled && !item.payment && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="px-4 py-2 rounded-lg border hover:bg-red-600 hover:text-white text-sm transition"
                >
                  Cancel
                </button>
              )}

              {/* Cancelled */}
              {item.cancelled && (
                <span className="text-red-500 border border-red-400 px-4 py-2 rounded-lg text-sm text-center">
                  Cancelled
                </span>
              )}

              {/* Prescription */}
              {item.prescriptionId ? (
                <button
                  onClick={() =>
                    window.open(
                      backendurl +
                      `/api/prescription/download/${item.prescriptionId._id}`
                    )
                  }
                  className="px-4 py-2 rounded-lg border text-blue-600 hover:bg-blue-600 hover:text-white text-sm transition"
                >
                  Download Rx
                </button>
              ) : item.isCompleted && !item.cancelled ? (
                <p className="text-orange-500 text-xs text-center">
                  ⏳ Prescription Pending
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointment;