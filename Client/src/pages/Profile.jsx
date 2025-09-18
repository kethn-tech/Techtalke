import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Trash2, Mail, User, UserCircle2, Check, X, Shield, Settings } from "lucide-react";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const { userInfo, setUserInfo } = useStore();

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
    }

    if (userInfo.image) {
      setImage(userInfo.image);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName || !lastName) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  };

  const updateProfile = async () => {
    if (!validateProfile()) return;
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/api/update-profile",
        { firstName, lastName },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully");
        window.location.href = "/chat";
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const response = await apiClient.post("/api/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Profile picture updated");
          setImage(response.data.image);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/api/delete-image",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Profile picture removed");
      }
    } catch (error) {
      toast.error("Failed to remove profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridShift 20s linear infinite'
          }}
        />
      </div>

      {/* Animated tech elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circuit-like lines */}
        <div className="absolute top-20 left-10 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-40 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Tech hexagons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `techFloat ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <polygon 
                points="10,2 17,6 17,14 10,18 3,14 3,6" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-cyan-400"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Modern header bar */}
          <div className="flex items-center justify-between mb-8 p-4 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/30">
                <Settings className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-white">Profile Settings</h1>
                <p className="text-sm text-slate-400">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/chat")}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-red-400/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Card className="bg-slate-900/30 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Left Panel - Avatar & Status */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Avatar Section */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        <div className="relative">
                          {/* Tech ring around avatar */}
                          <div className="absolute inset-0 w-44 h-44 rounded-2xl">
                            <svg className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
                              <rect x="2" y="2" width="172" height="172" rx="20" fill="none" stroke="url(#techGradient)" strokeWidth="1" strokeDasharray="8,4" opacity="0.4"/>
                              <defs>
                                <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="rgb(6, 182, 212)" />
                                  <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                                  <stop offset="100%" stopColor="rgb(99, 102, 241)" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          <Avatar className="w-40 h-40 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/50 hover:border-cyan-400/50 transition-all duration-500 flex justify-center items-center overflow-hidden shadow-2xl relative">
                            {image ? (
                              <AvatarImage
                                src={image}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <UserCircle2 className="w-20 h-20 text-slate-500" />
                              </div>
                            )}
                          </Avatar>

                          {/* Tech loading overlay */}
                          {loading && (
                            <div className="absolute inset-0 rounded-2xl bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                              <div className="relative">
                                <div className="w-8 h-8 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                              </div>
                            </div>
                          )}

                          {/* Modern hover controls */}
                          {hovered && !loading && (
                            <div className="absolute inset-0 rounded-2xl bg-slate-900/70 backdrop-blur-sm flex items-center justify-center gap-3">
                              <button
                                className="p-3 bg-cyan-500/20 rounded-xl hover:bg-cyan-500/30 border border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
                                onClick={handleFileInputClick}
                              >
                                <Camera className="w-5 h-5 text-cyan-400" />
                              </button>
                              {image && (
                                <button
                                  className="p-3 bg-red-500/20 rounded-xl hover:bg-red-500/30 border border-red-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-400/25"
                                  onClick={handleDeleteImage}
                                >
                                  <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                              )}
                            </div>
                          )}

                          <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                            name="profile-image"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-sm text-slate-400 mb-1">
                        Upload Profile Photo
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        MAX: 5MB • JPG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  {/* Status Panel */}
                  <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">Account Status</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Email Verified</span>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-mono">YES</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Profile Complete</span>
                          <div className="flex items-center space-x-1">
                            {firstName && lastName ? (
                              <>
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-mono">100%</span>
                              </>
                            ) : (
                              <>
                                <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></div>
                                <span className="text-amber-400 font-mono">PENDING</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Form */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Section Header */}
                  <div className="border-b border-slate-700/50 pb-4">
                    <h2 className="text-2xl font-medium bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Personal Information
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                      Update your profile details and preferences
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <div className="p-1 bg-slate-700/50 rounded border border-slate-600/50">
                          <Mail className="w-3 h-3 text-cyan-400" />
                        </div>
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          className="bg-slate-800/50 border-slate-600/50 text-slate-300 h-12 rounded-xl cursor-not-allowed pr-20 font-mono text-sm"
                          value={userInfo?.email}
                          disabled
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-400 font-mono flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            VERIFIED
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Name Fields Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <div className="p-1 bg-slate-700/50 rounded border border-slate-600/50">
                            <User className="w-3 h-3 text-blue-400" />
                          </div>
                          First Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="firstName"
                            className="bg-slate-800/50 border-slate-600/50 text-white h-12 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-300 hover:border-slate-500/70"
                            placeholder="Enter first name"
                            value={firstName || ""}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          {firstName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <div className="p-1 bg-slate-700/50 rounded border border-slate-600/50">
                            <User className="w-3 h-3 text-blue-400" />
                          </div>
                          Last Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="lastName"
                            className="bg-slate-800/50 border-slate-600/50 text-white h-12 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-300 hover:border-slate-500/70"
                            placeholder="Enter last name"
                            value={lastName || ""}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          {lastName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Completion Alert */}
                  {(!firstName || !lastName) && (
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-amber-500/20 rounded-lg border border-amber-400/30 mt-0.5">
                          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <h4 className="text-amber-400 font-medium mb-1 text-sm">
                            Profile Incomplete
                          </h4>
                          <p className="text-amber-300/80 text-sm">
                            Complete your profile to unlock all features and personalization options.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50">
                    <Button
                      onClick={updateProfile}
                      disabled={loading}
                      className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/30 rounded-xl border border-cyan-400/20"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <div className="absolute inset-0 w-4 h-4 border-2 border-transparent border-b-cyan-200 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                          </div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/chat")}
                      className="sm:w-32 h-12 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/70 transition-all duration-300 rounded-xl bg-slate-800/30"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* User Summary Card */}
                  <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <UserCircle2 className="w-5 h-5 text-cyan-400" />
                      Account Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Display Name</span>
                        <span className="text-sm text-white font-medium">
                          {firstName && lastName ? `${firstName} ${lastName}` : "Not Set"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Email</span>
                        <span className="text-sm text-cyan-400 font-mono">
                          {userInfo?.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Profile Photo</span>
                        <span className="text-sm text-white">
                          {image ? "Uploaded" : "Default"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes techFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes gridShift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;