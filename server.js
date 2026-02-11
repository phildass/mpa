const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve iiskills-cloud landing page
app.get('/iiskills-cloud', (req, res) => {
    res.sendFile(path.join(__dirname, 'iiskills-cloud', 'landing.html'));
});

app.get('/iiskills-cloud/landing.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'iiskills-cloud', 'landing.html'));
});

// API endpoint to get app registry
app.get('/iiskills-cloud/apps/registry', (req, res) => {
    res.sendFile(path.join(__dirname, 'iiskills-cloud', 'apps', 'registry.json'));
});

// Download endpoint
app.get('/iiskills-cloud/download', (req, res) => {
    // In a real scenario, this would serve the app package
    // For now, redirect to the landing page with download instructions
    res.redirect('/iiskills-cloud/landing.html?download=true');
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎩 MPA is running at http://localhost:${PORT}`);
    console.log(`📱 iiskills-cloud landing page: http://localhost:${PORT}/iiskills-cloud`);
    console.log('Press Ctrl+C to stop');
});
