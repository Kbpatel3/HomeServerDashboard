const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { stdout } = require('process');

router.post('/reboot', (req, res) => {
    exec('sudo reboot', (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        res.status(200).json({ message: 'Reboot command executed successfully' });
    });
});

router.post('/restart/:service', (req, res) => {
    const service = req.params.service;
    exec(`sudo systemctl restart ${service}`, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        res.status(200).json({ message: `${service} restarted successfully` });
    });
});

router.post('/shutdown', (req, res) => {
    exec('sudo shutdown now', (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        res.status(200).json({ message: 'Shutdown command executed successfully' });
    });
});

router.post("/update", (req, res) => {
    exec("sudo apt update && sudo apt upgrade -y", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr || "Update failed" });
      }
       res.json({ message: stdout || "Update completed" });
    });
});

module.exports = router;