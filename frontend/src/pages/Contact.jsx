import { assets } from "../assets/assets/assets";

function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* 🔷 Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Contact <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-gray-500 mt-2">
          We’re here to help you. Reach out anytime.
        </p>
      </div>

      {/* 🔷 Top Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <img
          src={assets.contact_image}
          alt=""
          className="w-full rounded-2xl shadow-md"
        />

        {/* Contact Info */}
        <div className="space-y-6">

          <div className="bg-white shadow-md rounded-xl p-5 border">
            <h3 className="font-semibold text-gray-700 mb-1">📍 Address</h3>
            <p className="text-gray-500 text-sm">
              Prayagraj, Uttar Pradesh <br />
              2/12k Beniganj
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 border">
            <h3 className="font-semibold text-gray-700 mb-1">📞 Phone</h3>
            <a href="tel:6394122075" className="text-blue-600 text-sm">
              +91 6394122075
            </a>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 border">
            <h3 className="font-semibold text-gray-700 mb-1">📧 Email</h3>
            <a
              href="mailto:truecareinfotechpvtltd@gmail.com"
              className="text-blue-600 text-sm"
            >
              truecareinfotechpvtltd@gmail.com
            </a>
          </div>

        </div>
      </div>

      {/* 🔷 Contact Form */}
      <div className="mt-14 bg-white shadow-lg rounded-2xl p-8 border">

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Send us a message
        </h2>

        <form className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Your Name"
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Subject"
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
          ></textarea>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>

        </form>
      </div>

    </div>
  );
}

export default Contact;