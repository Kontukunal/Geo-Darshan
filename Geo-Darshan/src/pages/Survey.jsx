// Survey.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPreferences } from "../redux/preferenceSlice";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  Mountain,
  Waves,
  Building,
  TreePine,
  Camera,
  Utensils,
  Heart,
  Users,
  DollarSign,
} from "lucide-react";
import Footer from "../components/Footer";
import Stepper, { Step } from "../components/Stepper";
import { motion } from "framer-motion";

const Survey = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [preferences, setPreferencesState] = useState({
    interests: [],
    activities: [],
    budget: "",
  });

  const steps = [
    {
      title: "What interests you most?",
      subtitle: "Select all that apply",
      key: "interests",
      multiple: true,
      options: [
        {
          value: "adventure",
          label: "Adventure",
          icon: Mountain,
          color: "#4f46e5",
        },
        { value: "beach", label: "Beach", icon: Waves, color: "#0ea5e9" },
        {
          value: "culture",
          label: "Culture",
          icon: Building,
          color: "#f59e0b",
        },
        { value: "nature", label: "Nature", icon: TreePine, color: "#10b981" },
        {
          value: "photography",
          label: "Photography",
          icon: Camera,
          color: "#ec4899",
        },
        { value: "food", label: "Food", icon: Utensils, color: "#ef4444" },
        { value: "romantic", label: "Romantic", icon: Heart, color: "#db2777" },
        {
          value: "nightlife",
          label: "Nightlife",
          icon: Users,
          color: "#8b5cf6",
        },
      ],
    },
    {
      title: "What activities excite you?",
      subtitle: "Select your favorite activities",
      key: "activities",
      multiple: true,
      options: [
        { value: "hiking", label: "Hiking", icon: Mountain, color: "#10b981" },
        { value: "diving", label: "Diving", icon: Waves, color: "#0ea5e9" },
        {
          value: "sightseeing",
          label: "Sightseeing",
          icon: Camera,
          color: "#f59e0b",
        },
        { value: "wellness", label: "Wellness", icon: Heart, color: "#db2777" },
        {
          value: "wildlife",
          label: "Wildlife",
          icon: TreePine,
          color: "#10b981",
        },
        {
          value: "architecture",
          label: "Architecture",
          icon: Building,
          color: "#ef4444",
        },
        {
          value: "history",
          label: "History",
          icon: Building,
          color: "#f59e0b",
        },
        { value: "scenic", label: "Scenic", icon: Camera, color: "#0ea5e9" },
      ],
    },
    {
      title: "What's your travel budget?",
      subtitle: "Estimate per person",
      key: "budget",
      multiple: false,
      options: [
        {
          value: "budget",
          label: "Budget ($)",
          icon: DollarSign,
          color: "#10b981",
        },
        {
          value: "mid-range",
          label: "Mid-range ($$)",
          icon: DollarSign,
          color: "#f59e0b",
        },
        {
          value: "luxury",
          label: "Luxury ($$$)",
          icon: DollarSign,
          color: "#ef4444",
        },
        {
          value: "ultra-luxury",
          label: "Ultra Luxury ($$$$)",
          icon: DollarSign,
          color: "#8b5cf6",
        },
      ],
    },
  ];

  const handleOptionSelect = (key, value, isMultiple) => {
    if (isMultiple) {
      const currentArray = preferences[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      setPreferencesState({
        ...preferences,
        [key]: newArray,
      });
    } else {
      setPreferencesState({
        ...preferences,
        [key]: value,
      });
    }
  };

  const isOptionSelected = (key, value, isMultiple) => {
    if (isMultiple) {
      return (preferences[key] || []).includes(value);
    }
    return preferences[key] === value;
  };

  const handleFinalStepCompleted = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            preferences,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        dispatch(setPreferences(preferences));
        navigate("/dashboard");
      } else {
        alert("User not logged in");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  const renderStepContent = (stepIndex) => {
    const stepData = steps[stepIndex];
    const isMultiple = stepData.multiple;

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {stepData.title}
        </h2>
        <p className="text-gray-500 text-lg mb-8">{stepData.subtitle}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stepData.options.map((option) => {
            const Icon = option.icon;
            const isSelected = isOptionSelected(
              stepData.key,
              option.value,
              isMultiple
            );

            return (
              <motion.button
                key={option.value}
                onClick={() =>
                  handleOptionSelect(stepData.key, option.value, isMultiple)
                }
                className={`p-4 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center h-28 ${
                  isSelected
                    ? "border-white shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${option.color}15, ${option.color}25)`
                    : "#ffffff",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`p-2 rounded-full mb-2 ${
                    isSelected ? "bg-opacity-20" : "bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? `${option.color}33`
                      : undefined,
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isSelected ? option.color : "#9ca3af" }}
                  />
                </div>
                <p
                  className={`font-medium text-sm ${
                    isSelected ? "text-gray-800" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleFinalStepCompleted}
          nextButtonText="Next"
          backButtonText="Previous"
          stepContainerClassName="justify-center"
          contentClassName="min-h-[300px]"
        >
          <Step>{renderStepContent(0)}</Step>
          <Step>{renderStepContent(1)}</Step>
          <Step>{renderStepContent(2)}</Step>
        </Stepper>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors underline"
          >
            Skip survey and explore destinations
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Survey;
