import { useNavigate } from 'react-router-dom';
import appointment_img from '../assets/assets/appointment_img.png'

function Banner() {
    const navigate = useNavigate();

    // 🔐 Check login status
    const handleBooking = () => {
        const user = localStorage.getItem("token"); // or token

        if (user) {
            navigate('/doctors');
        } else {
            navigate('/login');
        }

        scrollTo(0, 0);
    };

    return (
        <div className="relative hero-gradient rounded-2xl overflow-hidden px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
            
            {/* Background Effects */}
            <div className="banner-geo absolute inset-0 pointer-events-none opacity-80" />
            <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

            {/* Glow Effects */}
            <div className="glow-orb absolute -bottom-16 -left-16 w-72 h-72 bg-primary opacity-25 pointer-events-none" />
            <div className="glow-orb-2 absolute top-0 right-1/3 w-80 h-80 bg-accent opacity-15 pointer-events-none" />

            <div className="relative flex items-center">
                
                {/* LEFT CONTENT */}
                <div className="flex-1 py-10 sm:py-14 md:py-20 lg:py-24 lg:pl-5">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-accent text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block pulse-dot" />
                        Smart Healthcare Platform
                    </div>

                    {/* Headline */}
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        <p>Get Hassle-Free</p>
                        <p className="mt-2">
                            <span className="gradient-text">Doctor Appointments</span>
                            {" "}— Anytime, Anywhere
                        </p>
                    </div>

                    {/* Subtext */}
                    <p className="text-white/70 text-sm mt-4 max-w-md leading-relaxed">
                        Book your doctor instantly for free and securely store your medical reports online — 
                        never worry about losing them again.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={handleBooking}
                        className="mt-8 bg-white text-primary font-bold px-8 py-3.5 rounded-full text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 glow-accent"
                    >
                        Book Free Appointment →
                    </button>
                </div>

                {/* RIGHT IMAGE */}
                <div className="hidden md:block md:w-1/2 lg:w-[370px] relative self-end">
                    
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-accent/20 rounded-full filter blur-3xl" />
                    
                    <img
                        className="relative w-full absolute bottom-0 right-0 max-w-md drop-shadow-2xl"
                        src={appointment_img}
                        alt="Doctor appointment"
                    />
                </div>
            </div>
        </div>
    );
}

export default Banner;