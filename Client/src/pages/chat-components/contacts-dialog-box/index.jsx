import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Mail, Zap, Users, ChevronDown, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/apiClient";

const DmDialog = ({ open, onOpenChange, onSelectContact }) => {
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const { dmContacts, setDmContacts } = useStore();

  // Debounced search to prevent excessive API calls
  const searchContact = useCallback(async (searchTerm) => {
    try {
      const response = await apiClient.post(
        "api/contact/search",
        { searchTerm },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.contacts) {
        const contacts = response.data.contacts.filter(
          (c) => !dmContacts.some((dm) => dm._id === c._id)
        );
        setSearchedContacts(contacts);
      }
    } catch (error) {
      console.error(error);
    }
  }, [dmContacts]);

  // Optimized scroll handler with RAF throttling
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    if ((scrollTop > 10) !== isScrolled) {
      setIsScrolled(scrollTop > 10);
    }
  }, [isScrolled]);

  useEffect(() => {
    if (open) {
      searchContact("");
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      setIsScrolled(false);
      return () => clearTimeout(timer);
    }
  }, [open, searchContact]);

  // Memoized background animations to prevent unnecessary re-renders
  const backgroundAnimations = useMemo(() => ({
    orb1: {
      x: [0, 80, -20, 60, 0],
      y: [0, -50, 30, -40, 0],
      scale: [1, 1.4, 0.8, 1.3, 1],
      rotate: [0, 180, -90, 270, 360],
      opacity: [0.6, 1, 0.3, 0.8, 0.6]
    },
    orb2: {
      x: [0, -60, 40, -50, 0],
      y: [0, 40, -30, 50, 0],
      scale: [1, 0.7, 1.5, 0.9, 1],
      rotate: [0, -180, 90, -270, -360],
      opacity: [0.4, 0.9, 0.2, 0.7, 0.4]
    },
    orb3: {
      x: [0, 30, -40, 20, 0],
      y: [0, -25, 35, -15, 0],
      scale: [1, 1.3, 0.6, 1.1, 1],
      opacity: [0.3, 0.7, 0.1, 0.5, 0.3]
    }
  }), []);

  // Optimized transition settings
  const springTransition = useMemo(() => ({
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 1
  }), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gradient-to-br from-slate-950/98 via-slate-900/96 to-slate-950/98 border border-cyan-400/20 text-white sm:max-w-[520px] backdrop-blur-3xl shadow-2xl shadow-cyan-500/20 rounded-2xl overflow-hidden max-h-[85vh] p-0 bg-slate-900">
        {/* Optimized geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Static grid pattern - no animation needed */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, #06B6D4 1px, transparent 1px),
                linear-gradient(180deg, #06B6D4 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          />
          
          {/* Optimized floating orbs - reduced complexity */}
          <motion.div
            className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl will-change-transform"
            animate={backgroundAnimations.orb1}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-48 h-48 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl will-change-transform"
            animate={backgroundAnimations.orb2}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
              repeatType: "loop"
            }}
          />
          
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl will-change-transform"
            animate={backgroundAnimations.orb3}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
              repeatType: "loop"
            }}
          />
          
          {/* Optimized tech lines */}
          <motion.div
            className="absolute top-20 right-0 w-px h-32 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent will-change-transform"
            animate={{ 
              opacity: [0, 1, 0.3, 0.8, 0],
              scaleY: [1, 1.5, 0.8, 1.2, 1],
              x: [0, 5, -3, 2, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
          />
          <motion.div
            className="absolute bottom-20 left-0 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent will-change-transform"
            animate={{ 
              opacity: [0, 0.8, 0.2, 1, 0],
              scaleX: [1, 1.3, 0.7, 1.4, 1],
              y: [0, -3, 5, -2, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3, repeatType: "loop" }}
          />
          
          {/* Optimized floating particles */}
          <motion.div
            animate={{
              y: [0, -150, 0],
              x: [0, 80, -40, 0],
              opacity: [0, 1, 0.5, 0],
              scale: [0, 2, 0.5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
            className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-cyan-400/40 rounded-full will-change-transform"
          />
          <motion.div
            animate={{
              y: [0, -120, 0],
              x: [0, -60, 70, 0],
              opacity: [0, 0.8, 0.3, 0],
              scale: [0, 1.8, 0.3, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2, repeatType: "loop" }}
            className="absolute top-2/3 left-1/4 w-1 h-1 bg-blue-400/50 rounded-full will-change-transform"
          />
        </div>

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-blue-500/[0.03] pointer-events-none" />

        {/* Optimized header */}
        <DialogHeader className={`relative z-10 p-6 transition-all duration-300 ${isScrolled ? 'border-b border-cyan-400/40 bg-slate-950/90 backdrop-blur-2xl' : 'border-b border-cyan-400/15'}`}>
          <DialogTitle className="text-xl font-bold flex items-center gap-3 text-white">
            <motion.div
              initial={{ rotate: -360, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, duration: 1 }}
              className="relative will-change-transform"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-xl blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
              />
              <motion.div 
                className="relative p-2 rounded-xl bg-gradient-to-br from-slate-800/90 via-slate-700/70 to-slate-800/90 backdrop-blur-sm border border-cyan-400/40 shadow-xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.6)",
                    "0 0 60px rgba(6, 182, 212, 0.4)",
                    "0 0 20px rgba(6, 182, 212, 0.3)"
                  ],
                  scale: [1, 1.05, 1.02, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
                >
                  <Zap size={18} className="text-cyan-300" />
                </motion.div>
              </motion.div>
              {/* Status indicator */}
              <motion.div 
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full will-change-transform"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-emerald-400 rounded-full"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                />
              </motion.div>
              {/* Pulsing rings */}
              <motion.div
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5, repeatType: "loop" }}
                className="absolute inset-0 border-2 border-cyan-400/20 rounded-xl will-change-transform"
              />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-200 bg-clip-text text-transparent text-lg"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  New Connection
                </motion.span>
    
                  <Wifi size={14} className="text-cyan-400/80" />
              </div>
              <motion.div 
                className="text-xs font-normal text-slate-400 mt-0.5 flex items-center gap-1.5"
                animate={{
                  opacity: [0.6, 1, 0.6],
                  y: [0, -1, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
              >
          
                  <Users size={11} />
                <motion.span
                  animate={{
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                >
                  Discover and connect with team members
                </motion.span>
              </motion.div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 p-6 pt-4">
          {/* Optimized Search Input */}
          <motion.div
            className="relative group mb-6"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, ...springTransition }}
          >
            {/* Search glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
            />
            
            {/* Search icon */}
            <motion.div
              className="absolute left-4 top-1 -translate-y-1/2 z-20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={springTransition}
              animate={{
                x: [0, 2, -2, 0],
                rotate: [0, 5, -5, 0]
              }}
              style={{ transition: "none" }}
            >
              <Search
                className="text-slate-400 group-focus-within:text-cyan-400 transition-all duration-500"
                size={18}
              />
            </motion.div>
            
            <Input
              ref={searchInputRef}
              className="relative pl-12 pr-20 py-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-500/25 focus:bg-slate-900/80 transition-all duration-300 backdrop-blur-xl shadow-xl text-sm hover:bg-slate-900/70 hover:border-slate-600/60"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchContact(e.target.value);
              }}
            />
            
            {/* Results indicator */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={springTransition}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 rgba(71, 85, 105, 0.5)",
                        "0 0 20px rgba(6, 182, 212, 0.6)",
                        "0 0 0 rgba(71, 85, 105, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  >
                    <Badge className="bg-gradient-to-r from-slate-700/95 to-slate-600/95 text-slate-200 border border-slate-600/70 px-3 py-1.5 text-xs backdrop-blur-xl shadow-lg">
                      <motion.span
                        key={searchedContacts.length}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={springTransition}
                      >
                        {searchedContacts.length}
                      </motion.span>
                    </Badge>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Corner tech accents */}
            <motion.div 
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-xl group-focus-within:border-cyan-400/70 transition-colors duration-500"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5, repeatType: "loop" }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/30 rounded-br-xl group-focus-within:border-blue-400/70 transition-colors duration-500"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5, repeatType: "loop" }}
            />
            
            {/* Rotating element */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/10 rounded-full pointer-events-none will-change-transform"
            />
          </motion.div>

          {/* Contact list */}
          <div className="relative">
            {/* Scroll fade effects */}
            <div className={`absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-950/95 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950/95 to-transparent z-20 pointer-events-none" />
            
            <ScrollArea 
              className="h-96 max-h-[60vh] pr-2 overflow-y-auto" 
              ref={scrollAreaRef}
              onScrollCapture={handleScroll}
            >
              <AnimatePresence mode="popLayout">
                {searchedContacts.map((contact, index) => (
                  <motion.div
                    key={contact._id}
                    layout
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.9 }}
                    transition={{
                      delay: index * 0.04,
                      ...springTransition
                    }}
                    whileHover={{ 
                      scale: 1.015,
                      y: -1,
                      transition: springTransition
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      onSelectContact(contact);
                      onOpenChange(false);
                      setSearchedContacts([]);
                      setSearchQuery("");
                    }}
                    className="group relative flex items-center gap-3.5 p-3.5 mb-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-300 border border-slate-800/40 hover:border-cyan-400/40 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 overflow-hidden will-change-transform"
                  >
                    {/* Hover accent line */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      layoutId={`hover-accent-${contact._id}`}
                    />
                    
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.06 + 0.15, 
                        ...springTransition
                      }}
                      className="relative flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Avatar className="h-11 w-11 ring-1 ring-slate-700/60 group-hover:ring-cyan-400/40 transition-all duration-300 shadow-md relative z-10">
                        <AvatarImage
                          src={contact.image}
                          alt={contact.firstName}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white font-semibold text-sm border border-slate-600/50">
                          {contact.firstName?.charAt(0) ||
                            contact.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-sm"
                      >
                        <div className="absolute inset-0.5 bg-emerald-400 rounded-full animate-ping opacity-40" />
                      </motion.div>
                    </motion.div>

                    {/* Contact information */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2.5 mb-1">
                        <motion.h4 
                          className="font-medium text-white group-hover:text-cyan-100 transition-colors duration-200 truncate text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.06 + 0.25 }}
                        >
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : "Unknown User"}
                        </motion.h4>
                        {contact.role === "admin" && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.06 + 0.35 }}
                          >
                            <Badge className="text-xs bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-indigo-100 border border-indigo-500/40 px-2 py-0.5 font-medium">
                              ADMIN
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      <motion.div 
                        className="flex items-center gap-2 text-slate-400 text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 + 0.45 }}
                      >
                        <Mail size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                        <span className="truncate font-medium">{contact.email}</span>
                      </motion.div>
                    </div>

                    {/* Connect button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.06 + 0.55 }}
                      className="relative z-10 flex-shrink-0"
                    >
                      <motion.div 
                        className="relative p-2 rounded-lg bg-gradient-to-br from-slate-800/70 to-slate-700/70 group-hover:from-cyan-600/25 group-hover:to-blue-600/25 transition-all duration-300 border border-slate-600/40 group-hover:border-cyan-400/40 shadow-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springTransition}
                      >
                        <Plus
                          size={14}
                          className="text-slate-400 group-hover:text-cyan-300 transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                      </motion.div>
                    </motion.div>

                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity">
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `
                            linear-gradient(45deg, #06B6D4 1px, transparent 1px),
                            linear-gradient(-45deg, #3B82F6 1px, transparent 1px)
                          `,
                          backgroundSize: '12px 12px'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state */}
              {searchedContacts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, ...springTransition }}
                  className="text-center py-12 relative"
                >
                  <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div className="absolute top-6 left-1/3 w-0.5 h-8 bg-gradient-to-b from-cyan-400/30 to-transparent rotate-12" />
                    <div className="absolute bottom-6 right-1/3 w-8 h-0.5 bg-gradient-to-r from-blue-400/30 to-transparent -rotate-12" />
                  </div>
                  
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      rotateY: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "loop"
                    }}
                    className="mb-4"
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-xl blur-xl" />
                      <div className="relative bg-slate-900/70 p-5 rounded-xl border border-cyan-400/25 backdrop-blur-sm">
                        <Search size={36} className="text-slate-500 mx-auto" />
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-cyan-400/40 rounded-tl-lg" />
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-blue-400/40 rounded-br-lg" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <h3 className="text-lg font-medium text-white mb-2">
                    {searchQuery ? "No results found" : "Start searching"}
                  </h3>
                  <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                    {searchQuery
                      ? (
                          <span>
                            No contacts match <span className="text-cyan-300 font-medium">"{searchQuery}"</span>
                            <br />
                            <span className="text-xs text-slate-500 mt-1 block">Try a different search term</span>
                          </span>
                        )
                      : "Type to discover colleagues and start conversations"}
                  </p>
                </motion.div>
              )}
            </ScrollArea>

            {/* Scroll indicator */}
            {searchedContacts.length > 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isScrolled ? 0 : 1 }}
                className="absolute bottom-2 right-4 flex items-center gap-1 text-xs text-slate-500 pointer-events-none"
              >
                <span>Scroll for more</span>
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                >
                  <ChevronDown size={12} />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DmDialog;