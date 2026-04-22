import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify"; // 🔥 IMPORT

function DoctorsList() {
  const { doctors, atoken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [timingData, setTimingData] = useState({
    day: "MON",
    start: "",
    end: "",
    duration: 30,
  });

  useEffect(() => {
    if (atoken) {
      getAllDoctors();
    }
  }, [atoken, getAllDoctors]);

  // 🔹 Open Modal
  const openTimingModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // 🔹 Save Timing (UPDATED WITH TOAST)
  const saveTiming = async () => {
    try {
      if (!timingData.start || !timingData.end) {
        return toast.warn("Please fill all fields");
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/set-availability`,
        {
          doctorId: selectedDoctor._id,
          timing: timingData,
        },
        {
          headers: { atoken: atoken },
        }
      );

      if (data.success) {
        toast.success("Timing Added Successfully ✅"); // 🔥 SUCCESS TOAST
        getAllDoctors();
        setSelectedDoctor(null);

        // reset form
        setTimingData({
          day: "MON",
          start: "",
          end: "",
          duration: 30,
        });
      } else {
        toast.error(data.message);
      }

    } catch (err) {
     
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="mx-11 max-w-7xl py-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">
          All Doctors
        </h1>
      </div>

      {/* Doctor Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white border shadow-sm hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden bg-indigo-50">
              <img
                className="h-full w-full object-cover"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="p-4">
              <p className="text-neutral-900 font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">
                {item.speciality}
              </p>

              {/* Availability Toggle */}
              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={() => changeAvailability(item._id)}
                    checked={item.available}
                  />
                  Available
                </label>
              </div>

              {/* Show Existing Timings */}
              {item.availability?.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {item.availability.map((day, i) => (
                    <div key={i}>
                      <b>{day.day}:</b>{" "}
                      {day.sessions.map((s, j) => (
                        <span key={j}>
                          {s.start}-{s.end} ({s.duration}m){" "}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Set Timing Button */}
              <button
                onClick={() => openTimingModal(item)}
                className="mt-3 w-full bg-indigo-500 text-white py-1.5 rounded-lg text-sm"
              >
                Set Timing
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">

            <h2 className="text-lg font-semibold mb-4">
              Set Timing - {selectedDoctor.name}
            </h2>

            {/* Day */}
            <select
              className="w-full border p-2 mb-2"
              value={timingData.day}
              onChange={(e) =>
                setTimingData({ ...timingData, day: e.target.value })
              }
            >
              {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            {/* Start Time */}
            <input
              type="time"
              className="w-full border p-2 mb-2"
              value={timingData.start}
              onChange={(e) =>
                setTimingData({ ...timingData, start: e.target.value })
              }
            />

            {/* End Time */}
            <input
              type="time"
              className="w-full border p-2 mb-2"
              value={timingData.end}
              onChange={(e) =>
                setTimingData({ ...timingData, end: e.target.value })
              }
            />

            {/* Duration */}
            <input
              type="number"
              placeholder="Duration (minutes)"
              className="w-full border p-2 mb-4"
              value={timingData.duration}
              onChange={(e) =>
                setTimingData({
                  ...timingData,
                  duration: Number(e.target.value),
                })
              }
            />

            {/* Save Button */}
            <button
              onClick={saveTiming}
              disabled={!timingData.start || !timingData.end}
              className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              Save Timing
            </button>

            {/* Cancel */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsList;