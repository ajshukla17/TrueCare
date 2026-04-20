import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SPECIALITIES = [
  { label: "General Physician", value: "General Physician" },
  { label: "Gynecologist", value: "Gynecologist" },
  { label: "Dermatologist", value: "Dermatologist" },
  { label: "Pediatricians", value: "Pediatricians" },
  { label: "Neurologist", value: "Neurologist" },
  { label: "Gastroenterologist", value: "Gastroenterologist" },
  { label: "Cardiologist", value: "Cardiologist" },
  { label: "Orthopedic", value: "Orthopedic" },
  { label: "ENT Specialist", value: "ENT Specialist" },
  { label: "Pulmonologist", value: "Pulmonologist" },
];

function Doctors() {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [filterDoc, setFilterDoc] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let filtered = doctors;

    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }

    if (search) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterDoc(filtered);
  }, [doctors, speciality, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-2">

      {/* 🔷 Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find Your <span className="text-blue-600">Doctor</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Book appointments with top specialists near you
        </p>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full md:w-96 border rounded-xl px-4 py-3 outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      <div className="flex gap-8">

        {/* 🔷 Sidebar */}
        <aside className="hidden md:block w-64">

          <div className="bg-white border rounded-2xl shadow-md p-4">

            <h3 className="font-semibold mb-4 text-gray-700">
              Specialities
            </h3>

            <ul className="space-y-2">

              <li
                onClick={() => navigate("/doctors")}
                className={`cursor-pointer px-3 py-2 rounded-lg text-sm ${
                  !speciality
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All
              </li>

              {SPECIALITIES.map((s) => (
                <li
                  key={s.value}
                  onClick={() => navigate(`/doctors/${s.value}`)}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-sm ${
                    speciality === s.value
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 🔷 Doctors Grid */}
        <div className="flex-1">

          {filterDoc.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No doctors found
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {filterDoc.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.available) {
                      navigate(`/appointment/${item._id}`);
                      scrollTo(0, 0);
                    }
                  }}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 ${
                    item.available
                      ? "bg-white hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                      : "bg-gray-100 opacity-60 cursor-not-allowed"
                  }`}
                >

                  {/* 🔥 Availability Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.available
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">

                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </h3>

                    <p className="text-xs text-blue-500 mt-1 font-medium">
                      {item.speciality}
                    </p>

                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>{item.experience}</span>
                      <span className="font-semibold text-blue-600">
                        ₹{item.fees}
                      </span>
                    </div>

                    {/* Hover CTA */}
                    {item.available && (
                      <button className="mt-3 w-full text-xs py-2 rounded-lg bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition">
                        Book Appointment
                      </button>
                    )}
                  </div>

                  {/* Disabled overlay */}
                  {!item.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm font-semibold">
                        Not Available
                      </p>
                    </div>
                  )}
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;