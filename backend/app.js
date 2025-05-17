const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const systemRoutes = require('./routes/system');
const fail2banRoutes = require('./routes/fail2ban');
const commandRoutes = require('./routes/commands');
const fileRoutes = require('./routes/files');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/system', systemRoutes);
app.use('/api/fail2ban', fail2banRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
