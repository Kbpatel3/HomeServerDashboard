const e = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SHARED_DIR = '/srv/shared-files';

router.get('/list', (req, res) => {
    const subPath = req.query.path || '';
    const targetPath = path.join(SHARED_DIR, subPath);

    fs.readdir(targetPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        const files = items.map(item => ({
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
        }));

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

router.post('/upload', (req, res) => {
    const { file, path: subPath } = req.body;
    const targetPath = path.join(SHARED_DIR, subPath || '', file.name);

    fs.writeFile(targetPath, file.data, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'File uploaded successfully' });
    });
});

module.exports = router;