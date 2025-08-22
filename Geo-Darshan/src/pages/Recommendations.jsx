import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { setRecommendations } from "../redux/destinationSlice";
import { setPreferences } from "../redux/preferenceSlice";
import { getRecommendations } from "../utils/recommendationEngine";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Filter, Search, MapPin, Sliders } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Recommendations = () => {
  const dispatch = useDispatch();
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadPrefs = async () => {
      const user = auth.currentUser;
      if (!preferences && user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const prefs = snap.data().preferences;
          dispatch(setPreferences(prefs));
          const recs = getRecommendations(destinations, prefs);
          dispatch(setRecommendations(recs));
        }
      } else if (preferences) {
        const recs = getRecommendations(destinations, preferences);
        dispatch(setRecommendations(recs));
      }
    };

    loadPrefs();
  }, [preferences, dispatch]);

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personalized Recommendations
          </h1>
          <p className="text-xl text-gray-600">
            Destinations curated just for you based on your preferences
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Sliders className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={filters.budget}
                    onChange={(e) =>
                      setFilters({ ...filters, budget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Budgets</option>
                    <option value="$">Budget ($)</option>
                    <option value="$$">Mid-range ($$)</option>
                    <option value="$$$">Premium ($$$)</option>
                    <option value="$$$$">Luxury ($$$$)</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                {/* Tags Filter */}
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
                            ? "bg-blue-600 text-white"
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

        {/* Results Count */}
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

        {/* Map */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Explore on Map
          </h3>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={false}
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "1rem",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRecommendations.map((dest) => (
              <Marker
                key={dest.id}
                position={[dest.coordinates.lat, dest.coordinates.lng]}
              >
                <Popup>
                  <div>
                    <strong>{dest.name}</strong> <br />
                    {dest.country} <br />⭐ {dest.rating} ({dest.reviewCount})
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
