import React from "react";
import { Link } from "react-router-dom";
import {
  FaGlobeAsia,
  FaMapMarkedAlt,
  FaStar,
  FaCompass,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaCompass className="text-3xl" />,
    title: "Smart Recommendations",
    desc: "Get personalized destination suggestions based on your preferences.",
    color: "bg-gradient-to-r from-[#04d5f2] to-[#43ee17]",
  },
  {
    icon: <FaMapMarkedAlt className="text-3xl" />,
    title: "Interactive Map",
    desc: "Explore places with an interactive map and plan your routes.",
    color: "bg-gradient-to-r from-[#fe6427] to-[#fde325]",
  },
  {
    icon: <FaStar className="text-3xl" />,
    title: "User Reviews",
    desc: "Read and share real traveler reviews to make informed decisions.",
    color: "bg-gradient-to-r from-[#efb9e2] to-[#04d5f2]",
  },
  {
    icon: <FaGlobeAsia className="text-3xl" />,
    title: "Trending Spots",
    desc: "Discover trending travel spots, events, and seasonal attractions.",
    color: "bg-gradient-to-r from-[#43ee17] to-[#fe6427]",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const floatVariant = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#050404] overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fde325] rounded-full filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#04d5f2] rounded-full filter blur-3xl opacity-5"></div>
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-[#43ee17] rounded-full filter blur-3xl opacity-5"></div>
      </div>

      {/* Navbar */}
      <motion.header
        className="flex justify-between items-center p-6 bg-white shadow-sm z-50 relative"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-[#04d5f2] to-[#43ee17] rounded-lg flex items-center justify-center shadow-md"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FaCompass className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-2xl font-bold text-[#050404]">Geo Darshan</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/login">
            <motion.button
              className="px-4 py-2 text-sm sm:text-base font-medium border border-[#d4d8dd] text-[#050404] rounded-lg hover:bg-[#f8f9fa] transition-all duration-300 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              className="px-4 py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-[#04d5f2] to-[#43ee17] text-white rounded-lg hover:shadow-md transition-all duration-300 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SignUp
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-16 md:py-24 min-h-[70vh]">
        <motion.div
          className="max-w-xl space-y-6 z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#050404]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#04d5f2] to-[#43ee17]">
              Perfect
            </span>{" "}
            Destination
          </motion.h1>
          <motion.p
            className="text-lg text-[#6b7280]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Geo Darshan helps you find travel destinations that match your
            interests, style, and budget. Plan smarter, travel better.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link to="/login">
              <motion.button
                className="group bg-gradient-to-r from-[#04d5f2] to-[#43ee17] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Your Journey</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>
            <button className="px-8 py-4 border border-[#d4d8dd] text-[#050404] rounded-lg hover:bg-[#f8f9fa] transition-all duration-300 shadow-sm">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        <motion.div className="relative w-full md:w-1/2 mt-16 md:mt-0">
          <div className="mx-0 md:ml-10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative">
              <img
                src="https://plus.unsplash.com/premium_photo-1733259839381-50d9300d7129?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Travel destination"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Explore
                </motion.h2>
                <motion.button
                  className="self-start bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#050404] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  Start Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#050404]"
          >
            Why Choose Geo Darshan?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center text-[#6b7280] mb-16 max-w-2xl mx-auto"
          >
            Our platform offers everything you need to plan your perfect trip
            with confidence and ease.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-white border border-[#f1f5f9] rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <div
                  className={`p-4 rounded-full ${feature.color} mb-4 text-white shadow-md`}
                >
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#050404]">
                  {feature.title}
                </h4>
                <p className="text-[#6b7280] text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-[#f8fafc] to-white">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#050404]"
          >
            What Travelers Say
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center text-[#6b7280] mb-16 max-w-2xl mx-auto"
          >
            Hear from our community of travelers who have discovered amazing
            destinations with our platform.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md border border-[#f1f5f9]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#fe6427] to-[#fde325] rounded-full flex items-center justify-center text-white font-bold">
                    U{item}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-[#050404]">
                      User {item}
                    </h4>
                    <div className="flex text-[#fde325]">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                </div>
                <p className="text-[#6b7280]">
                  "Geo Darshan helped me discover hidden gems I would never have
                  found on my own. The recommendations were spot on!"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#04d5f2] to-[#43ee17]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Explore the World?
            </h2>
            <p className="text-white/90 mb-8">
              Join thousands of travelers who are already discovering their
              perfect destinations with Geo Darshan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="bg-white text-[#050404] px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
