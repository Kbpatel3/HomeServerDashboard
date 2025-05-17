const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/status', (req, res) => {
    exec('sudo fail2ban-client status', (error, stdout, stderr) => {
        if (error) {
          console.error('Fail2Ban status error:', error);
          console.error('stderr:', stderr);
          return res.status(500).json({ error: 'Failed to get fail2ban status' });
        }
      
        console.log('Fail2Ban status stdout:', stdout);
        res.json({ status: stdout.trim() });
      });
});

router.get('/logs', (req, res) => {
    exec('sudo tail -n 100 /var/log/fail2ban.log', (error, stdout, stderr) => {
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