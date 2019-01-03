require('dotenv').config();

const db = require('./models/db');

const Event = require('./models/Event');

// Event.getByArtist('amelia');

// Event.getByLocation('atlanta');

Event.getShowsForUser(1);