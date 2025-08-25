import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  TrendingUp,
  Compass,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  addToFavorites,
  removeFromFavorites,
  addToComparison,
} from "../redux/destinationSlice";
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const DestinationCard = ({
  destination,
  showCompareButton = false,
  compact = false,
}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.destination.favorites || []);
  const comparisonList = useSelector(
    (state) => state.destination.comparisonList || []
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorite = favorites.includes(destination.id);
  const isInComparison = comparisonList.includes(destination.id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    if (isFavorite) {
      dispatch(removeFromFavorites(destination.id));
      await updateDoc(userRef, {
        favorites: arrayRemove(destination.id),
      });
    } else {
      dispatch(addToFavorites(destination.id));
      await updateDoc(userRef, {
        favorites: arrayUnion(destination.id),
      });
    }
  };

  const handleAddToComparison = (e) => {
    e.preventDefault();
    if (!isInComparison && comparisonList.length < 3) {
      dispatch(addToComparison(destination.id));
    }
  };

  const generateGradient = (name) => {
    const colors = [
      "from-blue-500/20 to-cyan-400/20",
      "from-emerald-500/20 to-teal-400/20",
      "from-violet-500/20 to-purple-400/20",
      "from-amber-500/20 to-orange-400/20",
      "from-rose-500/20 to-pink-400/20",
    ];

    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border-0 relative ${
        compact ? "w-72" : "w-full"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${generateGradient(
          destination.name
        )} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}
      ></div>

      <div className="relative z-10">
        <div className="relative overflow-hidden">
          <div
            className={`w-full ${
              compact ? "h-44" : "h-60"
            } bg-gradient-to-br from-slate-100 to-slate-200 ${
              !imageLoaded ? "animate-pulse" : ""
            }`}
          >
            <img
              src={destination.image}
              alt={destination.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center space-x-1 shadow-sm border border-white">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="font-bold text-gray-800 text-sm">
              {destination.rating}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex space-x-2">
            {showCompareButton && (
              <button
                onClick={handleAddToComparison}
                disabled={isInComparison || comparisonList.length >= 3}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isInComparison
                    ? "bg-emerald-500 text-white shadow-md"
                    : comparisonList.length >= 3
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 shadow-sm"
                }`}
                title={
                  isInComparison ? "Added to comparison" : "Add to comparison"
                }
              >
                {isInComparison ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {destination.reviewCount > 100 && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center">
                <Compass className="w-3 h-3 mr-1" />
                <span>Trending</span>
              </div>
            </div>
          )}
        </div>

        <div className={`${compact ? "p-4" : "p-5"}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3
                className={`${
                  compact ? "text-lg" : "text-xl"
                } font-bold text-gray-900 mb-1 group-hover:text-slate-800 transition-colors`}
              >
                {destination.name}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{destination.country}</span>
              </div>
            </div>
          </div>

=          <div className="flex items-center mb-4">
            <div className="flex items-center text-gray-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 mr-1 text-amber-500 fill-current" />
              <span className="text-xs font-medium">
                {destination.reviewCount} reviews
              </span>
            </div>
          </div>

          {!compact && (
            <>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {destination.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {destination.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {destination.tags.length > 3 && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-colors">
                    +{destination.tags.length - 3}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="flex justify-center mt-6">
            <Link
              to={`/destination/${destination.id}`}
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 group-hover:shadow-md"
            >
              Explore Destination
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
