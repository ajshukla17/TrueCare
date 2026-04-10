import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function RelatedDr({ speciality, docId }) {
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();
    const [relDr, setRelDr] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const docData = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId);
            setRelDr(docData);
        }
    }, [doctors, speciality, docId]);

    if (relDr.length === 0) return null;

    return (
        <div className="mt-12">
            {/* Section Header */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">More Specialists</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 section-heading text-center">
                    Related Doctors
                </h2>
                <p className="text-sm text-gray-500 text-center max-w-sm mt-2 leading-relaxed">
                    Other highly rated specialists in the same field.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relDr.slice(0, 5).map((item, index) => (
                    <div
                        key={index}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                        className="glow-card bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
                    >
                        {/* Image */}
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/15 transition-all duration-300">
                            <img className="w-full object-cover" src={item.image} alt={item.name} />
                        </div>

                        {/* Info */}
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot flex-shrink-0" />
                                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Available</span>
                            </div>
                            <p className="text-gray-900 font-semibold text-sm leading-snug truncate">{item.name}</p>
                            <p className="text-xs mt-0.5 gradient-text-primary font-medium truncate">{item.speciality}</p>
                            {item.experience && (
                                <p className="text-[10px] text-gray-400 mt-1">{item.experience} experience</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RelatedDr;
