import { specialityData } from "../assets/assets/assets";
import { Link } from "react-router-dom";

function SpecialityMenu() {
    return (
        <div className="flex flex-col items-center gap-4 py-20 text-gray-800" id="speciality">
            {/* Section heading */}
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Browse Specialities</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 section-heading text-center">
                Find by Speciality
            </h1>
            <p className="sm:w-1/3 text-center text-sm text-gray-500 mt-3 leading-relaxed">
                Browse our extensive list of trusted doctors and schedule your appointment hassle-free.
            </p>

            {/* Cards */}
            <div className="flex gap-5 sm:justify-center pt-6 w-full overflow-x-auto pb-2">
                {specialityData.map((item, index) => (
                    <Link
                        onClick={() => scrollTo(0, 0)}
                        key={index}
                        to={`/doctors/${item.speciality}`}
                        className="speciality-card flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 bg-white border border-gray-100 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-2 glow-card group"
                    >
                        {/* Icon bubble */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                            <img className="w-10 sm:w-12" src={item.image} alt={item.speciality} />
                        </div>
                        {/* Label */}
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors duration-300 text-center">
                            {item.speciality}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SpecialityMenu;