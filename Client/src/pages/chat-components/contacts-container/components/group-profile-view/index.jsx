import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Users2, Mail } from "lucide-react";
import { motion } from "framer-motion";

/**
 * GroupProfileView – modal displaying group info & member list
 * Props:
 *  - group: {@name, @description, @members[array]}
 *  - open: boolean
 *  - onOpenChange: fn(boolean)
 */
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

const GroupProfileView = ({ group, open, onOpenChange }) => {
  const [details, setDetails] = useState(group);

  useEffect(() => {
    const fetchDetails = async () => {
      if (open && group && !group.members) {
        try {
          const res = await apiClient.get(`/api/groups/${group._id}`);
          if (res.data.success) {
            setDetails(res.data.group);
          }
        } catch (err) {
          console.error("Failed to fetch group details", err);
        }
      } else {
        setDetails(group);
      }
    };
    fetchDetails();
  }, [open, group]);

  if (!details) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-gray-900/95 to-slate-900/95 backdrop-blur-xl border border-gray-700/50 text-white max-w-lg mx-auto shadow-2xl overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 rounded-lg pointer-events-none" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
            Group Details
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 p-6 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl scale-110 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <Avatar className="relative h-32 w-32 ring-4 ring-emerald-500/30 hover:ring-emerald-500/50 shadow-2xl shadow-emerald-500/20 transition-all duration-300">
              {details.avatar ? (
                <AvatarImage src={details.avatar} alt={details.name} className="object-cover" />
              ) : (
                <Users2 className="text-gray-400 w-32 h-32" />
              )}
            </Avatar>
          </motion.div>

          <div className="text-center space-y-4 w-full">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text"
            >
              {details.name}
            </motion.h2>
            {details.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-300"
              >
                {details.description}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-3 text-gray-300 bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <p className="text-sm font-medium">
                {details.members?.length || 0} member{details.members?.length === 1 ? "" : "s"}
              </p>
            </motion.div>
          </div>

          {/* Member list */}
          {Array.isArray(details.members) && details.members.length > 0 && (
            <ScrollArea className="h-64 w-full rounded-lg border border-gray-700/40 bg-gray-800/30 backdrop-blur-sm p-4">
              <div className="space-y-3 pr-2">
                {details.members.map((member) => (
                  <div key={member._id || member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                    </Avatar>
                    <span className="text-sm text-gray-200 truncate">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupProfileView;