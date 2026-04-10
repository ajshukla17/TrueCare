import { useNavigate } from 'react-router-dom';
import appointment_img from '../assets/assets/appointment_img.png'

function Banner() {
    const navigate = useNavigate();

    return (
        <div className="relative hero-gradient rounded-2xl overflow-hidden px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
            {/* Geometric overlay */}
            <div className="banner-geo absolute inset-0 pointer-events-none opacity-80" />
            <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

            {/* Glowing orbs */}
            <div className="glow-orb absolute -bottom-16 -left-16 w-72 h-72 bg-primary opacity-25 pointer-events-none" />
            <div className="glow-orb-2 absolute top-0 right-1/3 w-80 h-80 bg-accent opacity-15 pointer-events-none" />

            <div className="relative flex items-center">
                {/* Left side */}
                <div className="flex-1 py-10 sm:py-14 md:py-20 lg:py-24 lg:pl-5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-accent text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block pulse-dot" />
                        Get Started Today
                    </div>

                    {/* Headline */}
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        <p>Book Appointment</p>
                        <p className="mt-2">
                            With{" "}
                            <span className="gradient-text">100+ Trusted</span>
                            {" "}Doctors
                        </p>
                    </div>

                    {/* Sub text */}
                    <p className="text-white/50 text-sm mt-4 max-w-xs leading-relaxed">
                        Join thousands of patients who trust our platform for seamless healthcare access.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() => { navigate('/login'); scrollTo(0, 0); }}
                        className="mt-8 bg-white text-primary font-bold px-8 py-3.5 rounded-full text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 glow-accent"
                    >
                        Create Free Account →
                    </button>
                </div>

                {/* Right side — image */}
                <div className="hidden md:block md:w-1/2 lg:w-[370px] relative self-end">
                    {/* Glow behind image */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-accent/20 rounded-full filter blur-3xl" />
                    <img
                        className="relative w-full absolute bottom-0 right-0 max-w-md drop-shadow-2xl"
                        src={appointment_img}
                        alt="Book appointment"
                    />
                </div>
            </div>
        </div>
    );
}

export default Banner;