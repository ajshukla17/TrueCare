import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currenySym = "₹"
    const backendurl = import.meta.env.VITE_BACKEND_URL
    
    const [doctors, setDoctors] = useState([])
    const [token ,setToken] =useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)

    // 🔥 NEW STATE (ADD THIS)
    const [prescriptions, setPrescriptions] = useState([])

    // 🔥 FETCH PRESCRIPTIONS (ADD THIS)
    const getPrescriptions = async () => {
        try {
            const { data } = await axios.post(
                backendurl + '/api/prescription/user',
                {},
                { headers: { token } }
            )

            if (data.success) {
                setPrescriptions(data.prescriptions)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDrData = async () => {
        try {
            const { data } = await axios.get(backendurl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error, "getDRdata se error hai");
            toast.error(error.message)
        }
    }

    const loadUserProfile = async()=>{
        try{
            const {data} = await axios.get(
                backendurl + '/api/user/get-profile',
                {headers:{token}}
            )

            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }

        } catch(error){   
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        doctors, getDrData, currenySym,
        token, setToken,
        backendurl,
        userData, setUserData,
        loadUserProfile,
        prescriptions,
        getPrescriptions
    }

    useEffect(() => {
        getDrData()
    }, [])

    useEffect(()=>{
        if(token){
            loadUserProfile()
        }else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </ AppContext.Provider>
    )
}

export default AppContextProvider;