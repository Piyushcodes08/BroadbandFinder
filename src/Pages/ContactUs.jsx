import { useState } from "react";
import ContactUsImage from "../assets/contact.jpg";
import { Helmet } from "react-helmet-async";
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace with backend call
    setStatus("✅ Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Business Internet Plans & Support</title>
        <meta
          name="description"
          content="Get in touch with our business internet experts. Call us directly or fill out the contact form for support, sales inquiries, or questions about internet plans and availability."
        />
        <meta
          name="keywords"
          content="Contact internet provider, business internet support, internet sales expert, contact us form, internet plans help"
        />
      </Helmet>
      {/* Banner Section */}
      <section className="bg-[#E8611A] py-16 px-6 text-center text-white pt-20">
        <div className="max-w-4xl mx-auto" data-aos="fade-down">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Talk to a Business Sales Expert Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium mb-6">
            Call us and get the best internet plans for your area.
          </p>
          <a
            href="tel:18557442407"
            className="inline-block bg-white text-[#E8611A] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            1-855-744-2407
          </a>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-white text-center px-6 sm:px-8 pt-10" data-aos="fade-up">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E8611A] mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto text-base sm:text-lg">
          Have questions or need support? Fill out the form below and our team
          will get back to you as soon as possible.
        </p>
      </section>

      {/* Form Section */}
      <section className="flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          {/* Image */}
          <div className="w-full md:w-1/2 h-60 md:h-auto" data-aos="fade-right">
            <img
              src={ContactUsImage}
              alt="Contact Us"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12" data-aos="fade-left">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47630] focus:border-[#F47630] transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47630] focus:border-[#F47630] transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write your message here..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47630] focus:border-[#F47630] transition resize-none"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 border border-[#E8611A] text-[#E8611A] hover:text-white font-semibold rounded-full hover:bg-[#C44E12] transition duration-300"
                >
                  Send Message
                </button>

                {/* Status Message */}
                {status && (
                  <p className="text-green-600 font-medium text-center mt-4">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
