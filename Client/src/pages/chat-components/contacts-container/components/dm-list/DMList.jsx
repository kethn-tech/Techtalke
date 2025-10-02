import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  UserCircle2,
  MessageCircle,
  Hash,
  Users,
  MoreVertical,
  Settings,
  UserPlus,
  Trash2,
  Eye,
  Pin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import GroupProfileView from "../group-profile-view";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

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
    userInfo,
    removeGroup,
  } = useStore();

  const [showGroupProfile, setShowGroupProfile] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupAction = (action, group, event) => {
    event?.stopPropagation();

    switch (action) {
      case "viewProfile":
        setSelectedGroup(group);
        setShowGroupProfile(true);
        break;
      case "deleteGroup":
        handleDeleteGroup(group);
        break;
      case "leaveGroup":
        handleLeaveGroup(group);
        break;
      default:
        break;
    }
  };

  const handleDeleteGroup = async (group) => {
    try {
      const res = await apiClient.delete(`/api/groups/${group._id}`);
      if (res.data.success) {
        removeGroup(group._id);
        toast.success("Group deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    }
  };

  const handleLeaveGroup = async (group) => {
    try {
      const res = await apiClient.delete(
        `/api/groups/${group._id}/members/${userInfo._id}`
      );
      if (res.data.success) {
        removeGroup(group._id);
        toast.success("Left group successfully!");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    }
  };

  const isGroupAdmin = (group) => {
    return (
      group?.admins?.includes(userInfo?._id) ||
      group?.creator?._id === userInfo?._id
    );
  };

  const isGroupCreator = (group) => {
    return group?.creator?._id === userInfo?._id;
  };

  // Unified contacts combining DMs and Groups
  const allContacts = React.useMemo(() => {
    const validDmContacts = Array.isArray(dmContacts) ? dmContacts : [];
    const validGroups = Array.isArray(groups) ? groups : [];

    const dmList = validDmContacts.map((contact) => ({
      ...contact,
      type: "dm",
      displayName:
        `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
        contact.email,
      isOnline: onlineUsers?.includes(contact._id) || false,
      unreadCount: unreadMessages?.[contact._id] || 0,
    }));

    const groupList = validGroups.map((group) => ({
      ...group,
      type: "group",
      displayName: group.name,
      isOnline: false,
      unreadCount: unreadMessages?.[group._id] || 0,
    }));

    const combined = [...dmList, ...groupList];
    return combined.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
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
        const isGroup = contact.type === "group";

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

              <div className="flex items-center justify-between gap-2">
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
                      : contact.isOnline
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>

                {/* Group member avatars preview */}
                {isGroup && contact.members && contact.members.length > 0 && (
                  <div className="flex items-center -space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {contact.members.slice(0, 3).map((member, memberIndex) => (
                      <motion.div
                        key={member._id || memberIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: memberIndex * 0.05 }}
                      >
                        <Avatar className="h-4 w-4 ring-1 ring-slate-700 hover:ring-slate-500 transition-all duration-200">
                          {member.avatar ? (
                            <AvatarImage
                              src={member.avatar}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                              <UserCircle2 className="w-2 h-2 text-gray-400" />
                            </div>
                          )}
                        </Avatar>
                      </motion.div>
                    ))}
                    {contact.members.length > 3 && (
                      <div className="h-4 w-4 bg-slate-600 rounded-full flex items-center justify-center text-[8px] text-slate-300 font-medium ring-1 ring-slate-700">
                        +{contact.members.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Group Actions Menu */}
            {isGroup && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-gray-800/95 backdrop-blur-md border-gray-700 shadow-xl"
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleGroupAction("viewProfile", contact, e)
                      }
                      className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>

                    {isGroupAdmin(contact) && (
                      <>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Group Settings
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="bg-gray-700" />

                    {isGroupCreator(contact) ? (
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleGroupAction("deleteGroup", contact, e)
                        }
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleGroupAction("leaveGroup", contact, e)
                        }
                        className="text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 cursor-pointer"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Leave Group
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        );
      })}

      {/* Group Profile Modal */}
      <GroupProfileView
        group={selectedGroup}
        open={showGroupProfile}
        onOpenChange={(open) => {
          setShowGroupProfile(open);
          if (!open) setSelectedGroup(null);
        }}
      />
    </div>
  );
};

export default DMList;
