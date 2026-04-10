import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) =>{
    
    const [atoken ,setAtoken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'):"")
    const [doctors ,setDoctors] = useState([])
    const [appointments , setAppointments]=useState([])
    const [dashData ,setDashData] =useState(false)


    const backendurl = import.meta.env.VITE_BACKEND_URL
    console.log(backendurl);

    const getAllDoctors = async () =>{
        try {
            const {data} = await axios.post(backendurl + "/api/admin/all-doctors" , {} ,{headers:{atoken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors);
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }

    }

    const changeAvailability  =async (docId) =>{
        try {
            const {data} =await axios.post( backendurl + '/api/admin/change-availability' ,{docId} ,{headers:{atoken}})
            console.log(data);
            if(data.success){
         
                toast.success("available updated")
                console.log(data.doctors);
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    const getAllAppointments =async()=>{
        try {
            const {data} = await axios.get(backendurl+'/api/admin/appointments' ,{headers:{atoken}})
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments);
            }else{
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(data.message)
        }
    }
    const cancelAppointments =async (appointmentId) => {
        try {
            const {data} = await axios.post(backendurl + "/api/admin/cancel-appointments",{appointmentId} , {headers:{atoken}})

            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(data.message)
        }
    }
    const getDashboard =async () =>{
        try {
            const {data} =await axios.get(backendurl + "/api/admin/dashboard" ,{headers:{atoken}})

            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData);

            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const value = {
        atoken , setAtoken,
        backendurl,doctors,
        getAllDoctors , changeAvailability , appointments,setAppointments,getAllAppointments,cancelAppointments,dashData ,getDashboard
    
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </ AdminContext.Provider>
    )
}

export default AdminContextProvider;