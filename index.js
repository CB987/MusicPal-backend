require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require('./models/User');

// User.getUserById(1);
// User.getUsersGoingToShow(2);

const Event = require('./models/Event');

// Event.getByArtist('amelia');
// Event.getByLocation('atlanta');
// Event.getShowsForUser(1);
Event.getEventById(3);

