import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCircle2, 
  Users, 
  Search, 
  X, 
  Check, 
  UserPlus, 
  UserMinus,
  Crown,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { toast } from "sonner";

const GroupMemberManagement = ({ group, open, onOpenChange, onMembersUpdate }) => {
  const { dmContacts, userInfo } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // "add" or "remove"

  const isAdmin = group?.admins?.includes(userInfo?._id) || group?.creator?._id === userInfo?._id;

  // Filter available contacts (not already in group)
  const availableContacts = dmContacts?.filter(contact => 
    !group?.members?.some(member => member._id === contact._id) &&
    contact._id !== userInfo._id
  ) || [];

  // Filter contacts based on search query
  const filteredContacts = (mode === "add" ? availableContacts : group?.members || []).filter(contact => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) return;

    setLoading(true);
    try {
      const res = await apiClient.post(`/api/groups/${group._id}/members`, {
        members: selectedMembers
      });

      if (res.data.success) {
        toast.success(`${selectedMembers.length} member(s) added successfully!`);
        onMembersUpdate?.(res.data.group);
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMembers = async () => {
    if (selectedMembers.length === 0) return;

    setLoading(true);
    try {
      for (const memberId of selectedMembers) {
        await apiClient.delete(`/api/groups/${group._id}/members/${memberId}`);
      }
      
      toast.success(`${selectedMembers.length} member(s) removed successfully!`);
      // Note: You might want to update the group state here
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error removing members:", error);
      toast.error("Failed to remove members");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMembers([]);
    setSearchQuery("");
  };

  const getMemberRole = (member) => {
    if (group?.creator?._id === member._id) return "Creator";
    if (group?.admins?.includes(member._id)) return "Admin";
    return "Member";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Creator": return <Crown className="w-3 h-3 text-yellow-400" />;
      case "Admin": return <Shield className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  const canRemoveMember = (member) => {
    const role = getMemberRole(member);
    return isAdmin && member._id !== userInfo._id && role !== "Creator";
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="bg-gradient-to-br from-gray-900/98 to-slate-900/98 backdrop-blur-xl border border-gray-700/50 text-white max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-lg pointer-events-none" />

        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text text-center">
            Manage Members - {group?.name}
          </DialogTitle>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 justify-center mt-4">
            <Button
              onClick={() => setMode("add")}
              variant={mode === "add" ? "default" : "outline"}
              className={`${
                mode === "add" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "border-green-500/50 text-green-400 hover:bg-green-500/20"
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Members
            </Button>
            <Button
              onClick={() => setMode("remove")}
              variant={mode === "remove" ? "default" : "outline"}
              className={`${
                mode === "remove" 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "border-red-500/50 text-red-400 hover:bg-red-500/20"
              }`}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove Members
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Members Preview */}
          {selectedMembers.length > 0 && (
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-600/30">
              <p className="text-sm font-medium text-slate-300 mb-2">
                Selected ({selectedMembers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(memberId => {
                  const member = (mode === "add" ? availableContacts : group?.members || [])
                    .find(c => c._id === memberId);
                  return member ? (
                    <motion.div
                      key={memberId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
                        mode === "add"
                          ? "bg-green-500/20 border-green-400/30 text-green-300"
                          : "bg-red-500/20 border-red-400/30 text-red-300"
                      }`}
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatar} />
                      </Avatar>
                      <span>{member.firstName} {member.lastName}</span>
                      <button
                        onClick={() => handleMemberSelect(memberId)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mode === "add" ? "Search contacts to add..." : "Search members to remove..."}
              className="bg-slate-800/30 border-slate-600/30 text-white placeholder:text-slate-400 pl-10 pr-10 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Members/Contacts List */}
          <ScrollArea className="h-80 rounded-xl border border-slate-700/30 bg-slate-800/30 backdrop-blur-sm">
            <div className="p-4 space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">
                    {mode === "add" 
                      ? (searchQuery ? 'No contacts found' : 'All contacts are already in the group')
                      : (searchQuery ? 'No members found' : 'No members to remove')
                    }
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact, index) => {
                  const isSelected = selectedMembers.includes(contact._id);
                  const role = mode === "remove" ? getMemberRole(contact) : null;
                  const canRemove = mode === "remove" ? canRemoveMember(contact) : true;

                  return (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => canRemove && handleMemberSelect(contact._id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                        !canRemove 
                          ? "opacity-50 cursor-not-allowed"
                          : `cursor-pointer ${
                              isSelected
                                ? `${mode === "add" 
                                    ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50" 
                                    : "bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-500/50"
                                  } shadow-lg`
                                : "hover:bg-slate-700/30 border border-transparent hover:border-slate-600/30"
                            }`
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          {contact.avatar ? (
                            <AvatarImage src={contact.avatar} />
                          ) : (
                            <UserCircle2 className="w-6 h-6 text-slate-400" />
                          )}
                        </Avatar>
                        {isSelected && canRemove && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                            mode === "add" ? "bg-green-500" : "bg-red-500"
                          }`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {role && getRoleIcon(role)}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-400">{contact.email}</p>
                          {role && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              role === "Creator" ? "bg-yellow-500/20 text-yellow-400" :
                              role === "Admin" ? "bg-blue-500/20 text-blue-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {role}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!canRemove && (
                        <div className="text-xs text-slate-500">
                          Cannot remove
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onOpenChange}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              onClick={mode === "add" ? handleAddMembers : handleRemoveMembers}
              disabled={loading || selectedMembers.length === 0}
              className={`flex-1 font-semibold ${
                mode === "add"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              } text-white`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  {mode === "add" ? "Adding..." : "Removing..."}
                </>
              ) : (
                <>
                  {mode === "add" ? (
                    <UserPlus className="w-4 h-4 mr-2" />
                  ) : (
                    <UserMinus className="w-4 h-4 mr-2" />
                  )}
                  {mode === "add" 
                    ? `Add ${selectedMembers.length} Member${selectedMembers.length !== 1 ? "s" : ""}`
                    : `Remove ${selectedMembers.length} Member${selectedMembers.length !== 1 ? "s" : ""}`
                  }
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMemberManagement;