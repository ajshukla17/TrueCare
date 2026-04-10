import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

function AllAppointment() {
    const { atoken, appointments, getAllAppointments, currency } = useContext(AdminContext);
    const { calculateAge, slotDateFormat } = useContext(AppContext);

    useEffect(() => {
        if (atoken) {
            getAllAppointments();
        }
    }, [atoken]);

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-semibold text-gray-800">All Appointments</p>
            <div className="bg-white border rounded-lg shadow-sm text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50 font-medium text-gray-700">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fee</p>
                    <p>Payment</p>
                </div>

                {/* Appointment Rows */}
                {appointments.map((item, index) => (
                    <div 
                        className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-colors" 
                        key={index}
                    >
                        <p className="max-sm:hidden font-medium text-gray-500">{index + 1}</p>
                        
                        {/* Patient Info */}
                        <div className="flex items-center gap-2">
                            <img 
                                className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                                src={item.userData?.image} 
                                alt={item.userData?.name} 
                            />
                            <p className="font-medium text-gray-800">{item.userData?.name}</p>
                        </div>
                        
                        {/* Age */}
                        <p className="max-sm:hidden">{calculateAge(item.userData?.dob)}</p>
                        
                        {/* Date & Time */}
                        <p className="text-gray-700">
                            {slotDateFormat(item.slotDate)}, {item.slotTime}
                        </p>
                        
                        {/* Doctor Info */}
                        <div className="flex items-center gap-2">
                            <img 
                                className="w-8 h-8 rounded-full bg-gray-200 object-cover border border-gray-200" 
                                src={item.docData?.image} 
                                alt={item.docData?.name} 
                            />
                            <p className="font-medium text-gray-800">{item.docData?.name}</p>
                        </div>
                        
                        {/* Fee */}
                        <p className="font-semibold text-gray-800">
                            {currency}{item.amount}
                        </p>
                        
                        {/* Payment Status */}
                        <div>
                            {item.payment ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Paid
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Unpaid
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {appointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">No appointments found</p>
                        <p className="text-sm mt-1">Appointments will appear here once scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllAppointment;