import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  MessageCircle,
  Users,
  Shield,
  Zap,
  Cpu,
  Network,
  Import,
  ArrowRight,
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ResetPassword from "./ResetPassword";
// Vanta.js 3D Background Effects
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min";

const Auth = () => {
  // All your existing state (unchanged)
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const { setUserInfo } = useStore();
  const navigate = useNavigate();

  // Vanta.js setup
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  // Initialize Vanta.js 3D Background
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        RINGS({
          el: vantaRef.current, // DOM node
          THREE, // pass THREE instance

          // Controls
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,

          // Performance scaling
          scale: 1.0,
          scaleMobile: 1.0,

          // Theme colors
          color: 0x1a1a2e, // ring color
          backgroundColor: 0x0f0f23, // background

          // RINGS-specific tuning
          waveHeight: 10.0, // amplitude of ring displacement
          waveSpeed: 0.1, // animation speed
          zoom: 0.75, // camera zoom
          shininess: 60.0, // material shininess/specular

          // Optional extras (safe defaults)
          points: 8, // number of radial segments (if supported in your build)
          minBrightness: 0.1, // lighting floor
          maxBrightness: 0.8, // lighting ceiling
          spacing: 2.0, // distance between ring bands
          amplitudeFactor: 1.0, // additional amplitude scaler
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handlePasswordReset = () => {
    setResettingPassword(false);
    setResetUser(null);
    setEmail("");
    setPassword("");
  };

  const validateLogin = (email, password) => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogIn = async () => {
    if (validateLogin(email, password)) {
      setLoading(true);
      try {
        const response = await apiClient.post(
          "/api/auth/login",
          { email, password },
          { withCredentials: true }
        );
        console.log("Login response:", response.data);
        if (response.data.resetPassword) {
          setResetUser(response.data.user);
          setResettingPassword(true);
          toast.info("Please reset your password.");
        } else if (response.data.user?._id) {
          setUserInfo(response.data.user);
          toast.success("Logged in successfully");
          navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  if (resettingPassword) {
    console.log("Rendering ResetPassword with user:", resetUser);
    return <ResetPassword user={resetUser} onPasswordReset={handlePasswordReset} />;
  }

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/github";
  };

  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/linkedin";
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      gradient: "from-yellow-500 to-orange-500",
      delay: 0.0,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: Network,
      title: "Global Infrastructure",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2,
    },
    {
      icon: Cpu,
      title: "AI-Powered",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.3,
    },
  ];
  return (
    // Vanta.js 3D Background Container
    <div
      ref={vantaRef}
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/60 to-black/80 backdrop-blur-[2px]" />

      {/* Floating geometric shapes for tech aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-20 bg-gradient-to-b from-cyan-500/20 to-transparent"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-7xl relative z-10"
      >
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Side - Enhanced Professional Branding */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-3 space-y-10"
          >
            {/* Header Section */}
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="relative w-16 h-16"
                  whileHover={{
                    rotate: 360,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 relative overflow-hidden">
                    <MessageCircle className="w-8 h-8 text-white relative z-10" />
                    {/* Animated tech grid overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='white' stroke-width='0.5' opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
                        }}
                      />
                    </div>
                  </div>
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                <div>
                  <h1 className="text-7xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent tracking-tight">
                    TechTalke
                  </h1>
                  <motion.div
                    className="flex items-center gap-2 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xl text-cyan-300 font-mono">
                      A Community Connection
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Features Section - Row Layout with Icons Beside Titles */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  A Platform For Community Connection
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto lg:mx-0"></div>
              </div>

              <div className="space-y-4 lg:space-y-5">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 + feature.delay }}
                    whileHover={{ scale: 1.01, x: 12, y: -4 }}
                    className="group relative p-3 lg:p-4  hover:to-transparent backdrop-blur-sm transition-all duration-500 cursor-pointer overflow-hidden"
                  >
                    {/* Subtle glow effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 rounded-2xl`}
                    />

                    {/* Floating orb effect */}
                    <motion.div
                      className={`absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Content in row layout */}
                    <div className="relative z-10 flex items-center gap-4 lg:gap-6">
                      <motion.div
                        className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-xl flex-shrink-0 relative group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}
                        whileHover={{ rotate: 15 }}
                      >
                        <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        {/* Subtle ring around icon */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>

                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-2 text-lg lg:text-xl group-hover:text-cyan-100 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-gray-300 group-hover:text-gray-200 text-sm lg:text-base leading-relaxed transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Floating particles */}
                    <motion.div
                      className="absolute right-8 top-1/2 transform -translate-y-1/2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full`}
                          style={{
                            right: i * 8,
                            top: i * 4 - 8,
                          }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Subtle shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Ultra-Modern Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <motion.div
              className="relative p-8 rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 30px 60px rgba(6, 182, 212, 0.15)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated tech grid background */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='techgrid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='cyan' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23techgrid)' /%3e%3c/svg%3e")`,
                  }}
                />
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))",
                    "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))",
                    "linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />

              <div className="relative z-10">
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center gap-3 mb-2">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center"
                      animate={{ rotate: [0, 0] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Lock className="w-4 h-4 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white">
                      Secure Access
                    </h3>
                  </div>
                </motion.div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full backdrop-blur-sm ml-28">
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className=" flex items-center text-sm  text-cyan-300 font-medium font-mono">
                    Community Access
                  </p>
                </div>
                <div className="space-y-6">
                  {/* Email Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <Input
                        type="email"
                        placeholder="user@techtalke.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 bg-white/10 border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-sm text-base pl-4 font-mono placeholder:text-cyan-100"
                      />
                      {/* Focus indicator */}
                      <motion.div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      Password
                    </label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 bg-white/10 border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-sm text-base pl-4 pr-14 font-mono  placeholder:text-cyan-100"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </motion.button>
                      {/* Focus indicator */}
                      <motion.div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                    </div>
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleLogIn}
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-2xl shadow-cyan-500/25 transition-all duration-300 relative overflow-hidden group text-base"
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        animate={{
                          translateX: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />

                      {loading ? (
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Lock className="w-5 h-5" />
                          Sign In Securely
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-black/30 text-gray-300 font-semibold backdrop-blur-xl rounded-full border border-white/10">
                        Or use SSO
                      </span>
                    </div>
                  </div>

                  {/* SSO Buttons */}
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, rotateY: 2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleGithubLogin}
                        className="h-12 bg-white/10 hover:bg-white/15 border-white/20 hover:border-white/40 text-gray-300 hover:text-white rounded-xl transition-all duration-300 w-full backdrop-blur-sm font-semibold"
                      >
                        <FaGithub className="h-5 w-5 mr-2" />
                        GitHub
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03, rotateY: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleLinkedinLogin}
                        className="h-12 bg-white/10 hover:bg-white/15 border-white/20 hover:border-white/40 text-gray-300 hover:text-white rounded-xl transition-all duration-300 w-full backdrop-blur-sm font-semibold"
                      >
                        <FaLinkedin className="h-5 w-5 mr-2 text-cyan-400" />
                        LinkedIn
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <p className="text-sm text-gray-400 font-mono">
                    Protected by community-grade security.{" "}
                    <motion.button
                      onClick={() => navigate("/privacy-policy")}
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Privacy Policy
                    </motion.button>
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 font-mono">
                      Curious about the minds behind TechTalke?{" "}
                      <motion.button
                        onClick={() => navigate("/about-team")}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        About Us <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;