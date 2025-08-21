import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { MapPin, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Save additional user info in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
      });

      navigate("/survey");
    } catch (error) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Image (on top for mobile, on left for desktop) */}
      <div className="w-full lg:w-1/2 h-1/3 lg:h-full relative order-1 lg:order-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fe6427]/10 to-[#fde325]/10"></div>
        <img
          src="https://images.unsplash.com/photo-1601823984263-b87b59798b70?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 lg:bottom-10 lg:left-10 text-white max-w-md">
          <h3 className="text-xl lg:text-2xl font-bold mb-2">
            Begin Your Journey
          </h3>
          <p className="text-white/90 text-sm lg:text-base">
            Sign up to unlock personalized travel experiences around the world.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-8 order-0 lg:order-1 overflow-y-auto">
        <div className="max-w-md w-full space-y-6 lg:space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 mb-4 lg:mb-6"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#04d5f2] to-[#43ee17] rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#050404]">
                Geo Darshan
              </span>
            </Link>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#050404] mb-2">
              Create your account
            </h2>
            <p className="text-[#6b7280] text-sm lg:text-base">
              Start your personalized travel journey today
            </p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 border border-[#f1f5f9]">
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-xs lg:text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs lg:text-sm font-medium text-[#050404] mb-1 lg:mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-[#d4d8dd]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-9 lg:pl-10 pr-3 py-2 lg:py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#04d5f2] focus:border-transparent transition-colors duration-300 text-sm lg:text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs lg:text-sm font-medium text-[#050404] mb-1 lg:mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-[#d4d8dd]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-9 lg:pl-10 pr-9 lg:pr-10 py-2 lg:py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#04d5f2] focus:border-transparent transition-colors duration-300 text-sm lg:text-base"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#d4d8dd] hover:text-[#04d5f2] transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs lg:text-sm font-medium text-[#050404] mb-1 lg:mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-[#d4d8dd]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-9 lg:pl-10 pr-9 lg:pr-10 py-2 lg:py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#04d5f2] focus:border-transparent transition-colors duration-300 text-sm lg:text-base"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#d4d8dd] hover:text-[#04d5f2] transition-colors duration-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-3 w-3 lg:h-4 lg:w-4 text-[#04d5f2] focus:ring-[#04d5f2] border-[#e2e8f0] rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-xs lg:text-sm text-[#6b7280]"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-[#04d5f2] hover:text-[#43ee17] transition-colors duration-300"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#04d5f2] to-[#43ee17] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-md"
               >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-[#050404] mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-[#6b7280] text-xs lg:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#04d5f2] hover:text-[#43ee17] font-medium transition-colors duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
