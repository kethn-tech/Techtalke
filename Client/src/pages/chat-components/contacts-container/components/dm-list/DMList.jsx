import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, MessageCircle, Hash, Users } from "lucide-react";

// Note: This component is now integrated into the main ContactsContainer
// This is a standalone version for reference

const DMList = () => {
  const {
    selectedChatData,
    setSelectedChatData,
    dmContacts,
    groups,
    setSelectedChatMessages,
    setSelectedChatType,
    unreadMessages,
    onlineUsers,
  } = useStore();

  // Unified contacts combining DMs and Groups
  const allContacts = React.useMemo(() => {
    const validDmContacts = Array.isArray(dmContacts) ? dmContacts : [];
    const validGroups = Array.isArray(groups) ? groups : [];
    
    const dmList = validDmContacts.map(contact => ({
      ...contact,
      type: 'dm',
      displayName: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
      isOnline: onlineUsers?.includes(contact._id) || false,
      unreadCount: unreadMessages?.[contact._id] || 0
    }));

    const groupList = validGroups.map(group => ({
      ...group,
      type: 'group',
      displayName: group.name,
      isOnline: false,
      unreadCount: unreadMessages?.[group._id] || 0
    }));

    const combined = [...dmList, ...groupList];
    return combined.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [dmContacts, groups, onlineUsers, unreadMessages]);

  const handleClick = (contact) => {
    setSelectedChatData(contact);
    setSelectedChatType(contact.type);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  if (!allContacts || allContacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-slate-700/40 to-slate-600/40 flex items-center justify-center mb-4 border border-slate-600/30">
          <MessageCircle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-400 text-sm mb-2">No conversations yet</p>
        <p className="text-slate-500 text-xs">
          Start a new chat to get connected!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {allContacts.map((contact, index) => {
        const isSelected = selectedChatData?._id === contact._id;
        const isGroup = contact.type === 'group';

        return (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border ${
              isSelected
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                : "bg-slate-800/30 hover:bg-slate-700/40 border-slate-700/30 hover:border-slate-600/40"
            }`}
            onClick={() => handleClick(contact)}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full shadow-lg shadow-cyan-400/50" />
            )}

            {/* Avatar with status */}
            <div className="relative">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                {/* Glow effect for online users */}
                {contact.isOnline && !isGroup && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-md scale-110 opacity-60" />
                )}

                <Avatar
                  className={`relative h-12 w-12 transition-all duration-300 shadow-lg ${
                    isSelected
                      ? "ring-2 ring-cyan-500/50"
                      : "ring-2 ring-slate-600/30 group-hover:ring-slate-500/50"
                  }`}
                >
                  {contact.image ? (
                    <AvatarImage
                      src={contact.image}
                      alt={contact.displayName}
                      className="object-cover"
                    />
                  ) : isGroup ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-300" />
                    </div>
                  ) : (
                    <UserCircle2 className="text-slate-400 w-8 h-8" />
                  )}
                </Avatar>

                {/* Online status indicator for DMs */}
                {!isGroup && contact.isOnline && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full ring-2 ring-slate-900 shadow-lg shadow-green-400/50"
                  />
                )}

                {/* Unread message indicator */}
                {contact.unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top- -right-1 min-w-[20px] h-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-900 shadow-lg shadow-cyan-500/50"
                  >
                    {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* Contact info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`font-semibold truncate transition-all duration-300 flex items-center gap-2 ${
                    isSelected
                      ? "text-white"
                      : "text-slate-200 group-hover:text-white"
                  }`}
                >
                  {isGroup && <Hash className="w-3 h-3 text-indigo-400" />}
                  {contact.displayName}
                </h4>

                {/* Timestamp placeholder - you can add last message time here */}
                {contact.unreadCount > 0 && (
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    contact.isOnline && !isGroup
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50"
                      : isGroup
                      ? "bg-gradient-to-r from-indigo-400 to-purple-500"
                      : "bg-slate-500"
                  }`}
                />
                <p
                  className={`text-xs truncate transition-colors duration-300 ${
                    isSelected
                      ? "text-slate-300"
                      : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {isGroup 
                    ? `${contact.members?.length || 0} members`
                    : contact.isOnline ? "Online" : "Offline"
                  }
                </p>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DMList;