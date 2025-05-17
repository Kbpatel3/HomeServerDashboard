const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/status', (req, res) => {
    exec('fail2ban-client status', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return res.status(500).json({ error: 'Failed to get fail2ban status' });
        }
        const status = stdout.trim();
        res.json({ status });
    });
});

router.get('/logs', (req, res) => {
    exec('tail -n 100 /var/log/fail2ban.log', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return res.status(500).json({ error: 'Failed to get fail2ban logs' });
        }
        const logs = stdout.trim();
        res.json({ logs });
    });
});

router.post('/restart', (req, res) => {
    exec('sudo systemctl restart fail2ban', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return res.status(500).json({ error: 'Failed to restart fail2ban' });
        }
        res.json({ message: 'Fail2ban restarted successfully' });
    });
});

module.exports = router;