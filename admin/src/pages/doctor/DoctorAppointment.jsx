import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";

function DoctorAppointment() {
   const { dtoken, appointments, getAppointments } = useContext(DoctorContext);

   const [showModal, setShowModal] = useState(false);
   const [selectedAppointment, setSelectedAppointment] = useState(null);
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      symptoms: "",
      medicines: "",
      notes: "",
   });

   useEffect(() => {
      if (dtoken) {
         getAppointments();
      }
   }, [dtoken]);

   // ✅ SORT EMERGENCY FIRST
   const sortedAppointments = [...appointments].sort(
      (a, b) => b.isEmergency - a.isEmergency
   );

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = () => {
      console.log("Prescription Data:", {
         appointmentId: selectedAppointment._id,
         ...formData,
      });

      setShowModal(false);
      setFormData({ symptoms: "", medicines: "", notes: "" });
   };

   return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">

         <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Appointments
         </h1>

         <div className="grid gap-6">

            {sortedAppointments.length > 0 ? sortedAppointments.map((item, index) => (

               <div
                  key={index}
                  className={`relative bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                     item.isEmergency ? "border-2 border-red-400" : ""
                  }`}
               >

                  {/* ⚡ EMERGENCY BADGE */}
                  {item.isEmergency && (
                     <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full shadow">
                        ⚡ Emergency
                     </span>
                  )}

                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                     <img
                        src={item.userData.image}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                     />
                     <div>
                        <p className="font-semibold text-lg text-gray-800">
                           {item.userData.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                           {item.userData.email}
                        </p>
                     </div>
                  </div>

                  {/* MIDDLE */}
                  <div className="text-sm text-gray-600 space-y-1">
                     <p><b>Date:</b> {item.slotDate}</p>
                     <p><b>Time:</b> {item.slotTime}</p>

                     {/* ⚡ ASAP MESSAGE */}
                     {item.slotTime === "ASAP" && (
                        <p className="text-xs text-red-500">
                           ⚡ Immediate attention required
                        </p>
                     )}

                     <p><b>Fees:</b> ₹{item.amount}</p>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col gap-2">

                     <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                        item.cancelled
                           ? "bg-red-100 text-red-600"
                           : item.isCompleted
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                     }`}>
                        {item.cancelled
                           ? "Cancelled"
                           : item.isCompleted
                              ? "Completed"
                              : "Pending"}
                     </span>

                     <span className={`text-xs font-medium ${
                        item.payment ? "text-green-600" : "text-red-500"
                     }`}>
                        {item.payment ? "Paid" : "Unpaid"}
                     </span>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 flex-wrap">

                     <button
                        onClick={() => navigate(`/doctor/prescription/${item._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                     >
                        Add Prescription
                     </button>

                     {!item.isCompleted && !item.cancelled && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                           Mark Complete
                        </button>
                     )}

                  </div>

               </div>

            )) : (
               <p className="text-gray-500 text-center">
                  No Appointments Found
               </p>
            )}

         </div>

         {/* MODAL */}
         {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

               <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">

                  <h2 className="text-xl font-bold mb-4">
                     Write Prescription
                  </h2>

                  <div className="space-y-4">

                     <textarea
                        name="symptoms"
                        placeholder="Symptoms..."
                        value={formData.symptoms}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                     />

                     <textarea
                        name="medicines"
                        placeholder="Medicines..."
                        value={formData.medicines}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                     />

                     <textarea
                        name="notes"
                        placeholder="Additional Notes..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                     />

                  </div>

                  <div className="flex justify-end gap-3 mt-5">

                     <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                     >
                        Cancel
                     </button>

                     <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                     >
                        Save Prescription
                     </button>

                  </div>

               </div>

            </div>
         )}

      </div>
   );
}

export default DoctorAppointment;