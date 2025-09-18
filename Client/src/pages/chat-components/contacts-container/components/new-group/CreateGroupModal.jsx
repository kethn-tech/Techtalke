import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CreateGroupModal = ({ open, onOpenChange }) => {
  const { dmContacts, addGroup } = useStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      return toast.error("Please provide a group name and select at least one member.");
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/groups/create", {
        name: groupName.trim(),
        description: "", // Added empty description
        members: selectedMembers,
      });

      if (response.data.success) {
        const newGroup = response.data.group;
        addGroup(newGroup);
        toast.success(`Group "${newGroup.name}" created successfully!`);
        onOpenChange(false); // Close the modal
        setGroupName("");
        setSelectedMembers([]);
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-white max-w-lg shadow-2xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-lg pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <DialogHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 mb-2"
            >
              <Users className="w-6 h-6 text-indigo-400" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Create New Group
            </DialogTitle>
            <DialogDescription className="text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Build your team and start collaborating
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Group Name Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Group Name
              </label>
              <Input
                placeholder="Enter a creative group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12 transition-all duration-300"
              />
            </motion.div>

            {/* Members Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Add Members ({selectedMembers.length} selected)
                </label>
                <div className="flex items-center gap-1">
                  {selectedMembers.slice(0, 3).map((memberId, index) => {
                    const member = dmContacts.find(c => c._id === memberId);
                    return (
                      <motion.div
                        key={memberId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Avatar className="h-6 w-6 ring-2 ring-indigo-500/30">
                          <AvatarImage src={member?.image} />
                        </Avatar>
                      </motion.div>
                    );
                  })}
                  {selectedMembers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-300 font-medium">
                      +{selectedMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
              
              <ScrollArea className="h-48 rounded-xl border border-slate-700/30 bg-slate-800/30 backdrop-blur-sm">
                <div className="p-3 space-y-2">
                  {dmContacts?.map((contact, index) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                        selectedMembers.includes(contact._id)
                          ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                          : "hover:bg-slate-700/30 border border-transparent hover:border-slate-600/30"
                      }`}
                      onClick={() => handleMemberSelect(contact._id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-600/30 group-hover:ring-slate-500/50 transition-all duration-300">
                          {contact.image ? (
                            <AvatarImage src={contact.image} />
                          ) : (
                            <UserCircle2 className="text-slate-400 w-6 h-6" />
                          )}
                        </Avatar>
                        
                        {selectedMembers.includes(contact._id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                          {`${contact.firstName} ${contact.lastName}`}
                        </p>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300">
                          {contact.email}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {(!dmContacts || dmContacts.length === 0) && (
                    <div className="text-center py-8 text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No contacts available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 px-6"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreateGroup}
                disabled={isLoading || !groupName.trim() || selectedMembers.length === 0}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 border-0 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Group
                  </>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;