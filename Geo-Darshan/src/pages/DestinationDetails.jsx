import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToItinerary } from "../redux/destinationSlice";
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
  ChevronRight,
  Eye,
  ThumbsUp,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

// Local storage keys
const FAVORITES_STORAGE_KEY = "destinationFavoritesList";
const COMPARE_STORAGE_KEY = "destinationComparisonList";

// Helper functions for localStorage
const getStoredFavoritesList = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading favorites list from localStorage:", error);
    return [];
  }
};

const getStoredComparisonList = () => {
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading comparison list from localStorage:", error);
    return [];
  }
};

const saveFavoritesList = (list) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Error saving favorites list to localStorage:", error);
  }
};

const saveComparisonList = (list) => {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Error saving comparison list to localStorage:", error);
  }
};

const DestinationDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [favorites, setFavorites] = useState(getStoredFavoritesList());
  const [compareList, setCompareList] = useState(getStoredComparisonList());
  const shareRef = useRef(null);

  const destination = destinations.find((d) => d.id === id);
  const itineraryList = useSelector((state) => state.destination.itineraryList);
  const isInItinerary = itineraryList.includes(destination?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Close share options when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Browse other destinations</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(destination.id);
  const isInComparison = compareList.includes(destination.id);

  const handleFavoriteToggle = () => {
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== destination.id);
    } else {
      newFavorites = [...favorites, destination.id];
    }

    setFavorites(newFavorites);
    saveFavoritesList(newFavorites);
  };

  const handleAddToComparison = () => {
    let newCompareList;

    if (isInComparison) {
      newCompareList = compareList.filter((id) => id !== destination.id);
    } else {
      if (compareList.length >= 3) {
        alert(`You can compare up to 3 destinations only. 
Please remove one from your comparison list first.`);
        return;
      }
      newCompareList = [...compareList, destination.id];
    }

    setCompareList(newCompareList);
    saveComparisonList(newCompareList);
  };

  const handleAddToItinerary = () => {
    if (!isInItinerary) {
      dispatch(addToItinerary(destination.id));
    }
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleSocialShare = (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${destination.name} in ${destination.country} - an amazing travel destination!`;

    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + shareUrl
        )}`;
        break;
      default:
        return;
    }

    window.open(shareLink, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!");
        setShowShareOptions(false);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const reviews = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      text: "Absolutely magical! The sunsets here are unlike anything I've ever seen. The local people are incredibly welcoming and the food is amazing.",
      helpful: 23,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "2",
      author: "Marco Rodriguez",
      rating: 5,
      date: "2024-01-10",
      text: "Perfect romantic getaway. The white buildings against the blue sea create the most beautiful backdrop. Highly recommend staying in Oia.",
      helpful: 18,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "3",
      author: "Emma Chen",
      rating: 4,
      date: "2024-01-05",
      text: "Beautiful destination but can get quite crowded during peak season. The wine tours are fantastic and the local cuisine is exceptional.",
      helpful: 15,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "attractions", label: "Attractions", icon: MapPin },
    { id: "reviews", label: "Reviews", icon: MessageCircle },
  ];

  const colorPalette = [
    "#4F46E5",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#6366F1",
    "#84CC16",
    "#06B6D4",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/recommendations"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Recommendations</span>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group cursor-pointer">
          <div className="relative overflow-hidden">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-64 md:h-96 object-cover rounded-2xl transition-all duration-1000 group-hover:scale-105"
            />

            {/* Floating info badges */}
            <div className="absolute top-6 left-6 flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">TRENDING DESTINATION</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-2xl">
                    {destination.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">{destination.country}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {destination.rating}
                      </span>
                      <span className="text-white/90">
                        ({destination.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                      isFavorite
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    onClick={handleAddToComparison}
                    className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                      isInComparison
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : compareList.length >= 3
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

                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={handleShareClick}
                      className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all duration-300 transform hover:scale-110"
                    >
                      <Share className="w-6 h-6" />
                    </button>

                    {/* Share Options Dropdown */}
                    {showShareOptions && (
                      <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10">
                        <div className="p-3 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-800">
                            Share this destination
                          </h3>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => handleSocialShare("facebook")}
                            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handleSocialShare("twitter")}
                            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => handleSocialShare("linkedin")}
                            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Linkedin className="w-5 h-5 text-blue-700 mr-3" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => handleSocialShare("whatsapp")}
                            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <span className="w-5 h-5 text-gray-600 mr-3">
                              🔗
                            </span>
                            <span>Copy Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            icon={<Calendar className="w-8 h-8" />}
            label="Best Time to Visit"
            value={destination.bestTimeToVisit}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <InfoCard
            icon={<DollarSign className="w-8 h-8" />}
            label="Budget Range"
            value={destination.price}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <InfoCard
            icon={<Star className="w-8 h-8" />}
            label="Rating"
            value={`${destination.rating}/5`}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <InfoCard
            icon={<Users className="w-8 h-8" />}
            label="Total Reviews"
            value={destination.reviewCount.toLocaleString()}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Add to Itinerary Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddToItinerary}
            disabled={isInItinerary}
            className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isInItinerary
                ? "bg-gray-100 text-gray-500 cursor-not-allowed shadow-inner"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            }`}
          >
            <span className="text-lg">
              {isInItinerary ? "✓ Added to Itinerary" : "➕ Add to Itinerary"}
            </span>
            {!isInItinerary && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row space-y-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-5 px-6 font-medium transition-all duration-300 flex items-center justify-center space-x-3 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-lg">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About {destination.name}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {destination.description}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Experience Highlights
                </h3>
                <div className="flex flex-wrap gap-3">
                  {destination.tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="px-5 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-medium rounded-xl border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 cursor-pointer"
                      style={{
                        background: `linear-gradient(45deg, ${
                          colorPalette[
                            (destination.id + index) % colorPalette.length
                          ]
                        }20, ${
                          colorPalette[
                            (destination.id + index + 1) % colorPalette.length
                          ]
                        }20)`,
                        borderColor: `${
                          colorPalette[
                            (destination.id + index) % colorPalette.length
                          ]
                        }40`,
                        color:
                          colorPalette[
                            (destination.id + index) % colorPalette.length
                          ],
                      }}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Must-See Attractions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.attractions.map((attraction, index) => (
                  <div
                    key={attraction}
                    className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 group"
                  >
                    <div
                      className="w-10 h-10 text-white rounded-xl flex items-center justify-center font-bold shadow-lg"
                      style={{
                        backgroundColor:
                          colorPalette[
                            (destination.id + index) % colorPalette.length
                          ],
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {attraction}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Top-rated experience
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                  Traveler Reviews
                </h2>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                  Write a Review
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {review.author}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1">
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
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.text}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">
                          Helpful ({review.helpful})
                        </span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Destinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations
              .filter((d) => d.id !== destination.id)
              .slice(0, 3)
              .map((relatedDest) => (
                <Link
                  key={relatedDest.id}
                  to={`/destination/${relatedDest.id}`}
                  className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedDest.image}
                      alt={relatedDest.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedDest.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{relatedDest.country}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon, label, value, color, bgColor }) => (
  <div
    className={`${bgColor} rounded-2xl p-6 shadow-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
  >
    <div className={`${color} mb-3`}>{icon}</div>
    <p className="text-sm text-gray-600 mb-2">{label}</p>
    <p className="font-bold text-gray-900 text-xl">{value}</p>
  </div>
);

export default DestinationDetails;
