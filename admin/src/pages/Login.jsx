import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
    const [state, setState] = useState('Admin');
    const { setAtoken, backendurl } = useContext(AdminContext);
    const { setDtoken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendurl + "/api/admin/login", { email, password });

                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAtoken(data.token);
                    navigate("/admin-dashboard");
                } else {
                    toast.error(data.message);
                }

            } else {
                const { data } = await axios.post(backendurl + "/api/doctor/login", { email, password });

                if (data.success) {
                    localStorage.setItem('dtoken', data.token);
                    setDtoken(data.token);
                    navigate("/doctor-dashboard"); // ✅ FIXED
                } else {
                    toast.error(data.message);
                }
            }
        } catch (err) {
      
            toast.error("Something went wrong");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-4">
            <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-[400px] bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200">

                <div className="w-16 h-16 bg-[#5F6FFF] rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>

                <p className="text-3xl font-bold text-[#1F2937]">{state} Login</p>

                <input onChange={(e) => setEmail(e.target.value)} className="border p-3 w-full rounded-xl" type="email" placeholder="Email" required />
                <input onChange={(e) => setPassword(e.target.value)} className="border p-3 w-full rounded-xl" type="password" placeholder="Password" required />

                <button className="bg-[#5F6FFF] text-white w-full py-3 rounded-xl font-bold">
                    Login
                </button>

                <p>
                    {state === "Admin" ? (
                        <>Doctor Login? <span onClick={() => setState('Doctor')} className="text-blue-500 cursor-pointer">Click Here</span></>
                    ) : (
                        <>Admin Login? <span onClick={() => setState('Admin')} className="text-blue-500 cursor-pointer">Click Here</span></>
                    )}
                </p>
            </div>
        </form>
    );
}

export default Login;