import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {

    const {backendurl ,setToken ,token} = useContext(AppContext)
    const navigate = useNavigate()
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        try {
            if(state === 'Sign Up'){
                const {data} = await axios.post(backendurl + '/api/user/register', {name ,email ,password })
                if(data.success){
                    
                    localStorage.setItem('token',data.token)
                    setToken(data.token)
                    navigate('/my-profile')
                }
                else{
                    toast.error(data.message)
                }
            }else{
                const {data} = await axios.post(backendurl + '/api/user/login', {email ,password })
                if(data.success){
                    localStorage.setItem('token',data.token)
                    setToken(data.token)
                    navigate('/');
                }
                else{
                    toast.error(data.message)
                }


            }

            
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    // useEffect(()=>{
    //     if(token){
    //         navigate('/')
    //     }
    // },[token])

    return (
        <div className="min-h-screen  flex items-center justify-center p-2">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">{state}</h2>
                    <p className="text-gray-500 mt-2">
                        {state === 'Sign Up' ? 'Create your account to get started' : 'Welcome back! Please login to your account'}
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    {state === 'Sign Up' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {state === 'Login' && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={onSubmitHandler}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
                    >
                        {state === 'Sign Up' ? 'Create Account' : 'Login'}
                    </button>
                </div>

                {/* Toggle between Login and Sign Up */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                            className="ml-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            {state === 'Sign Up' ? 'Login here' : 'Sign up here'}
                        </button>
                    </p>
                </div>

                
            </div>
        </div>
    );
}

export default Login;