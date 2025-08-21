import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const Dashboard = () => {
  const validDestinations = destinations.filter(
    (d) => d.coordinates && d.coordinates.lat && d.coordinates.lng
  );

  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth - 50
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore breathtaking destinations curated just for you
            </p>

            <div className="mt-8">
              <Link
                to="/recommendations"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                🎯 Get Personalized Recommendations
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-blue-200 rounded-full opacity-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Destinations Slider */}
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ✨ Featured Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked locations loved by travelers worldwide
            </p>
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide px-2"
            >
              {validDestinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 w-72"
                >
                  <DestinationCard destination={dest} compact={false} />
                </motion.div>
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {validDestinations.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300"
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Map  */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🗺 Explore Map
                </h2>
                <p className="text-gray-600">
                  Explore destinations visually and plan your journey
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              scrollWheelZoom={true}
              style={{
                height: "500px",
                width: "100%",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />

              {validDestinations.map((dest) => (
                <Marker
                  key={dest.id}
                  position={[dest.coordinates.lat, dest.coordinates.lng]}
                >
                  <Popup className="rounded-lg shadow-lg">
                    <div className="p-2">
                      <h3 className="font-bold text-gray-900">{dest.name}</h3>
                      <p className="text-gray-600 text-sm">{dest.country}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {dest.rating} ({dest.reviewCount})
                        </span>
                      </div>
                      <Link
                        to={`/destination/${dest.id}`}
                        className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View details →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
