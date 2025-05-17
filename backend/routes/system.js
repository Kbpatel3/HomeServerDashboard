const express = require('express');
const router = express.Router();
const os = require('os');
const { exec } = require('child_process');

router.get('/info', (req, res) => {
    const systemInfo = {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuCount: os.cpus().length,
        cpuModel: os.cpus()[0].model,
        networkInterfaces: os.networkInterfaces(),
        time: new Date().toLocaleString(),
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

    exec("df -h --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to get disk usage', stderr });
        }

        const lines = stdout.trim().split('\n').slice(1);
        const disks = lines.map(line => {
            const parts = line.trim().split(/\s+/);
            return {
                filesystem: parts[0],
                size: parts[1],
                used: parts[2],
                available: parts[3],
                usePercent: parts[4],
                mountpoint: parts[5]
            };
        });
    });

    res.json({ uptime, load, memory, disks });
});

module.exports = router;