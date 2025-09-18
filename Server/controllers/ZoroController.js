const cloudinary = require('../config/cloudinary');
const ZoroFile = require('../models/ZoroFileModel');

// Helper to upload buffer to Cloudinary using promise
function uploadBufferToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'vault',
        public_id: filename.replace(/\.[^/.]+$/, ''), // remove extension for id
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
}

exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploaded = [];

    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, file.originalname);

      const doc = await ZoroFile.create({
        user: req.id,
        public_id: result.public_id,
        url: result.secure_url,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });
      uploaded.push(doc);
    }

    res.status(201).json({ success: true, files: uploaded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const files = await ZoroFile.find({ user: req.id }).sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch files' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await ZoroFile.findOne({ _id: req.params.id, user: req.id });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    // Force browser to download with original filename using Cloudinary attachment flag
    // Cloudinary allows adding `fl_attachment` (or `fl_attachment:filename`) after the `upload/` segment
    // Example: https://res.cloudinary.com/demo/raw/upload/fl_attachment:myfile/sample.txt
    let downloadUrl = file.url;
        // Identify where to inject the attachment flag (handles both /upload/ and /raw/upload/)
    const uploadRegex = /(\/raw)?\/upload\//; // captures optional /raw
    const match = downloadUrl.match(uploadRegex);
    if (match) {
      const index = match.index + match[0].length; // position after 'upload/' segment
      const path = require('path');
      // Use base name without extension for fl_attachment to avoid double extensions and ensure validity
      const baseName = encodeURIComponent(path.parse(file.filename).name);
      downloadUrl = `${downloadUrl.slice(0, index)}fl_attachment:${baseName}/${downloadUrl.slice(index)}`;
    }

    res.json({ success: true, url: downloadUrl, filename: file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await ZoroFile.findOne({ _id: req.params.id, user: req.id });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    try {
      await cloudinary.uploader.destroy(file.public_id, { resource_type: 'raw' });
    } catch (cloudErr) {
      // Log but continue if asset already missing or other non-critical error
      console.error('Cloudinary deletion error:', cloudErr?.message || cloudErr);
    }

    await ZoroFile.deleteOne({ _id: file._id });

    res.json({ success: true, message: 'File deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};