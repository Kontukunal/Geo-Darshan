// Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logoutUser } from "../redux/authSlice";
import CardNav from "./CardNav";
import {
  MapPin,
  Heart,
  Calendar,
  BarChart3,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    {
      label: "Explore",
      links: [
        {
          label: "Discover",
          href: "/recommendations",
          ariaLabel: "Go to Recommendations",
          icon: MapPin,
        },
        {
          label: "Preferences",
          href: "/survey",
          ariaLabel: "Go to Preferences",
          icon: SlidersHorizontal,
        },
      ],
      bgColor: "#e0f2fe",
      textColor: "#0c4a6e",
    },
    {
      label: "Trip Planner",
      links: [
        {
          label: "Favourites",
          href: "/favourites",
          ariaLabel: "Go to Favourites",
          icon: Heart,
        },
        {
          label: "Itineraries",
          href: "/itineraries",
          ariaLabel: "Go to Itineraries",
          icon: Calendar,
        },
      ],
      bgColor: "#eef2ff",
      textColor: "#312e81",
    },
    {
      label: "Analytics",
      links: [
        {
          label: "Compare",
          href: "/comparision",
          ariaLabel: "Go to Comparison",
          icon: BarChart3,
        },
        {
          label: "Trending",
          href: "/trending",
          ariaLabel: "Go to Trending",
          icon: TrendingUp,
        },
      ],
      bgColor: "#f0fdf4",
      textColor: "#14532d",
    },
  ];

  return (
    <div className="navbar-container">
      <CardNav
        items={navLinks}
        buttonLabel="Logout"
        onButtonClick={handleLogout}
        className="z-50"
      />
    </div>
  );
};

export default Navbar;
