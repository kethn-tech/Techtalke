import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStore } from "@/store/store";
import apiClient from "@/lib/apiClient";

const NewGroup = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { setGroupChats, groupChats } = useStore();

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        "/api/group/create",
        { 
          name, 
          description,
          members: [] // Initialize with empty members array
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setGroupChats([...groupChats, response.data.groupChat]);
        toast.success("Group created successfully");
        setOpen(false);
        setName("");
        setDescription("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-dark-muted hover:text-violet-400 hover:bg-dark-accent/30 transition-colors"
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-dark-primary border-dark-accent/30 text-dark-text">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 text-transparent bg-clip-text">
              Create New Group
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label className="text-sm text-dark-muted">Group Name</Label>
              <Input
                placeholder="Enter group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-dark-accent/10 border-dark-accent/30 text-dark-text placeholder:text-dark-muted"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-dark-muted">Description (Optional)</Label>
              <Input
                placeholder="Enter group description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-dark-accent/10 border-dark-accent/30 text-dark-text placeholder:text-dark-muted"
              />
            </div>

            <Button
              className="w-full bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              onClick={handleCreateGroup}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewGroup;