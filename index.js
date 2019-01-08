require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');
const axios = require('axios');
const API_KEY = process.env.EVENTFUL_API_KEY;

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

// =========================
// Protecting User Account
// =========================
function protectRoute(req, res, next) {
    let isLoggedIn = req.session.user ? true : false;
    
    if (isLoggedIn) {
        console.log(`${req.session.user} is logged in`);
        next();
    } else {
        console.log('not logged in');
        res.redirect('/login')
    }
}

app.use((req, res, next) => {
    let isLoggedIn = req.session.user ? true : false;
    console.log(`on ${req.path}, is a user logged in? ${isLoggedIn}`);
    next();
});

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
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const newEmail = req.body.email;
    const newCity = req.body.city;
    const newState = req.body.state;
    const newName = req.body.name;

    User.add(newName, newUsername, newPassword, newEmail, newCity, newState)
        .then((newUser) => {

                req.session.user = newUser;
                req.session.save(() => {
                    res.redirect('/profile')
                })

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
                req.session.user = theUser
                console.log(`you're in`)
                console.log(`${req.session.user.username}`)
                req.session.save(() => {
                    res.redirect('/profile');
                })

            } else {
                console.log(`you're out`)
                res.redirect('/login');
            }

        })
})

// =====================
// User Profile
// =====================
app.get('/profile', protectRoute, (req, res) => {
    const username = req.session.user.username
    const userCity = req.session.user.state
    const userInfo = {username, userCity}
    // let isLoggedIn = req.session.user ? true : false;
    res.send(userInfo)
})

//GET USER BY ID
app.get('/myInfo', (req, res) => {
    User.getUserById(1)
        .catch(user => {
            res.send(user);
            console.log('sending user info like a muthafucka')
        })
})

//GET USERS BY SHOW
app.get('/showUsers', (req, res) => {
    User.getUsersGoingToShow(1)
        .then(shows => {
            res.send(shows);
            console.log('shows. BAM');
        })
})

//GET FRIENDS BY USER
app.get('/myFriends', (req, res) => {
    User.getFriendsOfUser(1)
        .then(friends => {
            res.send(friends);
            console.log('friends are the glue that sticks concerts together');
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

//=============
//EVENTS FROM API
//=============
const APIEvent = require('./models/APIEvent');

// let location;
// let keyword;

app.post('/APIeventList', (req, res) => {
    console.log(req.body.searchLocation);
    let location = req.body.searchLocation;
    let keyword = req.body.searchKeyword;
    console.log(req.body.searchKeyword);
    let artist = req.body.searchArtist;
    console.log(req.body.searchArtist);

    // })

    // app.get('/APIEventList', (req, res) => {
    //     console.log(req.body.searchTerm)
    // keyword = req.body.searchTerm;
    const APIEvents = async () => {
        try {
            return await axios.get(`http://api.eventful.com/json/events/search?`, {
                // app_key=${API_KEY}&keywords=concert+music+${keyword}&location=Atlanta+GA&date=This+Weekend&page_size=25
                params: {
                    app_key: `${API_KEY}`,
                    keywords: `concert music ${artist} ${keyword}`,
                    location: `${location}`,
                    date: `future`,
                    page_size: 25,
                    sort_order: `date`
                }
            })
        }

        catch (error) {
            console.error(error)
        }
    }
    const events = (APIEvents()
        .then(data => {
            console.log(data.data.total_items);
            console.log('^^ data ends');
            let eventArray;

            if (data.data.total_items === '0') {
                console.log('this is the if');
                eventArray = [{ artist: null }];
                // return eventArray;
            }
            else {
                console.log('this is the else');
                eventArray = data.data.events.event.map(eventObj => {

                    let a = new APIEvent(

                        eventObj.title,
                        eventObj.venue_name,
                        eventObj.city_name,
                        eventObj.region_abbr,
                        eventObj.start_time)
                    console.log(a);
                    return a;
                })
            }

            return eventArray
            // res.send(eventArray)
            // }
        })

        .then(eventArray => {
            res.send(eventArray);
        })
        .catch(error => {
            console.error(error)
        }))
    console.log('api call nailed!');
})

app.post('/addShowToDb', (req, res) => {
    APIEvent.addAPIEvent(
        req.session.user, req.body.title, req.body.venue, req.body.city, req.body.state, req.body.date
    ).then(info => {
        Artist.add(info.req.body.title);
        return Artist.id;
        return info;
    })
        .then(info => {
            Event.addEvent(Artist.id, info.req.body.venue, info.req.body.city, info.req.body.state, info.req.body.date);
            return event.id;
            return info;
        }).then(info => {
            User.getUserById(info.req.session.user).addUserGoingToShow(event.id);
        })
})


// ==================================================
// Logout
// ====================================================

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        // console.log('you have logged out')
        res.redirect('/login')
    })
    
    
});




app.listen(5000, () => {
    console.log('what the hell');
});