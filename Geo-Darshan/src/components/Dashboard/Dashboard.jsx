// src/components/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Discover", href: "#discover", icon: MagnifyingGlassIcon },
    { name: "Destinations", href: "#destinations", icon: MapPinIcon },
    { name: "Itineraries", href: "#itineraries", icon: CalendarIcon },
    { name: "Community", href: "#community", icon: UserIcon },
    { name: "Insights", href: "#insights", icon: ChartBarIcon },
  ];

  const trendingDestinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      description:
        "Stunning sunsets, white-washed buildings, and crystal waters",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      rating: 4.9,
      price: "$$$",
      type: "Luxury",
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      description: "Historic temples, traditional gardens, and cherry blossoms",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      rating: 4.8,
      price: "$$",
      type: "Cultural",
    },
    {
      id: 3,
      name: "Banff National Park, Canada",
      description:
        "Majestic mountains, turquoise lakes, and wilderness adventures",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      rating: 4.7,
      price: "$$",
      type: "Adventure",
    },
  ];

  const features = [
    {
      name: "AI-Powered Recommendations",
      description:
        "Get personalized destination suggestions based on your preferences and travel history.",
      icon: "🤖",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Smart Itinerary Builder",
      description:
        "Create perfect travel plans with our intelligent itinerary planning tools.",
      icon: "📅",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Community Insights",
      description:
        "Access authentic experiences recommended by locals and seasoned travelers.",
      icon: "👥",
      gradient: "from-orange-500 to-red-500",
    },
    {
      name: "Price Tracking",
      description:
        "Monitor flight and accommodation prices to get the best deals.",
      icon: "💰",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 z-0"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-lg font-bold text-dark-950 mr-2">
                GD
              </div>
              <span className="text-xl font-light text-white">GeoDarshan</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors flex items-center"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            <span className="text-sm text-dark-300">
              Welcome, {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-primary-400 hover:text-primary-300 transition-colors"
            >
              Log out
            </button>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-dark-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">GeoDarshan</span>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-lg font-bold text-dark-950 mr-2">
                    GD
                  </div>
                  <span className="text-xl font-light text-white">
                    GeoDarshan
                  </span>
                </div>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-dark-800 flex items-center"
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white">
                    Welcome, {currentUser?.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-primary-400 hover:bg-dark-800"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Discover Your Next{" "}
              <span className="text-primary-400">Adventure</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-xl leading-8 text-dark-300 max-w-3xl mx-auto"
            >
              Personalized destination recommendations tailored to your unique
              travel style, preferences, and dreams. Let AI guide you to your
              perfect getaway.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <a
                href="#discover"
                className="rounded-xl bg-primary-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-all duration-300"
              >
                Start Exploring
              </a>
              <a
                href="#survey"
                className="rounded-xl border border-dark-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-dark-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-600 transition-all duration-300"
              >
                Take Preference Quiz <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-primary-500"
          >
            Smarter Travel
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl"
          >
            Everything you need for your next adventure
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-dark-300"
          >
            Our platform uses intelligent algorithms to match you with perfect
            destinations based on your preferences, budget, and travel style.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div
                    className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.gradient}`}
                  >
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-dark-400">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-primary-500">
            Trending Now
          </h2>
          <p className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl">
            Popular Destinations
          </p>
          <p className="mt-6 text-lg leading-8 text-dark-300">
            Discover the most sought-after travel destinations based on
            community ratings and seasonal trends.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {trendingDestinations.map((destination) => (
            <motion.article
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-start justify-between glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="relative w-full">
                <img
                  src={destination.image}
                  alt=""
                  className="aspect-[16/9] w-full bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-dark-900/80 px-2.5 py-0.5 text-xs font-medium text-white">
                    {destination.type}
                  </span>
                </div>
              </div>
              <div className="max-w-xl p-6">
                <div className="flex items-center gap-x-4 text-xs">
                  <time className="text-dark-400">{destination.price}</time>
                  <div className="flex items-center text-yellow-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {destination.rating}
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-primary-400 transition-colors">
                    <a href="#">
                      <span className="absolute inset-0" />
                      {destination.name}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-dark-300">
                    {destination.description}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <button className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-all duration-300">
                    Explore
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 py-16 sm:py-24 lg:py-32 rounded-2xl mx-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
              Ready to discover your perfect destination?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Take our personalized quiz to get recommendations tailored
              specifically to your travel preferences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#survey"
                className="rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
              >
                Start Quiz
              </a>
              <a
                href="#discover"
                className="rounded-xl border border-white/20 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
              >
                Browse Destinations <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-900 mt-16">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-dark-300 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-dark-400">
              &copy; 2023 GeoDarshan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
