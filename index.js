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
app.get('/myInfo', (req, res) => {
    User.getUserById(1)
        .then(user => {
            res.send(user);
            console.log('user info transmitted')
        })
})

//GET USERS BY SHOW
app.get('/showUsers', (req, res) => {
    User.getUsersGoingToShow(1)
        .then(shows => {
            res.send(shows);
            console.log(shows);
        })
})

//GET FRIENDS BY USER
app.get('/myFriends', (req, res) => {
    User.getFriendsOfUser(1)
        .then(friends => {
            res.send(friends);
            console.log(friends);
        });
});

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

//==============
//ARTIST METHODS
//==============
const Artist = require('./models/Artist');

// ADD ARTIST
// Artist.add('Meiko');

// GET USER'S FAVORITE ARTISTS
app.get('/myArtists', (req, res) => {
    Artist.getArtistsByUser(1)
        .then(artists => {
            res.send(artists);
            console.log(artists);
        });
});


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
app.get('/upcomingShows', (req, res) => {
    Event.getShowsForUser(1)
        .then(shows => {
            res.send(shows);
            console.log(shows);
        });
});


app.listen(5000, () => {
    console.log('what the hell');
});