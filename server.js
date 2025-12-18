const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

const DATAFILE = path.join(__dirname, 'calculations.json');
fs.ensureFileSync(DATAFILE);

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// GET calculations
app.get('/api/calculations', async (req, res) => {
  try {
    const data = await fs.readJson(DATAFILE).catch(() => []);
    // optional filtering: ?weekStart=YYYY-MM-DD or ?lastDays=n
    const { weekStart, lastDays } = req.query;
    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const filtered = data.filter((d) => {
        const t = new Date(d.timestamp);
        return t >= start && t < end;
      });
      if (!filtered || filtered.length === 0) {
        return res.json({ message: 'No data found for this week', data: [] });
      }
      return res.json(filtered);
    }
    if (lastDays) {
      const days = parseInt(lastDays, 10) || 7;
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const filtered = data.filter((d) => new Date(d.timestamp) >= start);
      if (!filtered || filtered.length === 0) {
        return res.json({ message: `No data found for last ${days} days`, data: [] });
      }
      return res.json(filtered);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not read data' });
  }
});

// POST calculation
app.post('/api/calculations', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.type) return res.status(400).json({ error: 'invalid body' });
    const data = await fs.readJson(DATAFILE).catch(() => []);
    data.push(payload);
    await fs.writeJson(DATAFILE, data, { spaces: 2 });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
