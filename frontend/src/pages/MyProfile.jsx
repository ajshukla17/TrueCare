import { AppContext } from "../context/AppContext";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useState } from "react";
import { assets } from '../assets/assets/assets'
import axios from "axios";
import { toast } from "react-toastify";

function MyProfile() {
    
   const {userData, setUserData, token, backendurl, loadUserProfile} = useContext(AppContext)
    const [image, setImage] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    
    const updateUserProfile = async() => {
        try {
            const formData = new FormData()
            formData.append("name",userData.name)
            formData.append("phone",userData.phone)
            formData.append("address",JSON.stringify(userData.address))
            formData.append("gender",userData.gender)
            formData.append("dob",userData.dob)


            image && formData.append('image',image)

            const {data}= await axios.post(backendurl + '/api/user/update-profile',formData,{headers:{token}})
            if(data.success){
                toast.success(data.messsage)
                await loadUserProfile()
                setIsEdit(false)
                setImage(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log((error));
            toast.error(error.message)


            
        }

    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    }

    return userData && (
        <div className="min-h-screen py-12 px-4">
           
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                
                <div className="px-8 pb-8">
                    {/* Profile Image */}
                    <div className="relative -mt-16 mb-6">
                        <label htmlFor={isEdit ? "image-upload" : ""} className={isEdit ? "cursor-pointer" : ""}>
                            <img 
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                                src={image ? URL.createObjectURL(image) : userData.image} 
                                alt="Profile" 
                            />
                            
                        </label>
                        <input 
                            id="image-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Name Section */}
                    <div className="mb-8">
                        {
                            isEdit
                                ? <input 
                                    type="text" 
                                    className="text-3xl font-bold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all" 
                                    value={userData.name} 
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                />
                                : <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                        }
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="w-1 h-5 bg-blue-600 mr-3 rounded"></span>
                            Contact Information
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <p className="font-semibold text-gray-600 w-32 mb-1 sm:mb-0">Email:</p>
                                <p className="text-blue-600 font-medium">{userData.email}</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <p className="font-semibold text-gray-600 w-32 mb-1 sm:mb-0">Phone:</p>
                                {
                                    isEdit
                                        ? <input 
                                            className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all max-w-xs" 
                                            type="text" 
                                            value={userData.phone} 
                                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                        />
                                        : <p className="text-gray-700 font-medium">{userData.phone}</p>
                                }
                            </div>

                            <div className="flex flex-col sm:flex-row">
                                <p className="font-semibold text-gray-600 w-32 mb-1 sm:mb-0">Address:</p>
                                {
                                    isEdit
                                        ? <div className="space-y-2 flex-1">
                                            <input 
                                                className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-all" 
                                                type="text" 
                                                value={userData.address.line1 || ''} 
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                            />
                                            <input 
                                                className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-all" 
                                                type="text" 
                                                value={userData.address.line2 || ''} 
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                            />
                                        </div>
                                        : <p className="text-gray-700 leading-relaxed">
                                            {userData.address.line1}
                                            <br />
                                            {userData.address.line2}
                                        </p>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="w-1 h-5 bg-blue-600 mr-3 rounded"></span>
                            Basic Information
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <p className="font-semibold text-gray-600 w-32 mb-1 sm:mb-0">Gender:</p>
                                {
                                    isEdit
                                        ? <select 
                                            className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all cursor-pointer" 
                                            value={userData.gender} 
                                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        : <p className="text-gray-700 font-medium">{userData.gender}</p>
                                }
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <p className="font-semibold text-gray-600 w-32 mb-1 sm:mb-0">Birthday:</p>
                                {
                                    isEdit
                                        ? <input
                                            type="date"
                                            className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                                            value={userData.dob}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                        />
                                        : <p className="text-gray-700 font-medium">{userData.dob}</p>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center mt-8">
                        {
                            isEdit
                                ? <button 
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg" 
                                    onClick={updateUserProfile}
                                >
                                    Save Information
                                </button>
                                : <button 
                                    className="bg-white border-2 border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-md" 
                                    onClick={() => setIsEdit(true)}
                                >
                                    Edit Profile
                                </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;