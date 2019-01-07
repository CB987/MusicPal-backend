require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session modules
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);

app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: 'abc123kasfsdbukbfrkqwuehnfioaebgfskdfhgcniw3y4fto7scdghlusdhbv',
    saveUninitialized: false
}));


//============
//USER METHODS
//============
const User = require('./models/User');

//ADD USER
// User.add('Amelia', 'Amelia', 'amelia@amelia.com', 'Decatur', 'GA');

// =====================
// User registration
// =====================

app.post('/register', (req, res) => {
    const newUsername= req.body.username;
    const newPassword= req.body.password;
    const newEmail = req.body.email;
    const newCity = req.body.city;
    const newState = req.body.state;
    const newName = req.body.name;

    User.add(newName, newUsername, newPassword, newEmail, newCity, newState)
        .then((newUser) => {
                req.session.user = newUser;
                res.redirect('/profile')
            });
        }
)

// =====================
// User Login
// =====================
app.post('/login', (req, res) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    User.getByUsername(theUsername)
        .catch((err) => {
            console.log(err);
            res.redirect('/login')
        })
        .then(theUser => {
            if (theUser.passwordDoesMatch(thePassword)) {
                console.log(`you're in`)
                res.redirect('/profile');
            } else {
                console.log(`you're out`)
                res.redirect('/login');
            }
                
        })
})


//GET USER BY ID
app.get('/myInfo', (req, res) => {
    User.getUserById(1)
        .catch(user => {
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
            console.log('got me some artists');
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

//GET ALL EVENTS
app.get('/eventList', (req, res) => {
    Event.getFilteredShows("")
        .then(results => {
            res.send(results);
            console.log('you get ALL the events')
        })
});

// //SHOW EVENTS FOR SEARCH RESULTS
// app.post('/eventList', (req, res) => {
//     const searchTerm = req.body.searchTerm;

//     Event.getFilteredShows(searchTerm)
//         .then(results => {
//             res.send(results);
//             console.log('hows that for filtered')
//         })
// });



//GET EVENTS LIST FOR USER
app.get('/upcomingShows', (req, res) => {
    Event.getShowsForUser(1)
        .then(shows => {
            res.send(shows);
            console.log('got your user shows right here');
        });
});


app.listen(5000, () => {
    console.log('what the hell');
});