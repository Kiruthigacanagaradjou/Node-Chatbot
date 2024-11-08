const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes'); // Import chat routes

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set Jade as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use the chatbot routes
app.use('/', chatRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Chatbot server running at http://localhost:${port}`);
});

