import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromComparison,
  clearComparison,
} from "../redux/destinationSlice";
import { destinations } from "../data/destinations";
import { BarChart3, X, Star, DollarSign, MapPin, Clock } from "lucide-react";
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
    },
    {
      key: "price",
      label: "Budget",
      icon: DollarSign,
      format: (value) => value,
    },
    {
      key: "reviewCount",
      label: "Reviews",
      icon: MapPin,
      format: (value) => value.toLocaleString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Compare Destinations
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Side-by-side comparison to help you make the perfect choice
          </p>
        </div>

        {comparisonDestinations.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Comparing {comparisonDestinations.length} destination
                {comparisonDestinations.length !== 1 ? "s" : ""}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBackToRecommendations}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Recommendations
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <div className="p-6 bg-gray-50 font-semibold text-gray-900">
                  Compare
                </div>
                {comparisonDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="relative p-6 border-l border-gray-200"
                  >
                    <button
                      onClick={() => handleRemove(dest.id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mb-4">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-bold text-lg text-gray-900">
                        {dest.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{dest.country}</p>
                    </div>
                  </div>
                ))}
              </div>

              {comparisonMetrics.map((metric) => (
                <div
                  key={metric.key}
                  className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200"
                >
                  <div className="p-6 bg-gray-50 flex items-center space-x-2">
                    <metric.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {metric.label}
                    </span>
                  </div>
                  {comparisonDestinations.map((dest) => (
                    <div key={dest.id} className="p-6 border-l border-gray-200">
                      <span className="text-gray-900 font-medium">
                        {metric.format(dest[metric.key])}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <div className="p-6 bg-gray-50 font-medium text-gray-900">
                  Description
                </div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <p className="text-gray-700 text-sm">{dest.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <div className="p-6 bg-gray-50 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Best Time</span>
                </div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <span className="text-gray-900 font-medium">
                      {dest.bestTimeToVisit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <div className="p-6 bg-gray-50 font-medium text-gray-900">
                  Highlights
                </div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {dest.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-6 bg-gray-50"></div>
                {comparisonDestinations.map((dest) => (
                  <div key={dest.id} className="p-6 border-l border-gray-200">
                    <Link
                      to={`/destination/${dest.id}`}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
            <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No destinations to compare
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Add destinations to your comparison list by clicking the "+"
              button on destination cards. You can compare up to 3 destinations
              at once.
            </p>

            <button
              onClick={handleBackToRecommendations}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              <span>Browse Destinations</span>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Comparison;
