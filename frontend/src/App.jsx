import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Contact from './pages/Contact'
import About from './pages/About'
import Appointment from './pages/Appointment'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Navbar from './components/Navbar'
import Fotter from './components/Fotter'
import { ToastContainer, toast } from 'react-toastify'
import AskAI from './components/AskAI'
import MyPrescriptions from './components/MyPrescriptions'
import { ThemeProvider } from './context/ThemeContext';
import MyReports from './pages/MyReport'
function App() {


  return (
    <ThemeProvider>
     
        <div className='mx-4 sm:mx-[10%]'>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/login' element={<Login />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointment' element={<MyAppointment />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/my-prescription" element={<MyPrescriptions />} />
            <Route path='/my-reports' element={<MyReports />} />
          </Routes>
          <Fotter />

        </div>
   
    </ThemeProvider>



  )
}

export default App
