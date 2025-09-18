import React, { useEffect, useState, useRef } from 'react';
import { Upload, File, Download, Trash2, FileText, Image, Archive, Video, Music, Code, Search, Grid, List, Filter, Sparkles, Shield, Database, Zap, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/apiClient';

// Delete Confirmation Dialog Component
const DeleteDialog = ({ isOpen, onClose, onConfirm, fileName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-8 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-b border-slate-700/50">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Warning icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30"
              >
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Delete File
              </h2>
              <p className="text-slate-400 text-center">
                This action cannot be undone
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-slate-300 mb-4">
                  Are you sure you want to delete this file?
                </p>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
                  <div className="flex items-center justify-center gap-3">
                    <File className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-white truncate max-w-xs" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-2xl font-semibold transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <motion.div
                    animate={{ x: [-100, 250] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ZoroVault = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all');
  const [dragActive, setDragActive] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, fileId: null, fileName: '' });
  const inputRef = useRef();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/zoro');
      setFiles(res.data.files || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    for (const file of fileList) {
      formData.append('files', file);
    }

    try {
      setUploading(true);
      await apiClient.post('/api/zoro/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchFiles();

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openDeleteDialog = (id, filename) => {
    setDeleteDialog({
      isOpen: true,
      fileId: id,
      fileName: filename
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      fileId: null,
      fileName: ''
    });
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/zoro/${deleteDialog.fileId}`);
      setFiles(files.filter((f) => f._id !== deleteDialog.fileId));
      closeDeleteDialog();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
      closeDeleteDialog();
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await apiClient.get(`/api/zoro/${id}/download`);
      window.open(res.data.url, '_blank');
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
  };

  const getFileIcon = (mimeType) => {
    const iconProps = { className: "w-5 h-5" };
    
    if (mimeType.startsWith('image/')) return <Image {...iconProps} className="w-5 h-5 text-cyan-400" />;
    if (mimeType.includes('pdf')) return <FileText {...iconProps} className="w-5 h-5 text-red-400" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive {...iconProps} className="w-5 h-5 text-orange-400" />;
    if (mimeType.startsWith('video/')) return <Video {...iconProps} className="w-5 h-5 text-purple-400" />;
    if (mimeType.startsWith('audio/')) return <Music {...iconProps} className="w-5 h-5 text-pink-400" />;
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('html')) return <Code {...iconProps} className="w-5 h-5 text-green-400" />;
    return <File {...iconProps} className="w-5 h-5 text-slate-400" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'images' && file.mimeType.startsWith('image/')) ||
      (filterType === 'documents' && (file.mimeType.includes('pdf') || file.mimeType.includes('document') || file.mimeType.includes('presentation') || file.mimeType.includes('sheet'))) ||
      (filterType === 'archives' && (file.mimeType.includes('zip') || file.mimeType.includes('rar')));
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, 40, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 5,
            }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
          />
        </div>

        {/* Tech grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Initializing ZoRo Vault
          </h2>
          <p className="text-slate-400">Securing your digital assets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
        />

        {/* Neural network connections */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-2000" />
        </div>
      </div>

      {/* Tech grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="relative">
              {/* Tech accent lines */}
              <div className="absolute -top-4 left-0 w-24 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent opacity-60" />
              
              <h1 className="text-5xl font-black tracking-tight leading-none mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
                  ZoRo Vault
                </span>
              </h1>
              <p className="text-slate-400 text-lg">
                Enterprise-grade <span className="text-cyan-400">secure storage</span> for your digital assets
              </p>
              
              {/* Tech accent lines bottom */}
              <div className="absolute -bottom-2 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60" />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Stats badges */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl px-6 py-3 border border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-sm text-slate-400">Total Files</span>
                    <div className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {files.length}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl px-6 py-3 border border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-sm text-slate-400">Storage</span>
                    <div className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                      Secure
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`relative group overflow-hidden transition-all duration-500 ${
              dragActive 
                ? 'scale-105' 
                : 'hover:scale-[1.02]'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 backdrop-blur-xl ${
              dragActive 
                ? 'border-cyan-400 bg-slate-800/60 shadow-2xl shadow-cyan-500/20' 
                : 'border-slate-700/50 hover:border-cyan-500/50 bg-slate-800/30 hover:bg-slate-800/50'
            }`}>
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Corner tech accents */}
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-slate-600/30 group-hover:border-cyan-400/60 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-slate-600/30 group-hover:border-indigo-400/60 transition-colors duration-500" />

              <div className="text-center relative z-10">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-3xl flex items-center justify-center mb-6 border border-slate-600/30 group-hover:border-cyan-400/40 transition-all duration-500 shadow-lg group-hover:shadow-cyan-500/20 backdrop-blur-sm"
                >
                  <Upload className="w-10 h-10 text-cyan-400" />
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Upload Files
                </h3>
                <p className="text-slate-400 mb-6 text-lg">
                  {dragActive ? 'Drop files here to upload' : 'Drag and drop files here, or click to browse'}
                </p>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  ref={inputRef}
                  className="hidden"
                />
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: uploading ? [0, 0] : [-100, 250] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover/btn:opacity-100"
                  />

                  {uploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full relative z-10"
                      />
                      <span className="relative z-10">Processing Upload...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 relative z-10 text-cyan-300" />
                      <span className="relative z-10">Choose Files</span>
                      <Upload className="w-5 h-5 relative z-10 group-hover/btn:translate-y-[-2px] transition-transform duration-300" />
                    </>
                  )}
                </motion.button>

                {/* Upload stats */}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">
                      <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-30" />
                    </div>
                    <span>Instant Upload</span>
                  </div>
                  <div className="w-px h-4 bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full">
                      <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-ping opacity-30 delay-500" />
                    </div>
                    <span>Encrypted Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 shadow-lg text-white placeholder-slate-400 transition-all duration-300 hover:bg-slate-800/60"
            />
            {/* Search glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-6 py-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 shadow-lg text-white cursor-pointer hover:bg-slate-800/60 transition-all duration-300"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
              <option value="archives">Archives</option>
            </motion.select>
            
            <div className="flex bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-4 transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-4 transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Files Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {filteredFiles.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-600/30"
              >
                <File className="w-12 h-12 text-slate-400" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Vault is Empty
              </h3>
              <p className="text-slate-400 text-lg">
                {searchTerm || filterType !== 'all' 
                  ? 'No files match your search criteria' 
                  : 'Upload your first file to secure your digital assets'
                }
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{
                    scale: 1.05,
                    translateY: -8,
                  }}
                  className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  {/* Tech border animation */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-transparent to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-2xl border border-slate-600/30 group-hover:border-cyan-400/40 transition-all duration-500 shadow-lg backdrop-blur-sm"
                      >
                        {getFileIcon(file.mimeType)}
                      </motion.div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(file._id)}
                          className="p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group/btn"
                          title="Download"
                        >
                          <Download className="w-4 h-4 group-hover/btn:translate-y-[-1px] transition-transform duration-300" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteDialog(file._id, file.filename)}
                          className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group/btn"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:translate-y-[-1px] transition-transform duration-300" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-bold text-white truncate text-lg group-hover:scale-105 transition-transform duration-300" title={file.filename}>
                        {file.filename}
                      </h3>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 group-hover:w-12 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Size:</span>
                        <span className="font-medium text-cyan-400">{formatFileSize(file.size)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Uploaded:</span>
                        <span className="font-medium text-indigo-400">{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Corner tech accent */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-slate-600/30 group-hover:border-cyan-400/60 transition-colors duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/60 backdrop-blur-xl">
                    <tr>
                      <th className="text-left py-6 px-8 font-bold text-white text-lg">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-cyan-400" />
                          File
                        </div>
                      </th>
                      <th className="text-left py-6 px-8 font-bold text-white text-lg">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-indigo-400" />
                          Size
                        </div>
                      </th>
                      <th className="text-left py-6 px-8 font-bold text-white text-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-purple-400" />
                          Uploaded
                        </div>
                      </th>
                      <th className="text-left py-6 px-8 font-bold text-white text-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredFiles.map((file, index) => (
                      <motion.tr
                        key={file._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className="hover:bg-slate-700/30 transition-all duration-300 group"
                      >
                        <td className="py-6 px-8">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              className="p-3 bg-slate-800/60 rounded-2xl border border-slate-600/30 group-hover:border-cyan-400/40 transition-all duration-300"
                            >
                              {getFileIcon(file.mimeType)}
                            </motion.div>
                            <div className="flex-1">
                              <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors duration-300" title={file.filename}>
                                {file.filename.length > 40 ? file.filename.substring(0, 40) + '...' : file.filename}
                              </div>
                              <div className="text-sm text-slate-400 capitalize mt-1">
                                {file.mimeType.split('/')[1]} file
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {formatFileSize(file.size)}
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="text-slate-300 font-medium">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(file.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownload(file._id)}
                              className="inline-flex items-center px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-all duration-300 backdrop-blur-sm group/btn"
                            >
                              <Download className="w-4 h-4 mr-2 group-hover/btn:translate-y-[-1px] transition-transform duration-300" />
                              Download
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openDeleteDialog(file._id, file.filename)}
                              className="inline-flex items-center px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 hover:border-red-400/50 rounded-xl transition-all duration-300 backdrop-blur-sm group/btn"
                            >
                              <Trash2 className="w-4 h-4 mr-2 group-hover/btn:translate-y-[-1px] transition-transform duration-300" />
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer Tech Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm px-4"
        >
          {[
            { icon: <Shield className="w-4 h-4" />, text: "End-to-End Encrypted", color: "text-cyan-400" },
            { icon: <Database className="w-4 h-4" />, text: "Secure Cloud Storage", color: "text-blue-400" },
            { icon: <Zap className="w-4 h-4" />, text: "Lightning Fast Access", color: "text-indigo-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "linear"
                }}
                className={stat.color}
              >
                {stat.icon}
              </motion.div>
              <span className="text-slate-300 font-medium">{stat.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        fileName={deleteDialog.fileName}
      />
    </div>
  );
};

export default ZoroVault;