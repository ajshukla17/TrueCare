import { assets } from "../assets/assets/assets";

function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* 🔷 Hero */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          About <span className="text-blue-600">TrueCare</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Transforming healthcare through seamless digital experiences.
        </p>
      </div>

      {/* 🔷 Main Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Image */}
        <img
          src={assets.about_image}
          alt=""
          className="w-full rounded-2xl shadow-lg"
        />

        {/* Content */}
        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">

          <p>
            Welcome to <span className="font-semibold text-gray-800">TrueCare</span>, 
            your trusted partner in managing healthcare efficiently. We simplify 
            appointment booking, medical record management, and patient-doctor 
            interaction — all in one platform.
          </p>

          <p>
            Our platform is built with a vision to reduce the gap between 
            patients and healthcare providers. With modern technology, we ensure 
            a seamless, fast, and reliable healthcare experience.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Our Vision
            </h3>
            <p>
              To create a connected healthcare ecosystem where accessing care is 
              simple, efficient, and accessible for everyone.
            </p>
          </div>

        </div>
      </div>

      {/* 🔷 Why Choose Us */}
      <div className="mt-16">

        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Why <span className="text-blue-600">Choose Us</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-semibold text-gray-800 mb-2">
              ⚡ Efficiency
            </h3>
            <p className="text-gray-500 text-sm">
              Book appointments quickly with a streamlined process designed for
              your busy schedule.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-semibold text-gray-800 mb-2">
              📍 Convenience
            </h3>
            <p className="text-gray-500 text-sm">
              Access a network of trusted doctors and healthcare providers near you.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-semibold text-gray-800 mb-2">
              🎯 Personalization
            </h3>
            <p className="text-gray-500 text-sm">
              Get tailored recommendations and reminders for better health management.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default About;