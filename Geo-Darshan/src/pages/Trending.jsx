import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTrending } from "../redux/destinationSlice";
import { getTrendingDestinations } from "../utils/getTrendingDestinations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  TrendingUp,
  Heart,
  Check,
  Plus,
  Star,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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
  isFavorite = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
  rank,
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
    if (onToggleFavorite) onToggleFavorite(destination.id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(destination.id);
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

      {/* Ranking Badge - Top Center Position */}
      {rank && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">#{rank} TRENDING</span>
        </div>
      )}

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

      {/* Heart Icon */}
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

const Trending = () => {
  const dispatch = useDispatch();
  const trending = useSelector((state) => state.destination.trending);
  const [compareList, setCompareList] = useState(getStoredComparisonList());
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const trendingDests = getTrendingDestinations(3);
    dispatch(setTrending(trendingDests));

    // Load favorites from Firebase
    const loadFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.favorites) {
            setFavorites(data.favorites);
          }
        }
      }
    };

    loadFavorites();
  }, [dispatch]);

  const toggleCompare = (destinationId) => {
    let newCompareList;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Trending Destinations
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover what's popular among travelers right now
          </p>
        </div>

        {trending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {trending.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                showCompareButton={true}
                isFavorite={favorites.includes(destination.id)}
                onToggleFavorite={toggleFavorite}
                isInCompare={compareList.includes(destination.id)}
                onToggleCompare={toggleCompare}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading trending destinations...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the latest trends
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Trending;
