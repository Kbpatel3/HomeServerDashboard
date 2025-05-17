const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const archiver = require('archiver');

const SHARED_DIR = '/srv/shared-files';

router.get('/list', (req, res) => {
    const subPath = req.query.path || '';
    const targetPath = path.join(SHARED_DIR, subPath);

    fs.readdir(targetPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        const files = items.map(item => {
            const fullPath = path.join(targetPath, item.name);
            const stats = fs.statSync(fullPath);
            return {
                name: item.name,
                type: item.isDirectory() ? 'directory' : 'file',
                size: item.isDirectory() ? null : stats.size,
                mtime: stats.mtime,
            };
        });

        res.json({ path: subPath, files });
    });
});

router.get('/download', (req, res) => {
    const filePath = path.join(SHARED_DIR, req.query.path || '');
    res.download(filePath, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).json({ error: 'Failed to download file' });
        }
    });
});

router.post("/upload", upload.array("files"), (req, res) => {
    const subPath = req.body.path || "";
    const targetDir = path.join(SHARED_DIR, subPath);
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
  
    try {
      req.files.forEach((file) => {
        const destPath = path.join(targetDir, file.originalname);
        fs.writeFileSync(destPath, file.buffer);
      });
      res.json({ message: "Files uploaded successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get("/download-zip", (req, res) => {
    const subPath = req.query.path || "";
    const dirPath = path.join(SHARED_DIR, subPath);
  
    res.setHeader("Content-Disposition", "attachment; filename=folder.zip");
    res.setHeader("Content-Type", "application/zip");
  
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.directory(dirPath, false);
    archive.pipe(res);
    archive.finalize();
});

module.exports = router;