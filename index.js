require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//============
//USER METHODS
//============
const User = require('./models/User');

//ADD USER
// User.add('Amelia', 'Amelia', 'amelia@amelia.com', 'Decatur', 'GA');

//GET USER BY ID
// User.getUserById(id);

//GET USERS BY SHOW
// User.getUsersGoingToShow(id);

//UPDATE USER INFO
// User.getUserById(id)
//     .then(userObj => {
//         userObj.updateUserInfo('Steven', 'sKim', 'skim@skim.com', 'Johns Creek', 'GA')
//     });


//DELETE USER
//have to delete from all the tables where it is a foreign key first, then delete from user table
// User.getUserById(id)
//     .then(userObj => {
//         userObj.deleteUserFromEvent();
//         return userObj
//     })
//     .then(userObj => {
//         userObj.deleteUserFromFriendsUsers();
//         return userObj
//     })
//     .then(userObj => {
//         userObj.deleteUserFromFriendsFriends();
//         return userObj
//     })
//     .then(userObj => {
//         userObj.deleteUser();
//     })


//=============
//EVENT METHODS
//=============
const Event = require('./models/Event');

//GET EVENT BY ARTIST
// Event.getByArtist('amelia');

//GET EVENT BY EVENT ID
//Event.getEventById(3);

//GET EVENT BY LOCATION
// Event.getByLocation('atlanta');

//GET EVENTS LIST FOR USER
// Event.getShowsForUser(1);


