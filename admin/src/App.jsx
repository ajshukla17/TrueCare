import { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { Route, Routes } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AllAppointment from "./pages/admin/AllApointment";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorsList from "./pages/admin/DoctorsList";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointment from "./pages/doctor/DoctorAppointment";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import PrescriptionPage from "./pages/doctor/PrescriptionPage";

function App() {

  const { atoken } = useContext(AdminContext);
  const { dtoken } = useContext(DoctorContext);

  return (
    <div className="bg-[#F8F9FD] min-h-screen">

      <ToastContainer />

      {/* ADMIN PANEL */}
      {atoken && (
        <>
          <Navbar />
          <div className="flex">
            <Sidebar type="admin" />

            <Routes>
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllAppointment />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<DoctorsList />} />
            </Routes>
          </div>
        </>
      )}

      {/* DOCTOR PANEL */}
      {dtoken && !atoken && (
        <>
          <Navbar />
          <div className="flex">
            <Sidebar type="doctor" />

            <Routes>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointment />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path="/doctor/prescription/:appointmentId" element={<PrescriptionPage />} />
            </Routes>
          </div>
        </>
      )}

      {/* LOGIN */}
      {!atoken && !dtoken && (
        <Login />
      )}

    </div>
  );
}

export default App;