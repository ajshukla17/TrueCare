import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

function Dashboard() {
    
    const { dashData, getDashboard, atoken, cancelAppointments } = useContext(AdminContext);

    useEffect(() => {
        if (atoken) {
            getDashboard();
        }
    }, [atoken]);

    // Helper function to get status badge
    const getStatusBadge = (appointment) => {
        if (appointment.cancelled) {
            return <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-red-100 text-red-700 whitespace-nowrap">Cancelled</span>;
        }
        if (appointment.isCompleted) {
            return <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-green-100 text-green-700 whitespace-nowrap">Completed</span>;
        }
        return <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">Pending</span>;
    };

    // Helper function to get payment badge
    const getPaymentBadge = (payment) => {
        return payment 
            ? <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">Paid</span>
            : <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">Unpaid</span>;
    };

    if (!dashData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6 xl:p-8">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                {/* Total Appointments */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                        <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-100 rounded-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500">Total</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-0.5 sm:mb-1">{dashData.appointments}</h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs lg:text-sm">Appointments</p>
                </div>

                {/* Total Doctors */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                        <div className="p-2 sm:p-2.5 lg:p-3 bg-green-100 rounded-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="20" cy="10" r="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500">Active</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-0.5 sm:mb-1">{dashData.doctors}</h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs lg:text-sm">Doctors</p>
                </div>

                {/* Total Patients */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                        <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-100 rounded-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500">Registered</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-0.5 sm:mb-1">{dashData.patients}</h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs lg:text-sm">Patients</p>
                </div>
            </div>

            {/* Latest Appointments Table */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border-b border-gray-200">
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Latest Appointments</h2>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">Recent patient appointments and their status</p>
                </div>

                {/* Mobile Card View (visible only on small screens) */}
                <div className="block sm:hidden">
                    {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                        dashData.latestAppointments.map((appointment) => (
                            <div key={appointment._id} className="border-b border-gray-200 p-3 hover:bg-gray-50">
                                {/* Patient Info */}
                                <div className="flex items-center mb-2">
                                    <img 
                                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-200" 
                                        src={appointment.userData?.image || '/api/placeholder/40/40'} 
                                        alt={appointment.userData?.name}
                                    />
                                    <div className="ml-2 flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{appointment.userData?.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{appointment.userData?.email}</div>
                                    </div>
                                    {getStatusBadge(appointment)}
                                </div>
                                
                                {/* Doctor Info */}
                                <div className="flex items-center mb-2 pl-12">
                                    <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeWidth="2"/>
                                    </svg>
                                    <span className="text-xs text-gray-700 font-medium">{appointment.docData?.name}</span>
                                    <span className="text-xs text-gray-500 ml-1">({appointment.docData?.speciality})</span>
                                </div>
                                
                                {/* Appointment Details */}
                                <div className="flex items-center justify-between pl-12 text-xs">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                        </svg>
                                        {appointment.slotDate.replace(/_/g, '/')} • {appointment.slotTime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">₹{appointment.amount}</span>
                                        {getPaymentBadge(appointment.payment)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                            No appointments found
                        </div>
                    )}
                </div>

                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                                dashData.latestAppointments.map((appointment) => (
                                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img 
                                                    className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover border-2 border-gray-200" 
                                                    src={appointment.userData?.image || '/api/placeholder/40/40'} 
                                                    alt={appointment.userData?.name}
                                                />
                                                <div className="ml-2 lg:ml-4">
                                                    <div className="text-xs lg:text-sm font-medium text-gray-900">{appointment.userData?.name}</div>
                                                    <div className="text-[10px] lg:text-xs text-gray-500 max-w-[150px] truncate">{appointment.userData?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img 
                                                    className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover border-2 border-gray-200" 
                                                    src={appointment.docData?.image || '/api/placeholder/40/40'} 
                                                    alt={appointment.docData?.name}
                                                />
                                                <div className="ml-2 lg:ml-4">
                                                    <div className="text-xs lg:text-sm font-medium text-gray-900">{appointment.docData?.name}</div>
                                                    <div className="text-[10px] lg:text-xs text-gray-500">{appointment.docData?.speciality}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            <div className="text-xs lg:text-sm text-gray-900">{appointment.slotDate.replace(/_/g, '/')}</div>
                                            <div className="text-[10px] lg:text-xs text-gray-500 flex items-center mt-0.5 lg:mt-1">
                                                <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                {appointment.slotTime}
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            <div className="text-xs lg:text-sm font-semibold text-gray-900">₹{appointment.amount}</div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            {getPaymentBadge(appointment.payment)}
                                        </td>
                                        <td className="px-3 lg:px-6 py-2.5 lg:py-4 whitespace-nowrap">
                                            {getStatusBadge(appointment)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 lg:px-6 py-6 lg:py-8 text-center text-xs lg:text-sm text-gray-500">
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;