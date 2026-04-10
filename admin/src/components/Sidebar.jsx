import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

function Sidebar() {

    const { atoken } = useContext(AdminContext);
    const { dtoken } = useContext(DoctorContext);

    const navStyle = (isActive) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    const iconStyle = "w-5 h-5 opacity-80 group-hover:opacity-100";

    return (
        <div className="min-h-screen w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">

            {/* TOP LOGO / TITLE */}
            <div>
                <div className="px-6 py-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                        True<span className="text-blue-600">Care</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Management Panel
                    </p>
                </div>

                {/* ADMIN SIDEBAR */}
                {atoken && !dtoken && (
                    <div className="mt-6 px-3">

                        <p className="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wider">
                            Admin
                        </p>

                        <div className="space-y-2">

                            <NavLink to="/admin-dashboard"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.HomeIcon} />
                                <span className="font-medium">Dashboard</span>
                            </NavLink>

                            <NavLink to="/all-appointments"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.Appointment} />
                                <span className="font-medium">Appointments</span>
                            </NavLink>

                            <NavLink to="/add-doctor"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.Addicon} />
                                <span className="font-medium">Add Doctor</span>
                            </NavLink>

                            <NavLink to="/doctor-list"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.peopleIcon} />
                                <span className="font-medium">Doctors List</span>
                            </NavLink>

                        </div>
                    </div>
                )}

                {/* DOCTOR SIDEBAR */}
                {dtoken && !atoken && (
                    <div className="mt-6 px-3">

                        <p className="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wider">
                            Doctor
                        </p>

                        <div className="space-y-2">

                            <NavLink to="/doctor-dashboard"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.HomeIcon} />
                                <span className="font-medium">Dashboard</span>
                            </NavLink>

                            <NavLink to="/doctor-appointments"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.Appointment} />
                                <span className="font-medium">Appointments</span>
                            </NavLink>

                            <NavLink to="/doctor-profile"
                                className={({ isActive }) => navStyle(isActive)}>
                                <img className={iconStyle} src={assets.peopleIcon} />
                                <span className="font-medium">Profile</span>
                            </NavLink>

                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM USER AREA */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        U
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            Welcome
                        </p>
                        <p className="text-xs text-gray-400">
                            Dashboard Access
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Sidebar;