import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { setRecommendations } from "../redux/destinationSlice";
import { setPreferences } from "../redux/preferenceSlice";
import { getRecommendations } from "../utils/recommendationEngine";
import { destinations } from "../data/destinations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  MapPin,
  Sliders,
  Heart,
  Star,
  ArrowRight,
  X,
  Check,
  Plus,
  Palette,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useNavigate } from "react-router-dom";

// Custom marker icons with different colors
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

// Color and emoji combinations for markers
const markerStyles = [
  { color: "#3B82F6", emoji: "🏖️" }, // Beach - Blue
  { color: "#10B981", emoji: "🏔️" }, // Mountain - Green
  { color: "#F59E0B", emoji: "🏛️" }, // Cultural - Amber
  { color: "#EF4444", emoji: "🌋" }, // Adventure - Red
  { color: "#8B5CF6", emoji: "🌃" }, // City - Purple
  { color: "#EC4899", emoji: "🏝️" }, // Island - Pink
  { color: "#14B8A6", emoji: "🏜️" }, // Desert - Teal
  { color: "#F97316", emoji: "❄️" }, // Snow - Orange
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

const COMPARE_STORAGE_KEY = "destinationComparisonList";

const getStoredComparisonList = () => {
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading comparison list from localStorage:", error);
    return [];
  }
};

const saveComparisonList = (list) => {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Error saving comparison list to localStorage:", error);
  }
};

const DestinationCard = ({
  destination,
  showCompareButton = false,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
}) => {
  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleCardClick = (id) => {
    window.location.href = `/destination/${id}`;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(destination.id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onToggleCompare(destination.id);
  };

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

  const destinationColor = colorPalette[destination.id % colorPalette.length];

  return (
    <article
      key={destination.id}
      onMouseMove={handleCardMove}
      onClick={() => handleCardClick(destination.id)}
      className="group relative flex flex-col w-full h-[460px] rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-xl bg-white"
      style={{
        "--card-border": destinationColor,
        "--spotlight-color": "rgba(59, 130, 246, 0.25)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        borderColor: "rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex-1 p-4 box-border overflow-hidden">
        <div className="relative w-full h-56 rounded-xl overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full group-hover:bg-blue-50 transition-colors">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-gray-800 text-sm font-medium group-hover:text-blue-700 transition-colors">
              {destination.rating}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center text-white">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{destination.country}</span>
          </div>
        </div>

        <div className="mt-5 text-gray-800">
          <h3 className="text-2xl font-bold mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {destination.name}
          </h3>
          <p className="text-gray-600 text-base mb-4 line-clamp-2">
            {destination.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-bold text-indigo-600 group-hover:text-blue-700 transition-colors">
                ${destination.price}
              </span>
              <span className="text-gray-500 text-sm ml-1">/person</span>
            </div>

            <div className="flex items-center text-base bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-20 group-hover:scale-110 transition-transform">
        <button
          onClick={handleFavoriteClick}
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {showCompareButton && (
        <div className="absolute top-20 left-6 z-20 group-hover:scale-110 transition-transform">
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isInCompare
                ? "bg-green-100 text-green-600"
                : "bg-white text-gray-400 hover:bg-blue-100"
            }`}
          >
            {isInCompare ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </article>
  );
};

const Recommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const preferences = useSelector((state) => state.preference.preferences);
  const recommendations = useSelector(
    (state) => state.destination.recommendations
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    budget: "",
    rating: "",
    tags: [],
  });

  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState(getStoredComparisonList());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadPrefsAndFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();

          if (!preferences && data.preferences) {
            dispatch(setPreferences(data.preferences));
            const recs = getRecommendations(destinations, data.preferences);
            dispatch(setRecommendations(recs));
          }

          if (data.favorites) {
            setFavorites(data.favorites);
          }
        }
      } else if (preferences) {
        const recs = getRecommendations(destinations, preferences);
        dispatch(setRecommendations(recs));
      }
    };

    loadPrefsAndFavorites();
  }, [preferences, dispatch]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === COMPARE_STORAGE_KEY) {
        setCompareList(getStoredComparisonList());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = async (destinationId) => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      if (favorites.includes(destinationId)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(destinationId),
        });
        setFavorites((prev) => prev.filter((id) => id !== destinationId));
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(destinationId),
        });
        setFavorites((prev) => [...prev, destinationId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const toggleCompare = (destinationId) => {
    let newCompareList;
    const destination = destinations.find((d) => d.id === destinationId);

    if (compareList.includes(destinationId)) {
      newCompareList = compareList.filter((id) => id !== destinationId);
    } else {
      if (compareList.length >= 3) {
        alert(`You can compare up to 3 destinations only. 
Please remove one from your comparison list first.`);
        return;
      }
      newCompareList = [...compareList, destinationId];
    }

    setCompareList(newCompareList);
    saveComparisonList(newCompareList);
  };

  const handleClearCompare = () => {
    setCompareList([]);
    saveComparisonList([]);
  };

  const handleCompareNow = () => {
    navigate("/comparision");
  };

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBudget = !filters.budget || dest.price === filters.budget;
      const matchesRating =
        !filters.rating || dest.rating >= parseFloat(filters.rating);
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => dest.tags.includes(tag));

      return matchesSearch && matchesBudget && matchesRating && matchesTags;
    });
  }, [recommendations, searchTerm, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedRecommendations = filteredRecommendations.slice(
    startIdx,
    endIdx
  );

  const allTags = Array.from(
    new Set(recommendations.flatMap((dest) => dest.tags))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Personalized Recommendations
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Destinations curated just for you based on your preferences
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-700">
                {compareList.length} destination(s) selected for comparison
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCompareNow}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Compare Now
              </button>
              <button
                onClick={handleClearCompare}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 hover:bg-white transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors"
            >
              <Sliders className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={filters.budget}
                    onChange={(e) =>
                      setFilters({ ...filters, budget: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 hover:bg-white transition-colors"
                  >
                    <option value="">All Budgets</option>
                    <option value="$">Budget ($)</option>
                    <option value="$$">Mid-range ($$)</option>
                    <option value="$$$">Premium ($$$)</option>
                    <option value="$$$$">Luxury ($$$$)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 hover:bg-white transition-colors"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = filters.tags.includes(tag)
                            ? filters.tags.filter((t) => t !== tag)
                            : [...filters.tags, tag];
                          setFilters({ ...filters, tags: newTags });
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filters.tags.includes(tag)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredRecommendations.length} destinations
          </p>
          {preferences && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <MapPin className="w-4 h-4" />
              <span>Based on your preferences</span>
            </div>
          )}
        </div>

        {paginatedRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedRecommendations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                showCompareButton={true}
                isFavorite={favorites.includes(destination.id)}
                onToggleFavorite={toggleFavorite}
                isInCompare={compareList.includes(destination.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Enhanced Map Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden border border-cyan-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  Explore on Map
                </span>
              </h3>
              <p className="text-gray-600">
                Discover your recommended destinations visually
              </p>
            </div>
          </div>

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
            {/* Cool blue-themed map tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* Water color enhancement */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              opacity={0.3}
            />

            {filteredRecommendations.map((dest, index) => {
              const style = markerStyles[index % markerStyles.length];
              return (
                <Marker
                  key={dest.id}
                  position={[dest.coordinates.lat, dest.coordinates.lng]}
                  icon={createCustomIcon(style.color, style.emoji)}
                >
                  <Popup className="custom-popup rounded-xl border-0 shadow-2xl">
                    <div className="w-80 p-0 overflow-hidden">
                      {/* Popup Image */}
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

                      {/* Popup Content */}
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
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
