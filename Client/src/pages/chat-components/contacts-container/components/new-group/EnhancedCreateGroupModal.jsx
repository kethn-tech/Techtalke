import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/store";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCircle2, 
  Users, 
  Sparkles, 
  Search, 
  X, 
  Camera, 
  Check, 
  Plus,
  Hash,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EnhancedCreateGroupModal = ({ open, onOpenChange }) => {
  const { dmContacts, addGroup, userInfo } = useStore();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1); // 1: Group Info, 2: Add Members, 3: Review
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupType, setGroupType] = useState("private"); // private, public

  // Filter contacts based on search query
  const filteredContacts = dmContacts?.filter(contact => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  }) || [];

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      return toast.error("Please provide a group name.");
    }

    if (selectedMembers.length === 0) {
      return toast.error("Please select at least one member.");
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/groups/create", {
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: selectedMembers,
        type: groupType,
      });

      if (response.data.success) {
        const newGroup = response.data.group;
        addGroup(newGroup);
        toast.success(`Group "${newGroup.name}" created successfully!`);
        
        // Reset form
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setSearchQuery("");
    setStep(1);
    setGroupAvatar(null);
    setGroupType("private");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!groupName.trim()) {
        toast.error("Please enter a group name");
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const getSelectedMemberNames = () => {
    return selectedMembers.map(id => {
      const member = dmContacts.find(c => c._id === id);
      return member ? `${member.firstName} ${member.lastName}`.trim() || member.email : '';
    }).filter(Boolean);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-900 backdrop-blur-xl border border-slate-700/50 text-white max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 rounded-lg pointer-events-none" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
          backgroundSize: '25px 25px'
        }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <DialogHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 mb-4"
            >
              <Users className="w-8 h-8 text-indigo-400" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-900 text-transparent bg-clip-text text-white">
              Create New Group
            </DialogTitle>
            <DialogDescription className="text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Step {step} of 3 - {step === 1 ? "Group Details" : step === 2 ? "Add Members" : "Review & Create"}
            </DialogDescription>

            {/* Progress Bar */}
            <div className="flex gap-2 justify-center mt-4">
              {[1, 2, 3].map((stepNum) => (
                <motion.div
                  key={stepNum}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stepNum <= step 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 w-8" 
                      : "bg-slate-700 w-6"
                  }`}
                  animate={{ width: stepNum <= step ? 32 : 24 }}
                />
              ))}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] px-1">
            <AnimatePresence mode="wait">
              {/* Step 1: Group Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Group Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border-2 border-indigo-400/30 group-hover:border-indigo-400/60 transition-all duration-300 overflow-hidden">
                        {groupAvatar ? (
                          <img src={groupAvatar} alt="Group" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-10 h-10 text-indigo-300" />
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -bottom-2 -right-2 p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-xs text-slate-400">Upload group photo</p>
                  </div>

                  {/* Group Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Group Name *
                    </label>
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Enter a creative group name..."
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/30 rounded-xl backdrop-blur-sm transition-all duration-300 h-12"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Group Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                    <Textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="What's this group about? (e.g., Project team, Study group, etc.)"
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/30 rounded-xl backdrop-blur-sm transition-all duration-300 min-h-[100px] resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Group Type */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Group Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGroupType("private")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          groupType === "private"
                            ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                            : "bg-slate-800/30 border-slate-600/30 text-slate-400 hover:border-slate-500/50"
                        }`}
                      >
                        <Users className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-medium">Private</p>
                        <p className="text-xs opacity-70">Invite only</p>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGroupType("public")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          groupType === "public"
                            ? "bg-green-500/20 border-green-400/50 text-green-300"
                            : "bg-slate-800/30 border-slate-600/30 text-slate-400 hover:border-slate-500/50"
                        }`}
                      >
                        <Globe className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-medium">Public</p>
                        <p className="text-xs opacity-70">Anyone can join</p>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Add Members */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Selected Members Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Add Members</h3>
                      <span className="text-sm text-slate-400">
                        {selectedMembers.length} selected
                      </span>
                    </div>
                    
                    {selectedMembers.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-800/30 rounded-xl border border-slate-600/30">
                        {selectedMembers.map(memberId => {
                          const member = dmContacts.find(c => c._id === memberId);
                          return member ? (
                            <motion.div
                              key={memberId}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-sm"
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={member.avatar} />
                              </Avatar>
                              <span>{member.firstName} {member.lastName}</span>
                              <button
                                onClick={() => handleMemberSelect(memberId)}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
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

                  {/* Contacts List */}
                  <ScrollArea className="h-64 rounded-xl border border-slate-700/30 bg-slate-800/30 backdrop-blur-sm">
                    <div className="p-4 space-y-2">
                      {filteredContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Users className="w-12 h-12 text-slate-600 mb-3" />
                          <p className="text-slate-400 text-sm">
                            {searchQuery ? 'No contacts found' : 'No contacts available'}
                          </p>
                        </div>
                      ) : (
                        filteredContacts.map((contact, index) => {
                          const isSelected = selectedMembers.includes(contact._id);
                          return (
                            <motion.div
                              key={contact._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleMemberSelect(contact._id)}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                                isSelected
                                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                  : "hover:bg-slate-700/30 border border-transparent hover:border-slate-600/30"
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
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <p className="font-medium text-white">
                                  {contact.firstName} {contact.lastName}
                                </p>
                                <p className="text-sm text-slate-400">{contact.email}</p>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-white text-center mb-6">Review Group Details</h3>
                  
                  <div className="space-y-4 p-6 bg-slate-800/30 rounded-xl border border-slate-600/30">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border-2 border-indigo-400/30">
                        <Users className="w-8 h-8 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{groupName}</h4>
                        {groupDescription && (
                          <p className="text-sm text-slate-400 mt-1">{groupDescription}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            groupType === "private" 
                              ? "bg-indigo-500/20 text-indigo-300" 
                              : "bg-green-500/20 text-green-300"
                          }`}>
                            {groupType === "private" ? "Private Group" : "Public Group"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {selectedMembers.length + 1} members
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/50 pt-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-3">Members ({selectedMembers.length + 1})</h5>
                      <div className="space-y-2">
                        {/* Current user */}
                        <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                          <Avatar className="h-8 w-8">
                            {userInfo.avatar ? (
                              <AvatarImage src={userInfo.avatar} />
                            ) : (
                              <UserCircle2 className="w-5 h-5 text-slate-400" />
                            )}
                          </Avatar>
                          <span className="text-sm text-white">
                            {userInfo.firstName} {userInfo.lastName} (You - Admin)
                          </span>
                        </div>
                        
                        {/* Selected members */}
                        {selectedMembers.map(memberId => {
                          const member = dmContacts.find(c => c._id === memberId);
                          return member ? (
                            <div key={memberId} className="flex items-center gap-3 p-2 rounded-lg">
                              <Avatar className="h-8 w-8">
                                {member.avatar ? (
                                  <AvatarImage src={member.avatar} />
                                ) : (
                                  <UserCircle2 className="w-5 h-5 text-slate-400" />
                                )}
                              </Avatar>
                              <span className="text-sm text-slate-300">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <DialogFooter className="flex gap-3 pt-6">
            {step > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white flex-1"
                disabled={isLoading}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleCreateGroup}
                disabled={isLoading || !groupName.trim() || selectedMembers.length === 0}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 border-0 transition-all duration-300 flex-1"
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
            )}
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateGroupModal;