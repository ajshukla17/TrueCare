import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [dtoken, setDtoken] = useState(localStorage.getItem('dtoken') ? localStorage.getItem('dtoken') : "")
    const [appointments, setAppointments] = useState([])
    const [profile, setProfile] = useState(null);
    const [dashboard, setDashboard] = useState(null);

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendurl + '/api/doctor/appointments', { headers: { dtoken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
          
            } else {
                toast.error(data.message)
            }

        }
        catch (error) {
         
            toast.error(error.message)

        }
    }
    const getProfile = async () => {
        try {
            const { data } = await axios.get(
                backendurl + "/api/doctor/profile",
                { headers: { dtoken } }
            );

            if (data.success) {
                setProfile(data.doctor);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const { data } = await axios.post(
                backendurl + "/api/doctor/update-profile",
                updatedData,
                { headers: { dtoken } }
            );

            if (data.success) {
                toast.success("Profile Updated");
                getProfile(); // refresh
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };
    const getDashboard = async () => {
        try {
            const { data } = await axios.get(
                backendurl + "/api/doctor/dashboard",
                { headers: { dtoken } }
            );

            if (data.success) {
                setDashboard(data.dashboard);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        dtoken, setDtoken, appointments, backendurl, getAppointments, setAppointments, profile, getProfile, updateProfile ,dashboard, getDashboard

    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </ DoctorContext.Provider>
    )
}

export default DoctorContextProvider;