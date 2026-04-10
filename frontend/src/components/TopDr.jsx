import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function TopDr() {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="relative py-20 px-6 md:px-10 bg-gradient-to-b from-white via-blue-50/40 to-white">

      {/* 🔷 Heading */}
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-[4px] text-blue-500 mb-2">
          Our Experts
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          Meet Our <span className="text-blue-600">Top Doctors</span>
        </h1>

        <p className="max-w-xl mx-auto text-gray-500 text-sm mt-4">
          Highly qualified and trusted professionals ready to provide the best
          healthcare experience.
        </p>
      </div>

      {/* 🔷 Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="group relative cursor-pointer rounded-2xl overflow-hidden backdrop-blur-lg bg-white/70 border border-white/40 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
          >

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4 relative z-10">

              {/* Availability */}
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available
                </span>

                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                  ⭐ 4.8
                </span>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                {item.name}
              </h3>

              {/* Speciality */}
              <p className="text-xs text-blue-500 mt-1 font-medium">
                {item.speciality}
              </p>

              {/* Experience */}
              <p className="text-xs text-gray-400 mt-1">
                {item.experience || "5+ years exp."}
              </p>

              {/* Hover CTA */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition duration-300">
                <button className="w-full text-xs py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Book Appointment →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔷 Bottom Button */}
      <div className="flex justify-center mt-14">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="relative px-10 py-3 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        >
          Explore All Doctors
        </button>
      </div>
    </div>
  );
}

export default TopDr;