import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Code, Zap, ArrowRight, Sparkles, Shield, Globe, Layers } from "lucide-react";
import DmDialog from "@/pages/chat-components/contacts-dialog-box/index.jsx";
import { useStore } from "@/store/store";

const EmptyChatContainer = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const { setSelectedChatData, setSelectedChatType } = useStore();

  const handleSelectContact = (contact) => {
    setSelectedChatData(contact);
    setSelectedChatType("dm");
  };

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Messaging",
      description: "Experience instant communication with zero lag and seamless delivery",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      glowColor: "shadow-cyan-500/20"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Collaboration",
      description: "Share and edit code snippets in real-time with syntax highlighting",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      glowColor: "shadow-indigo-500/20"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Group Chat Feature",
      description: "Connect with multiple users in organized chat rooms and channels",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      glowColor: "shadow-emerald-500/20"
    },
  ];

  const stats = [
    { icon: <Shield className="w-4 h-4" />, text: "End-to-End Encrypted", color: "text-cyan-400" },
    { icon: <Globe className="w-4 h-4" />, text: "Global Infrastructure", color: "text-blue-400" },
    { icon: <Layers className="w-4 h-4" />, text: "Multi-platform Ready", color: "text-indigo-400" }
  ];

  return (
    <div className="w-full h-dvh md:h-screen md:flex md:flex-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Enhanced animated background with tech patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural network style connections */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-2000" />
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="25%" y1="25%" x2="66%" y2="33%"
              stroke="url(#gradient1)" strokeWidth="1" opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="66%" y1="33%" x2="33%" y2="75%"
              stroke="url(#gradient2)" strokeWidth="1" opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 0.7, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 8 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
        />
      </div>

      {/* Tech grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center h-full space-y-12 py-8"
        >
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              {/* Tech accent lines */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4">
                <span className="block text-white/90">Welcome to</span>
                <span className="relative block">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
                    TechTalke
                  </span>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -inset-4 bg-gradient-to-r from-cyan-400/15 to-indigo-400/15 blur-3xl rounded-full"
                  />
                </span>
              </h1>
              
              {/* Tech accent lines bottom */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade communication platform for
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text font-semibold"> modern teams</span>
              </p>
              <p className="text-base text-slate-400 max-w-2xl mx-auto">
                Connect, collaborate, and create with developers worldwide through our next-generation messaging infrastructure
              </p>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 text-lg overflow-hidden"
                onClick={() => setOpenNewContactModal(true)}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                />
                
                <Sparkles className="w-5 h-5 relative z-10 text-cyan-300" />
                <span className="relative z-10">Launch Your Workspace</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>

              <div className="text-sm text-slate-400 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-30" />
                  </div>
                  <span>Instant Setup</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full">
                    <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-ping opacity-30 delay-500" />
                  </div>
                  <span>No Registration</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.15, duration: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  translateY: -8,
                  rotateX: 5,
                }}
                className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Tech border animation */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-transparent to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon container */}
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`p-4 bg-gradient-to-br ${feature.bgGradient} rounded-2xl w-fit border border-slate-600/30 group-hover:border-cyan-400/40 transition-all duration-500 ${feature.glowColor} group-hover:shadow-lg backdrop-blur-sm`}
                  >
                    <div className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {React.cloneElement(feature.icon, { 
                        className: `w-6 h-6 ${feature.gradient.includes('cyan') ? 'text-cyan-400' : feature.gradient.includes('indigo') ? 'text-indigo-400' : 'text-emerald-400'}` 
                      })}
                    </div>
                  </motion.div>

                  {/* Title with tech accent */}
                  <div className="space-y-1">
                    <h3 className={`text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                      {feature.title}
                    </h3>
                    <div className={`w-8 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:w-12 group-hover:opacity-100 transition-all duration-500`} />
                  </div>

                  <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors duration-300 text-sm">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs text-cyan-400 font-medium"
                  >
                    <span>Explore feature</span>
                    <ArrowRight className="w-3 h-3" />
                  </motion.div>
                </div>

                {/* Corner tech accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-slate-600/30 group-hover:border-cyan-400/60 transition-colors duration-500" />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                className="flex items-center gap-3 px-4 py-2 bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: index * 0.5 
                  }}
                  className={stat.color}
                >
                  {stat.icon}
                </motion.div>
                <span className="text-slate-300 font-medium">{stat.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Professional badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl border border-slate-600/40 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-t-cyan-400 border-r-blue-500 border-b-indigo-500 border-l-purple-500 rounded-full"
            />
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                 Ready</div>
              <div className="text-sm font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text">
                Professional Communication Suite
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <DmDialog
        open={openNewContactModal}
        onOpenChange={setOpenNewContactModal}
        onSelectContact={handleSelectContact}
      />
    </div>
  );
};

export default EmptyChatContainer;