const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/info', (req, res) => {
    const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuCount: os.cpus().length,
        networkInterfaces: os.networkInterfaces()
    };
    res.json(systemInfo);
});

router.get('/status', (req, res) => {
    const uptime = os.uptime();
    const load = os.loadavg();
    const memory = {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
    };
    res.json({ uptime, load, memory})
})

module.exports = router;