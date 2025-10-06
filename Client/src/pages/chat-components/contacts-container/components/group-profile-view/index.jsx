import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserCircle2,
  Users2,
  Mail,
  Crown,
  Shield,
  UserMinus,
  Trash2,
  Edit3,
  Camera,
  Settings,
  Plus,
  X,
  Check,
  AlertTriangle,
  MoreHorizontal,
  Copy,
  Eye,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GroupMemberManagement from "../group-member-management";

const GroupProfileView = ({ group, open, onOpenChange }) => {
  const [details, setDetails] = useState(group);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showMemberManagement, setShowMemberManagement] = useState(false);

  const {
    userInfo,
    dmContacts,
    removeGroup,
    setSelectedChatData,
    setSelectedChatType,
  } = useStore();

  const isAdmin =
    details?.admins?.includes(userInfo?._id) ||
    details?.creator?._id === userInfo?._id;
  const isCreator = details?.creator?._id === userInfo?._id;

  useEffect(() => {
    const fetchDetails = async () => {
      if (open && group && !group.members) {
        try {
          setLoading(true);
          const res = await apiClient.get(`/api/groups/${group._id}`);
          if (res.data.success) {
            setDetails(res.data.group);
            setEditName(res.data.group.name);
            setEditDescription(res.data.group.description || "");
          }
        } catch (err) {
          console.error("Failed to fetch group details", err);
          toast.error("Failed to fetch group details");
        } finally {
          setLoading(false);
        }
      } else if (group) {
        setDetails(group);
        setEditName(group.name);
        setEditDescription(group.description || "");
      }
    };
    fetchDetails();
  }, [open, group]);

  const handleUpdateGroup = async () => {
    if (!editName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.put(`/api/groups/${details._id}`, {
        name: editName.trim(),
        description: editDescription.trim(),
      });

      if (res.data.success) {
        setDetails(res.data.group);
        setIsEditing(false);
        toast.success("Group updated successfully!");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      const res = await apiClient.delete(`/api/groups/${details._id}`);

      if (res.data.success) {
        toast.success("Group deleted successfully!");
        removeGroup(details._id);
        onOpenChange(false);

        // If this group is currently open, close the chat
        setSelectedChatData(null);
        setSelectedChatType(undefined);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setLoading(true);
      const res = await apiClient.delete(
        `/api/groups/${details._id}/members/${memberId}`
      );

      if (res.data.success) {
        setDetails(res.data.group);
        toast.success("Member removed successfully!");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const getMemberRole = (member) => {
    if (details?.creator?._id === member._id) return "Creator";
    if (details?.admins?.includes(member._id)) return "Admin";
    return "Member";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Creator":
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case "Admin":
        return <Shield className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Creator":
        return "text-yellow-400";
      case "Admin":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const handleMembersUpdate = (updatedGroup) => {
    setDetails(updatedGroup);
  };

  if (!details) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-gray-900/98 to-slate-900/98 backdrop-blur-xl border border-gray-700/50 text-white max-w-2xl mx-auto shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-purple-500/10 rounded-lg pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
            backgroundSize: "25px 25px",
          }}
        />

        <DialogHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
              {isEditing ? "Edit Group" : "Group Profile"}
            </DialogTitle>

            {isAdmin && (
              <div className="flex gap-2">
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                )}

                {isCreator && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border border-red-500/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Delete Group
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          This action cannot be undone. This will permanently
                          delete the group "{details.name}" and all its
                          messages.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteGroup}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Group
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-1 relative z-10"
          >
            {/* Group Avatar & Info */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl scale-110 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                <Avatar className="relative h-24 w-24 ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/50 shadow-xl transition-all duration-300">
                  {details.avatar ? (
                    <AvatarImage
                      src={details.avatar}
                      alt={details.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center">
                      <Users2 className="text-white w-8 h-8" />
                    </div>
                  )}
                </Avatar>
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </motion.button>
                )}
              </motion.div>

              {/* Editable Group Info */}
              <div className="w-full max-w-md space-y-3">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">
                        Group Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-gray-800/50 border-gray-600/50 text-white focus:border-emerald-500/50"
                        placeholder="Enter group name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">
                        Description
                      </label>
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="bg-gray-800/50 border-gray-600/50 text-white focus:border-emerald-500/50"
                        placeholder="Enter group description"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleUpdateGroup}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(details.name);
                          setEditDescription(details.description || "");
                        }}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-2"
                  >
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                      {details.name}
                    </h2>
                    {details.description && (
                      <p className="text-sm text-gray-300 px-4">
                        {details.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users2 className="w-3 h-3" />
                        {details.members?.length || 0} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created{" "}
                        {new Date(details.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-emerald-400" />
                  Members ({details.members?.length || 0})
                </h3>

                {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => setShowMemberManagement(true)}
                    className="bg-blue-500/20 border border-blue-400/30 text-blue-400 hover:bg-blue-500/30"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                )}
              </div>

              {/* Member List */}
              <div className="space-y-2">
                <AnimatePresence>
                  {details.members?.map((member, index) => {
                    const role = getMemberRole(member);
                    const canRemove =
                      isAdmin &&
                      member._id !== userInfo._id &&
                      role !== "Creator";

                    return (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              {member.avatar ? (
                                <AvatarImage
                                  src={member.avatar}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                                  <UserCircle2 className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </Avatar>
                            {role !== "Member" && (
                              <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-gray-800 border border-gray-600">
                                {getRoleIcon(role)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white truncate">
                                {member.firstName && member.lastName
                                  ? `${member.firstName} ${member.lastName}`
                                  : member.email}
                              </p>
                              {member._id === userInfo._id && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-400/30">
                                  You
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs ${getRoleColor(
                                role
                              )} flex items-center gap-1`}
                            >
                              {getRoleIcon(role)}
                              {role}
                            </p>
                          </div>

                          {/* Member Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="bg-gray-800 border-gray-700"
                                align="end"
                              >
                                <DropdownMenuItem
                                  onClick={() => setSelectedMember(member)}
                                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                {canRemove && (
                                  <>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveMember(member._id)
                                      }
                                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                    >
                                      <UserMinus className="w-4 h-4 mr-2" />
                                      Remove from Group
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Group Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Admins
                  </span>
                </div>
                <p className="text-lg font-bold text-white mt-1">
                  {(details.admins?.length || 0) + 1}
                </p>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Messages
                  </span>
                </div>
                <p className="text-lg font-bold text-white mt-1">∞</p>
              </div>
            </div>
          </motion.div>
        </ScrollArea>

        {/* Member Management Modal */}
        <GroupMemberManagement
          group={details}
          open={showMemberManagement}
          onOpenChange={setShowMemberManagement}
          onMembersUpdate={handleMembersUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GroupProfileView;
