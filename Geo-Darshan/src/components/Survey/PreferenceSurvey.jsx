// src/components/Survey/PreferenceSurvey.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const PreferenceSurvey = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    travelStyle: "",
    budget: "",
    interests: [],
    activities: [],
    companions: "",
    duration: "",
  });

  const travelStyles = [
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "relaxation", label: "Relaxation", icon: "🏖️" },
    { id: "cultural", label: "Cultural", icon: "🏛️" },
    { id: "luxury", label: "Luxury", icon: "✨" },
    { id: "backpacking", label: "Backpacking", icon: "🎒" },
  ];

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-light text-white">
                Travel Preferences
              </h2>
              <span className="text-primary-400">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Travel Style */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">
                What's your travel style?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleInputChange("travelStyle", style.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.travelStyle === style.id
                        ? "border-primary-500 bg-primary-500/10 text-white"
                        : "border-dark-700 bg-dark-800/50 text-dark-300 hover:border-primary-400/50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="text-sm font-medium">{style.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-dark-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 rounded-lg border border-dark-700 text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-400/50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === 5}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
            >
              {currentStep === 5 ? "Complete" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PreferenceSurvey;
