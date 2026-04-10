import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

function DoctorProfile() {

    const { profile, getProfile, updateProfile } = useContext(DoctorContext);

    const [form, setForm] = useState({});
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    // ✅ FIX: handle address object properly
    useEffect(() => {
        if (profile) {
            setForm({
                ...profile,
                address: profile.address || { line1: "", line2: "" }
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ ADDRESS HANDLER
    const handleAddressChange = (field, value) => {
        setForm({
            ...form,
            address: {
                ...form.address,
                [field]: value
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(form);
        setEdit(false);
    };

    if (!profile) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6 w-full">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Doctor Profile</h1>

                {!edit ? (
                    <button
                        onClick={() => setEdit(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <button
                        onClick={() => setEdit(false)}
                        className="bg-gray-400 text-white px-5 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">

                {/* LEFT: PROFILE CARD */}
                <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">

                    <img
                        src={form.image}
                        className="w-32 h-32 rounded-full object-cover border mb-4"
                    />

                    {edit && (
                        <input type="file" className="text-sm" />
                    )}

                    <h2 className="text-xl font-semibold mt-2">{form.name}</h2>
                    <p className="text-gray-500">{form.speciality}</p>

                    <p className="mt-2 text-sm text-gray-400">
                        {form.about || "No description"}
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-2 space-y-6">

                    {/* PERSONAL */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input name="name" value={form.name || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Full Name" />

                            <input name="email" value={form.email || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Email" />

                            <input name="phone" value={form.phone || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Phone" />

                        </div>

                        {/* ✅ FIXED ADDRESS */}
                        <div className="grid md:grid-cols-2 gap-4 mt-4">

                            <input
                                value={form.address?.line1 || ""}
                                onChange={(e) => handleAddressChange("line1", e.target.value)}
                                disabled={!edit}
                                className="input"
                                placeholder="Address Line 1"
                            />

                            <input
                                value={form.address?.line2 || ""}
                                onChange={(e) => handleAddressChange("line2", e.target.value)}
                                disabled={!edit}
                                className="input"
                                placeholder="Address Line 2"
                            />

                        </div>
                    </div>

                    {/* PROFESSIONAL */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Professional Details</h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input name="experience" value={form.experience || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Experience (years)" />

                            <input name="fees" value={form.fees || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Consultation Fees" />

                            <input name="timing" value={form.timing || ""} onChange={handleChange}
                                disabled={!edit} className="input" placeholder="Timing" />

                        </div>

                        <textarea name="about" value={form.about || ""} onChange={handleChange}
                            disabled={!edit}
                            className="input mt-4 w-full"
                            placeholder="About Doctor" />
                    </div>

                    {/* SECURITY */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Security</h2>

                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            disabled={!edit}
                            className="input w-full"
                            placeholder="New Password"
                        />
                    </div>

                    {/* SAVE */}
                    {edit && (
                        <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
                            Save Changes
                        </button>
                    )}

                </div>

            </form>
        </div>
    );
}

export default DoctorProfile;