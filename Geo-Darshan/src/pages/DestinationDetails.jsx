import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  addToComparison,
  addToItinerary,
} from "../redux/destinationSlice";
import { destinations } from "../data/destinations";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Star,
  Heart,
  Share,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  Plus,
  Check,
} from "lucide-react";
import { useState } from "react";

const DestinationDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.destination.favorites);
  const comparisonList = useSelector(
    (state) => state.destination.comparisonList
  );
  const [activeTab, setActiveTab] = useState("overview");

  const destination = destinations.find((d) => d.id === id);
  const itineraryList = useSelector((state) => state.destination.itineraryList);
  const isInItinerary = itineraryList.includes(destination.id);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Destination not found
          </h1>
          <Link
            to="/recommendations"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse other destinations
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(destination.id);
  const isInComparison = comparisonList.includes(destination.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(destination.id));
    } else {
      dispatch(addToFavorites(destination.id));
    }
  };

  const handleAddToComparison = () => {
    dispatch(addToComparison(destination.id));
  };

  const reviews = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      text: "Absolutely magical! The sunsets here are unlike anything I've ever seen. The local people are incredibly welcoming and the food is amazing.",
      helpful: 23,
    },
    {
      id: "2",
      author: "Marco Rodriguez",
      rating: 5,
      date: "2024-01-10",
      text: "Perfect romantic getaway. The white buildings against the blue sea create the most beautiful backdrop. Highly recommend staying in Oia.",
      helpful: 18,
    },
    {
      id: "3",
      author: "Emma Chen",
      rating: 4,
      date: "2024-01-05",
      text: "Beautiful destination but can get quite crowded during peak season. The wine tours are fantastic and the local cuisine is exceptional.",
      helpful: 15,
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "attractions", label: "Attractions" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/recommendations"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Recommendations</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {destination.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{destination.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">
                        {destination.rating}
                      </span>
                      <span className="text-white/80">
                        ({destination.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-lg font-semibold">
                      {destination.price}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    onClick={handleAddToComparison}
                    disabled={isInComparison || comparisonList.length >= 3}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isInComparison
                        ? "bg-green-500 text-white"
                        : comparisonList.length >= 3
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {isInComparison ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Plus className="w-6 h-6" />
                    )}
                  </button>

                  <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200">
                    <Share className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <InfoCard
            icon={<Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />}
            label="Best Time"
            value={destination.bestTimeToVisit}
          />
          <InfoCard
            icon={
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            }
            label="Budget Range"
            value={destination.price}
          />
          <InfoCard
            icon={<Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />}
            label="Rating"
            value={`${destination.rating}/5`}
          />
          <InfoCard
            icon={<Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />}
            label="Reviews"
            value={destination.reviewCount.toLocaleString()}
          />
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              if (!isInItinerary) dispatch(addToItinerary(destination.id));
            }}
            disabled={isInItinerary}
            className={`inline-flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold transition-all ${
              isInItinerary
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <span>
              {isInItinerary ? "✔ Added to Itinerary" : "➕ Add to Itinerary"}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-0 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {destination.name}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {destination.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Highlights
                </h3>
                <div className="flex flex-wrap gap-3">
                  {destination.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attractions" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Top Attractions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.attractions.map((attraction, index) => (
                  <div
                    key={attraction}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {attraction}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Must-visit attraction
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Write Review
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.author}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.text}</p>
                    <button className="text-gray-500 text-sm hover:text-gray-700">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
    {icon}
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default DestinationDetails;
