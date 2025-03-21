import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/store';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Group, Search, ChevronLeft, ChevronRight, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const Groups = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/chat');
      return;
    }

    fetchGroups();
  }, [userInfo, navigate, pagination.page, searchQuery]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/groups', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery
        }
      });
      
      setGroups(response.data.groups);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    // The useEffect will trigger the API call
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await apiClient.delete(`/api/admin/groups/${selectedGroup._id}`);
      toast.success('Group deleted successfully');
      setShowDeleteDialog(false);
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 text-transparent bg-clip-text mb-2">
              Group Management
            </h1>
            <p className="text-gray-400">
              View and manage group chats across the platform
            </p>
          </div>
          <Button 
            variant="outline" 
            className="  text-cyan-950 bg-slate-200  hover:bg-dark-accent/30"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by group name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-accent/10 border-dark-accent/30 text-dark-text placeholder:text-dark-muted"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </motion.div>

        {/* Groups Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-accent/20 backdrop-blur-sm rounded-xl border border-dark-accent/30 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-dark-accent/30 bg-dark-accent/10">
                    <th className="px-6 py-3">Group</th>
                    <th className="px-6 py-3">Creator</th>
                    <th className="px-6 py-3">Members</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group._id} className="border-b border-dark-accent/10 hover:bg-dark-accent/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{group.name}</div>
                            <div className="text-xs text-gray-400">
                              {group.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">
                            {group.creator?.firstName?.charAt(0) || group.creator?.email?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-gray-400">
                            {group.creator?.firstName && group.creator?.lastName 
                              ? `${group.creator.firstName} ${group.creator.lastName}` 
                              : group.creator?.email?.split('@')[0] || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{group.members?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowDeleteDialog(true);
                          }}
                          className="h-8 px-2 hover:bg-dark-accent/30 text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {groups.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  No groups found
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && groups.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-dark-accent/30 bg-dark-accent/10">
              <div className="text-sm text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} groups
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="h-8 px-2 hover:bg-dark-accent/30 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="h-8 px-2 hover:bg-dark-accent/30 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Group Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-dark-primary border-dark-accent/30 text-dark-text">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this group? This action cannot be undone and will remove all associated messages.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedGroup && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-accent/10">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{selectedGroup.name}</div>
                  <div className="text-sm text-gray-400">
                    {selectedGroup.members?.length || 0} members
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="hover:bg-dark-accent/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;