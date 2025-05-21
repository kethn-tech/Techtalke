import React, { useState } from 'react';
import { useStore } from '@/store/store';
import { UserCircle2, Search } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import ProfileView from '@/pages/chat-components/contacts-container/components/profile-view';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from "@/lib/apiClient";

const ChatHeader = () => {
  const { selectedChatData, setSelectedChatMessages } = useStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = async (query) => {
    if (!selectedChatData?._id) return;

    try {
      const response = await apiClient.post("/api/messages/search", {
        chatId: selectedChatData._id,
        query,
      });

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error searching messages:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      handleSearch(query);
    } else if (query.length === 0) {
      handleSearch("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-dark-accent/30 backdrop-blur-sm bg-dark-accent/5"
    >
      <div className="flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 hover:bg-dark-accent/20 p-2 rounded-lg transition-all duration-300 group"
        >
          <motion.div whileHover={{ rotate: 5 }}>
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/30 transition-all duration-300 shadow-glow group-hover:ring-blue-500/50">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={selectedChatData.image}
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <UserCircle2 className="text-dark-muted" />
              )}
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <motion.h2 className="font-medium text-dark-text bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {selectedChatData?.firstName && selectedChatData?.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData?.email}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-1.5"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow-sm" />
              <p className="text-sm text-green-400">Online</p>
            </motion.div>
          </div>
        </motion.button>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 rounded-full hover:bg-dark-accent/30 transition-all duration-300 text-dark-muted hover:text-blue-400"
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search in conversation..."
                className="pl-9 bg-dark-accent/10 border-dark-accent/30 text-dark-text placeholder:text-dark-muted focus:ring-blue-500/30 transition-all duration-300"
                onFocus={() => setShowSearch(true)}
                onBlur={() => setShowSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileView
        user={selectedChatData}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </motion.div>
  );
};

export default ChatHeader;