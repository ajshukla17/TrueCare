import groupprofile from "../assets/assets/group_profiles.png"
import arrowIcon from "../assets/assets/arrow_icon.svg"
import header from "../assets/assets/header_img.png"

function Header() {
    return (
        <div className="relative hero-gradient rounded-2xl overflow-hidden px-6 md:px-10 lg:px-20 mb-2">
            {/* Dot grid overlay */}
            <div className="dot-grid absolute inset-0 pointer-events-none opacity-60" />

            {/* Glowing orbs */}
            <div className="glow-orb absolute -top-16 -left-16 w-72 h-72 bg-primary opacity-30 pointer-events-none" />
            <div className="glow-orb-2 absolute bottom-0 right-1/4 w-96 h-96 bg-neonPurple opacity-20 pointer-events-none" />
            <div className="glow-orb absolute top-1/2 right-10 w-48 h-48 bg-accent opacity-15 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row">
                {/* Left side */}
                <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[10vw] md:mb-[-30px]">
                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-accent text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block pulse-dot" />
                        Trusted Healthcare Platform
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        <span className="text-white">Book </span>
                        <span className="gradient-text">Appointment</span>
                        <br />
                        <span className="text-white">With Trusted </span>
                        <span className="gradient-text">Doctors</span>
                    </h1>

                    {/* Subtext + group profiles */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            className="w-24 rounded-full ring-2 ring-accent/40"
                            src={groupprofile}
                            alt="Trusted patients"
                        />
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Browse our extensive list of verified doctors and{" "}
                            <span className="text-white/80">schedule your appointment</span> hassle-free.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-6 mt-1">
                        {[
                            { value: "500+", label: "Doctors" },
                            { value: "50K+", label: "Patients" },
                            { value: "4.9★", label: "Rating" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-white font-bold text-xl">{stat.value}</span>
                                <span className="text-white/50 text-xs uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <a
                        href="#speciality"
                        className="btn-gradient flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg mt-1 glow-primary"
                    >
                        Book Appointment
                        <span className="bg-white/20 rounded-full p-1">
                            <img className="w-3 h-3" src={arrowIcon} alt="" />
                        </span>
                    </a>
                </div>

                {/* Right side — doctor image */}
                <div className="md:w-1/2 relative flex items-end justify-center mt-8 md:mt-0">
                    {/* Glow rings behind image */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/20 rounded-full filter blur-2xl" />
                    <img
                        className="relative w-full md:absolute bottom-0 h-auto drop-shadow-2xl"
                        src={header}
                        alt="Doctor"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;