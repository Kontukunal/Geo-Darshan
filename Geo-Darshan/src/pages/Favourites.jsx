import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { destinations } from "../data/destinations";
import { setFavorites } from "../redux/destinationSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { gsap } from "gsap";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";

const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (id) => {
    window.location.href = `/destination/${id}`;
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full flex flex-wrap justify-center items-start gap-8 ${className}`}
      style={{
        "--r": `${radius}px`,
        "--x": "50%",
        "--y": "50%",
      }}
    >
      {items.map((destination, i) => (
        <article
          key={destination.id}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(destination.id)}
          className="group relative flex flex-col w-[380px] h-[460px] rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-xl bg-white"
          style={{
            "--card-border": destination.color || "#4F46E5",
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
                <span className="text-sm font-medium">
                  {destination.country}
                </span>
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
            <div className="p-2 bg-white rounded-full shadow-md group-hover:bg-blue-100 transition-colors">
              <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover:fill-red-600 group-hover:text-red-600 transition-colors" />
            </div>
          </div>
        </article>
      ))}

      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: "grayscale(0.3) brightness(0.98)",
          WebkitBackdropFilter: "grayscale(0.3) brightness(0.98)",
          background: "rgba(255,255,255,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.20) 75%, rgba(0,0,0,0.25) 88%, white 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.20) 75%, rgba(0,0,0,0.25) 88%, white 100%)",
        }}
      />

      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: "grayscale(0.3) brightness(0.98)",
          WebkitBackdropFilter: "grayscale(0.3) brightness(0.98)",
          background: "rgba(255,255,255,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.70) 75%, rgba(255,255,255,0.60) 88%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.70) 75%, rgba(255,255,255,0.60) 88%, transparent 100%)",
          opacity: 1,
        }}
      />
    </div>
  );
};

const Favourites = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [favDestinations, setFavDestinations] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const userData = snap.data();
        const favIds = userData.favorites || [];
        dispatch(setFavorites(favIds));

        const favs = destinations.filter((d) => favIds.includes(d.id));
        setFavDestinations(favs);
      }

      setLoading(false);
    };

    loadFavorites();
  }, [dispatch]);

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

  const enhancedFavs = favDestinations.map((dest, index) => ({
    ...dest,
    color: colorPalette[index % colorPalette.length],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Favorite Destinations
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            All the beautiful places you've saved for your next adventure
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading your favorites...</p>
            </div>
          </div>
        ) : enhancedFavs.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {favDestinations.length} Saved{" "}
                {favDestinations.length === 1 ? "Destination" : "Destinations"}
              </h2>
            </div>
            <ChromaGrid items={enhancedFavs} radius={400} />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl mb-6 hover:from-blue-100 hover:to-indigo-100 transition-colors">
              <Heart className="w-12 h-12 text-blue-400 hover:text-blue-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't added any destinations to your favorites. Start
              exploring and save your dream destinations for later!
            </p>
            <a
              href="/recommendations"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-blue-200 hover:shadow-blue-300 hover:shadow-lg transition-all duration-300"
            >
              Explore Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favourites;
