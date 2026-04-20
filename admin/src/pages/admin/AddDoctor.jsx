import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios  from "axios";

function AddDoctor() {
    
    const [docImg, setDocImg] =useState(false)
    const [name ,setName] =useState("")
    const [email ,setEmail] = useState("")
    const [experience ,setExperience] =useState("1 Year")
    const [fees ,setFees] =useState("")
    const [about ,setAbout] = useState("")
    const [speciality ,setSpeciality] = useState("General Physician")
    const [degree ,setDegree] =useState('')
    const [address1 ,setAddress1 ]  =useState("")
    const [address2 ,setAddress2] = useState("")
    const [password ,setPassword]  =useState("")

    const {backendurl , atoken} = useContext(AdminContext)
    
    const onSubmitHandler = async(e) =>{
        e.preventDefault()

        try{
            if (!docImg) {
                return toast.error("Image not selected")
                
            }
            const formData = new FormData()
            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('fees',Number(fees))
            formData.append('degree',degree)
            formData.append('experience',experience)
            formData.append('password',password)
            formData.append('speciality',speciality)
            formData.append('about',about)
          
            formData.append('address',JSON.stringify({line1 :address1 , line2 : address2}))
            
            //clg formdata
            formData.forEach((value,key)=>{
                console.log(`${key} : ${value}`);
            })

            const {data} = await axios.post(backendurl + '/api/admin/add-doctor' , formData , {headers:{ atoken }})
            console.log(data);
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setEmail('')
                setFees('')
                setAbout('')
                setDegree('')
                setAddress1('')
                setAddress2('')
                setPassword('')
                
            }else{
                toast.error(data.message)
            }

        }catch(err){
            toast.error(err.message)
            console.log(err);
            

        }
        
    }


    return (
         <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-5xl mx-auto">
            <p className="text-3xl font-semibold text-slate-800 mb-6">
                Add Doctor
            </p>
            <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg p-10">
                <div className="mb-8">
                    <label htmlFor="doc-img" className="inline-flex items-center gap-4 cursor-pointer group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-slate-200 group-hover:border-blue-400 transition-all">
                            <img src={ docImg ? URL.createObjectURL(docImg) :assets.upload_icon} alt="" className="w-10 h-10 opacity-50 group-hover:opacity-70 transition-opacity" />
                        </div>
                        <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" name="doc-img" hidden />
                        <div>
                            <p className="text-base font-medium text-slate-700">Upload doctor picture</p>
                        </div>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Doctor name</p>
                        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Name" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Speciality</p>
                        <select name="" onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer transition-all">
                            <option value="General Physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="ENT Specialist">ENT Specialist</option>
                            <option value="Pulmonologist">Pulmonologist</option>

                        </select>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Doctor Email</p>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Your email" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Education</p>
                        <input onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" placeholder="Education" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Doctor Password</p>
                        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Password" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Address Line 1</p>
                        <input type="text"  placeholder="Address 1" onChange={(e)=>setAddress1(e.target.value)} value={address1} required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Experience</p>
                        <select onChange={(e)=>setExperience(e.target.value)} value={experience} name="" className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer transition-all">
                            <option value="1 Year">1+ Year</option>
                            <option value="2 Year">5+ Year</option>
                            <option value="10 Year">10+ Year</option>
                            <option value="10 Year">15+ Year</option>
                            <option value="10 Year">20+ Year</option>
                            <option value="21 Year">25+ Year</option>
                            <option value="21 Year">30+ Year</option>
                            <option value="21 Year">35+ Year</option>
                            <option value="21 Year">40+ Year</option>
                            <option value="21 Year">45+ Year</option>
                            <option value="21 Year">50+ Year</option>
                            <option value="21 Year">55+ Year</option>
                           
                        </select>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Address Line 2</p>
                        <input type="text" onChange={(e)=>setAddress2(e.target.value)} value={address2} placeholder="Address 2" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Fees</p>
                        <input type="number" onChange={(e)=>setFees(e.target.value)} value={fees} placeholder="Your fees" required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                </div>
                <div className="mt-6">
                    <p className="text-sm font-medium text-slate-700 mb-2">About me</p>
                    <textarea onChange={(e)=>setAbout(e.target.value)} value={about} placeholder="Write about yourself" rows={5} required className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all" />
                </div>
                <button className="mt-8 px-10 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 active:scale-98 transition-all shadow-md hover:shadow-lg">
                    Add doctor
                </button>
            </div>
        </form>
    );
}

export default AddDoctor;