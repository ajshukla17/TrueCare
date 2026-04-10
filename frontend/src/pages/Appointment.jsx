import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import RelatedDr from "../components/RelatedDr";
import { toast } from "react-toastify";
import axios from "axios";

function Appointment() {
    const { docId } = useParams();
    const { doctors, currenySym, backendurl, token } =
        useContext(AppContext);

    const navigate = useNavigate();

    const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const [docInfo, setdocInfo] = useState(null);
    const [docSlot, setdocSlot] = useState([]);
    const [slotIndx, setslotIndx] = useState(0);
    const [slotTime, setslotTime] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);

    const fetchDocInfo = () => {
        const info = doctors.find((doc) => doc._id === docId);
        setdocInfo(info);
    };

    const generateSlots = (date, start, end, duration) => {
        const slots = [];
        let startTime = new Date(date);
        let [sh, sm] = start.split(":");
        startTime.setHours(sh, sm, 0, 0);

        let endTime = new Date(date);
        let [eh, em] = end.split(":");
        endTime.setHours(eh, em, 0, 0);

        while (startTime < endTime) {
            let next = new Date(startTime.getTime() + duration * 60000);

            if (next <= endTime) {
                slots.push({
                    datetime: new Date(startTime),
                    time: startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                });
            }

            startTime = next;
        }

        return slots;
    };

    const getAvailSlot = () => {
        if (!docInfo) return;

        const allSlots = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currDate = new Date(today);
            currDate.setDate(today.getDate() + i);

            const dayName = week[currDate.getDay()];

            const dayData = docInfo.availability?.find(
                (d) => d.day === dayName
            );

            let daySlots = [];

            if (dayData && dayData.sessions?.length > 0) {
                dayData.sessions.forEach((session) => {
                    const slots = generateSlots(
                        currDate,
                        session.start,
                        session.end,
                        session.duration
                    );

                    daySlots = [...daySlots, ...slots];
                });
            }

            allSlots.push(daySlots);
        }

        setdocSlot(allSlots);
    };

    const isSlotPassed = (slotDateTime) => new Date() > slotDateTime;

    // ✅ FINAL BOOKING LOGIC
    const bookAppointment = async () => {
        if (!token) {
            toast.warn("Login first");
            return navigate("/login");
        }

        try {
            setIsBooking(true);

            let slotDate = "";
            let finalSlotTime = slotTime;

            // ✅ NORMAL BOOKING
            if (slotTime && docSlot[slotIndx]?.length > 0) {
                const dateObj = docSlot[slotIndx][0]?.datetime;

                if (!dateObj) {
                    toast.error("Invalid slot");
                    return;
                }

                slotDate = `${dateObj.getDate()}_${dateObj.getMonth() + 1}_${dateObj.getFullYear()}`;
            }

            // ⚡ EMERGENCY BOOKING
            else if (isEmergency) {
                const date = new Date();
                slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
                finalSlotTime = "ASAP";
            }

            // ❌ ERROR CASE
            else {
                toast.error("Please select a slot");
                return;
            }

            const { data } = await axios.post(
                backendurl + "/api/user/book-appointment",
                { docId, slotDate, slotTime: finalSlotTime, isEmergency },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                navigate("/my-appointment");
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsBooking(false);
        }
    };

    useEffect(() => fetchDocInfo(), [doctors, docId]);
    useEffect(() => getAvailSlot(), [docInfo]);

    if (!docInfo) return null;

    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">

            {/* Doctor Card */}
            <div className="bg-white rounded-3xl shadow p-6 text-center">
                <img
                    src={docInfo.image}
                    alt=""
                    className="w-28 h-28 rounded-2xl mx-auto object-cover"
                />

                <h2 className="text-2xl font-bold mt-4">{docInfo.name}</h2>

                <p className="text-gray-500 text-sm">
                    {docInfo.speciality} • {docInfo.experience}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                        <p className="text-xs text-gray-500">CONSULTATION</p>
                        <p className="text-lg font-bold text-blue-600">
                            {currenySym}
                            {isEmergency
                                ? (docInfo.emergencyFee || docInfo.fees * 2)
                                : docInfo.fees}
                        </p>
                    </div>

                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                        <p className="text-xs text-gray-500">RATING</p>
                        <p className="text-lg font-bold">⭐ 4.8</p>
                    </div>
                </div>

                {/* ⚡ Emergency */}
                <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-red-600">
                                ⚡ Emergency Booking
                            </p>
                            <p className="text-xs text-gray-500">
                                Priority consultation with higher fees
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={isEmergency}
                            onChange={(e) => setIsEmergency(e.target.checked)}
                            className="w-5 h-5 cursor-pointer"
                        />
                    </div>

                    {isEmergency && (
                        <p className="text-sm text-red-500 mt-2 font-medium">
                            ⚡ Emergency appointment selected
                        </p>
                    )}
                </div>
            </div>

            {/* Slots */}
            <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Booking Slots</h3>

                <div className="flex gap-3 overflow-x-auto">
                    {docSlot.map((item, index) => {
                        const date = new Date();
                        date.setDate(date.getDate() + index);

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    setslotIndx(index);
                                    setslotTime("");
                                }}
                                className={`min-w-[70px] text-center py-3 rounded-xl cursor-pointer ${
                                    slotIndx === index
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                }`}
                            >
                                <p className="text-xs">{week[date.getDay()]}</p>
                                <p className="text-lg font-bold">{date.getDate()}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                    {docSlot[slotIndx]
                        ?.filter((item) => !isSlotPassed(item.datetime))
                        .map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setslotTime(item.time)}
                                className={`py-2 rounded-xl text-sm ${
                                    slotTime === item.time
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                }`}
                            >
                                {item.time}
                            </button>
                        ))}
                </div>
            </div>

            {/* Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow">
                <button
                    onClick={bookAppointment}
                    disabled={(!slotTime && !isEmergency) || isBooking}
                    className={`w-full py-3 rounded-xl font-semibold ${
                        isEmergency
                            ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                    }`}
                >
                    {isBooking
                        ? "Booking..."
                        : isEmergency
                        ? "⚡ Book Emergency Appointment"
                        : "Book Appointment"}
                </button>
            </div>
        </div>
    );
}

export default Appointment;