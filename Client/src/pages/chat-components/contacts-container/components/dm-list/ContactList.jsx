import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Users } from "lucide-react"; // ✨ ADD: Users icon for groups
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

const ContactList = () => {
  const {
    selectedChatData,
    setSelectedChatData,
    dmContacts,
    setDmContacts,
    groupContacts,
    setGroupContacts,
    setSelectedChatMessages,
    setSelectedChatType,
    unreadMessages,
    onlineUsers,
  } = useStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const [dmResponse, groupResponse] = await Promise.all([
          apiClient.get("/api/contact/get-dm-list"),
          apiClient.get("/api/groups"),
        ]);
        // ✨ FIX: Ensure we are setting an array, even if the response is unexpected.
        setDmContacts(dmResponse.data.contacts || []);
        setGroupContacts(groupResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
        // Set to empty arrays on error to prevent crashes
        setDmContacts([]);
        setGroupContacts([]);
      }
    };
    getContacts();
  }, [setDmContacts, setGroupContacts]);

  const allContacts = useMemo(() => {
    // ✨ FIX: Ensure dmContacts and groupContacts are arrays before spreading
    const validDmContacts = Array.isArray(dmContacts) ? dmContacts : [];
    const validGroupContacts = Array.isArray(groupContacts) ? groupContacts : [];
    const combined = [...validDmContacts, ...validGroupContacts];
    return combined.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [dmContacts, groupContacts]);

  const handleClick = (contact) => {
    const isGroup = !!contact.members;
    setSelectedChatData(contact);
    setSelectedChatType(isGroup ? "group" : "dm");
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="space-y-1">
      {allContacts.map((contact, index) => {
        const isGroup = !!contact.members;
        const imageUrl = !isGroup ? contact.image : contact.photoURL;
        const isSelected = selectedChatData?._id === contact._id;
        const isOnline = !isGroup && onlineUsers.includes(contact._id);

        return (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
              "hover:bg-dark-accent/30 group backdrop-blur-sm",
              isSelected && "bg-dark-accent/40 hover:bg-dark-accent/40 shadow-inner-glow"
            )}
            onClick={() => handleClick(contact)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-dark-accent/30 transition-transform group-hover:scale-105">
                {imageUrl ? (
                  <AvatarImage src={imageUrl} alt="Contact" />
                ) : isGroup ? (
                  <Users className="text-dark-muted w-full h-full p-2" />
                ) : (
                  <UserCircle2 className="text-dark-muted w-full h-full p-1" />
                )}
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-dark-primary shadow-glow" />
              )}
              {unreadMessages[contact._id] > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white ring-2 ring-dark-primary shadow-glow">
                  {unreadMessages[contact._id]}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-dark-text truncate group-hover:text-blue-400 transition-colors">
                {isGroup ? contact.name : `${contact.firstName} ${contact.lastName}`}
              </h4>
              <p className="text-sm text-dark-muted truncate">
                {isGroup ? `${contact.members.length} members` : isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ContactList;
