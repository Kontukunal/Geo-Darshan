import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, Star, MapPin, DollarSign, Plus, Check } from "lucide-react";
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

  return (
    <div
      className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
        compact ? "w-64" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <div
          className={`w-full ${compact ? "h-36" : "h-64"} bg-gray-200 ${
            !imageLoaded ? "animate-pulse" : ""
          }`}
        >
          <img
            src={destination.image}
            alt={destination.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleFavoriteToggle}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {showCompareButton && (
            <button
              onClick={handleAddToComparison}
              disabled={isInComparison || comparisonList.length >= 3}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isInComparison
                  ? "bg-green-500 text-white"
                  : comparisonList.length >= 3
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-blue-500"
              }`}
            >
              {isInComparison ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {!compact && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-800">
                {destination.price}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className={`${compact ? "p-4" : "p-6"}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className={`${
                compact ? "text-base" : "text-xl"
              } font-bold text-gray-900 mb-1`}
            >
              {destination.name}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{destination.country}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span
              className={`font-semibold text-gray-900 ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              {destination.rating}
            </span>
            <span className="text-sm text-gray-500">
              ({destination.reviewCount})
            </span>
          </div>
        </div>

        {!compact && (
          <>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {destination.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {destination.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {destination.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{destination.tags.length - 3} more
                </span>
              )}
            </div>

            <Link
              to={`/destination/${destination.id}`}
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Explore Destination
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
