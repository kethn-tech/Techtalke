import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const GroupList = () => {
  const {
    selectedChatData,
    setSelectedChatData,
    groupChats,
    setSelectedChatMessages,
    setSelectedChatType,
  } = useStore();

  const handleClick = (group) => {
    setSelectedChatData(group);
    setSelectedChatType("group");
    if (selectedChatData && selectedChatData._id !== group._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="space-y-1">
      {groupChats?.map((group, index) => {
        const isSelected = selectedChatData?._id === group._id;

        return (
          <motion.div
            key={group._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
              "hover:bg-dark-accent/30 group backdrop-blur-sm",
              isSelected &&
                "bg-dark-accent/40 hover:bg-dark-accent/40 shadow-inner-glow"
            )}
            onClick={() => handleClick(group)}
          >
            <Avatar className="h-10 w-10 ring-2 ring-violet-500/30 transition-transform group-hover:scale-105">
              <div className="bg-violet-500/20 w-full h-full flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-dark-text truncate group-hover:text-violet-400 transition-colors">
                {group.name}
              </h4>
              <p className="text-sm text-dark-muted truncate">
                {group.description || `${group.members?.length || 0} members`}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GroupList;