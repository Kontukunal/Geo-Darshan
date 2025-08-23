import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromComparison,
  clearComparison,
} from "../redux/destinationSlice";
import { destinations } from "../data/destinations";
import {
  BarChart3,
  X,
  Star,
  DollarSign,
  MapPin,
  Clock,
  Heart,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Comparison = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const comparisonList = useSelector(
    (state) => state.destination.comparisonList
  );

  const [comparisonDestinations, setComparisonDestinations] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(
      localStorage.getItem("destinationComparisonList") || "[]"
    );

    const effectiveList =
      comparisonList.length > 0 ? comparisonList : storedList;

    const destinationsToCompare = destinations.filter((dest) =>
      effectiveList.includes(dest.id)
    );

    setComparisonDestinations(destinationsToCompare);
  }, [comparisonList]);

  const handleRemove = (id) => {
    dispatch(removeFromComparison(id));

    const storedList = JSON.parse(
      localStorage.getItem("destinationComparisonList") || "[]"
    );
    const newList = storedList.filter((item) => item !== id);
    localStorage.setItem("destinationComparisonList", JSON.stringify(newList));
  };

  const handleClearAll = () => {
    dispatch(clearComparison());
    localStorage.setItem("destinationComparisonList", JSON.stringify([]));
  };

  const handleBackToRecommendations = () => {
    navigate("/recommendations");
  };

  const comparisonMetrics = [
    {
      key: "rating",
      label: "Rating",
      icon: Star,
      format: (value) => `${value}/5`,
      color: "text-amber-500",
    },
    {
      key: "price",
      label: "Budget",
      icon: DollarSign,
      format: (value) => value,
      color: "text-green-500",
    },
    {
      key: "reviewCount",
      label: "Reviews",
      icon: MapPin,
      format: (value) => value.toLocaleString(),
      color: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
              <BarChart3 className="relative w-12 h-12 text-white p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Compare Destinations
              </span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Side-by-side comparison to help you make the perfect choice
          </p>
        </div>

        {comparisonDestinations.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <p className="text-gray-600 text-lg">
                Comparing{" "}
                <span className="font-semibold text-blue-600">
                  {comparisonDestinations.length}
                </span>{" "}
                destination
                {comparisonDestinations.length !== 1 ? "s" : ""}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleBackToRecommendations}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Recommendations</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <X className="w-5 h-5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              {/* Header Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 font-semibold text-gray-900 text-lg">
                  Comparison Metrics
                </div>
                {comparisonDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="relative p-8 border-l border-gray-200 group hover:bg-blue-50/30 transition-colors duration-200"
                  >
                    <button
                      onClick={() => handleRemove(dest.id)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm hover:shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                      />
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {dest.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              {comparisonMetrics.map((metric) => (
                <div
                  key={metric.key}
                  className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 group hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 flex items-center space-x-3">
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    <span className="font-semibold text-gray-900 text-lg">
                      {metric.label}
                    </span>
                  </div>
                  {comparisonDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="p-6 border-l border-gray-200 flex items-center justify-center"
                    >
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.format(dest[metric.key])}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 group hover:bg-gray-50/50 transition-colors duration-200">
                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 font-semibold text-gray-900 text-lg flex items-center">
                  Description
                </div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <p className="text-gray-700 leading-relaxed line-clamp-4">
                      {dest.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Best Time to Visit */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 group hover:bg-gray-50/50 transition-colors duration-200">
                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <span className="font-semibold text-gray-900 text-lg">
                    Best Time
                  </span>
                </div>
                {comparisonDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="p-6 border-l border-gray-200 flex items-center justify-center"
                  >
                    <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                      {dest.bestTimeToVisit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 group hover:bg-gray-50/50 transition-colors duration-200">
                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 font-semibold text-gray-900 text-lg flex items-center">
                  Highlights
                </div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {dest.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <Link
                      to={`/destination/${dest.id}`}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
              <BarChart3 className="relative w-24 h-24 text-gray-300 mx-auto p-4 bg-white rounded-2xl shadow-inner" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No destinations to compare
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              Add destinations to your comparison list by clicking the "+"
              button on destination cards. You can compare up to 3 destinations
              at once.
            </p>

            <button
              onClick={handleBackToRecommendations}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-6 h-6" />
              <span className="text-lg">Browse Destinations</span>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Comparison;
