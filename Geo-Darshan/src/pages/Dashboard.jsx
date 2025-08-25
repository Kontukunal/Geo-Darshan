import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, MapPin, Heart, Navigation, Palette } from "lucide-react";

const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, ${color}00);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        transform: translateY(-2px);
        transition: all 0.3s ease;
      ">
        <div style="
          background: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        ">
          ${emoji}
        </div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const markerStyles = [
  { color: "#3B82F6", emoji: "🏖️" },
  { color: "#10B981", emoji: "🏔️" },
  { color: "#F59E0B", emoji: "🏛️" },
  { color: "#EF4444", emoji: "🌋" },
  { color: "#8B5CF6", emoji: "🌃" },
  { color: "#EC4899", emoji: "🏝️" },
  { color: "#14B8A6", emoji: "🏜️" },
  { color: "#F97316", emoji: "❄️" },
];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <img
            src="https://images.pexels.com/photos/10618962/pexels-photo-10618962.jpeg"
            alt="Relaxing beach destination"
            className="w-full h-64 md:h-96 object-cover rounded-2xl"
          />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
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
                <Navigation className="w-5 h-5 mr-2" />
                Get Personalized Recommendations
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
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Featured Destinations
              </span>
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
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden border border-cyan-200">
          <div className="p-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    Explore Our World
                  </span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Discover amazing destinations across the globe with our
                  interactive map
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
                borderRadius: "1rem",
                border: "2px solid rgba(6, 182, 212, 0.3)",
                boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.2)",
              }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              />

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                opacity={0.3}
              />

              {validDestinations.map((dest, index) => {
                const style = markerStyles[index % markerStyles.length];
                return (
                  <Marker
                    key={dest.id}
                    position={[dest.coordinates.lat, dest.coordinates.lng]}
                    icon={createCustomIcon(style.color, style.emoji)}
                  >
                    <Popup className="custom-popup rounded-xl border-0 shadow-2xl">
                      <div className="w-80 p-0 overflow-hidden">
                        <div className="relative">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                            </button>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              #{index + 1}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {dest.name}
                              </h3>
                              <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-cyan-600" />
                                {dest.country}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 bg-cyan-50 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-cyan-800">
                                {dest.rating}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                            {dest.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-cyan-600">
                              ${dest.price}
                              <span className="text-gray-500 text-sm ml-1">
                                /person
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {dest.reviewCount} reviews
                            </div>
                          </div>

                          <Link
                            to={`/destination/${dest.id}`}
                            className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105"
                          >
                            Explore Destination
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
