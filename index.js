require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');
const axios = require('axios');
const API_KEY = process.env.EVENTFUL_API_KEY;
const lastfm_key = process.env.LASTFM_API_KEY;

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
        console.log(`${req.session.user.name} is logged in`);
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

app.get('/API/user/isValid', (req, res) => {
    console.log(req.session);
    console.log(req.session.user);
    let user = req.session.user;
    let isLoggedIn = user ? true : false;
    res.send({
        isLoggedIn,
        user
    })
})

//============
//USER METHODS
//============
const User = require('./models/User');

//ADD USER
// User.add('Amelia', 'Amelia', 'amelia@amelia.com', 'Decatur', 'GA');

// =====================
// User registration
// =====================

app.post('/API/register', (req, res) => {
    const newUsername = req.body.username;

    User.getByUsername(newUsername)
        .then((doesExist) => {
            console.log(doesExist)
            if (doesExist) {
                console.log('this user already exists')
                res.json({ status: "taken" })
            }

        })
        .catch((err) => {
            console.log('theres been an error')
            console.log('new user added')
            const newPassword = req.body.password;
            const newEmail = req.body.emailAddress;
            const newHome = req.body.home;
            const newName = req.body.name;
            const newLikes = req.body.likes;
            const newDislikes = req.body.dislikes;
            const newPal = req.body.pal;

            User.add(newName, newUsername, newPassword, newEmail, newHome, newLikes, newDislikes, newPal)
                .then((newUser) => {
                    req.session.user = newUser;
                    req.session.save(() => {
                        res.json({ status: "good to go" })
                    })
                })

        });
});

// =====================
// User Login
// =====================
app.post('/API/login', (req, res) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    User.getByUsername(theUsername)


        .then((theUser) => {
            console.log(theUser)
            if (theUser.passwordDoesMatch(thePassword)) {
                req.session.user = theUser
                console.log(`you're in`)
                console.log(`${req.session.user.username}`)
                req.session.save(() => {
                    res.json({ status: 'good to go' })
                })

            } else {
                console.log('username or password incorrect')
                res.json({ status: 'incorrect' })
            }
        })
})


// =====================
// User Profile
// =====================
app.get('/API/profile', protectRoute, (req, res) => {

    User.getUserById(req.session.user.id)
        .then(user => {
            res.send(user);
            console.log(`sending ${user.likes} info like a mutha`)
        })
})

// ==================
// Other User Methods
// ==================
//GET USER BY ID
app.get('/myInfo', (req, res) => {
    User.getUserById(res.session.user.id)
        .catch(user => {
            res.send(user);
            console.log('sending user info like a muthafucka')
        })
})
//GET USERS BY SHOW
app.post('/showUsers', (req, res) => {
    console.log(req.body.eventID)
    let eventID = req.body.eventID;
    User.getUsersGoingToShow(eventID)
        .then(shows => {
            res.send(shows);
            console.log('shows. BAM');
        })
})

//ADD USER GOING TO SHOW
app.post('/addUserGoingToShow', (req, res) => {
    console.log(`${req.session.user.username} wants to see ${req.body.eventID} like a boss`)
    let eventID = req.body.eventID;
    User.addUserGoingToShow(req.session.user.id, eventID)
        .then(shows => {
            res.send(shows);
            console.log('confirm boss status');
        })
})

//GET FRIENDS BY USER
app.get('/myFriends', (req, res) => {
    User.getFriendsOfUser(req.session.user.id)
        .then(friends => {
            res.send(friends);
            console.log('friends are the glue that sticks concerts together');
        });
});

//GET USER AS PAL
app.post('/palProfile', (req, res) => {
    console.log('HELLO')
    User.getUserById(req.body.userID)
        .then(pal => {
            res.send(pal);
            console.log(`here's the dirt on your friend ${pal.username}`)
        })
})

//GET OTHER USER FRIENDS
app.post('/palFriends', (req, res) => {
    User.getFriendsOfUser(req.body.userID)
        .then(friends => {
            res.send(friends);
            console.log('keep your friends\' friends close...')
        })
})
//UPDATE USER INFO
app.post('/updateUser', (req, res) => {
    User.updateUserInfo(req.session.user.id, req.body.name, req.body.username, req.session.user.pwhash, req.body.email, req.body.home, req.body.likes, req.body.dislikes, req.body.pal)
        .then(newUser => {
            res.send(newUser);
            console.log('user updated?')
        })
});

//ADD USER FRIEND
app.post('/addToUserFriends', (req, res) => {
    console.log(req.body.friend_id)
    User.addFriend(req.session.user.id, req.body.friend_id)
        .then(newFriend => {
            res.send(newFriend);
            console.log('you made a friend!')
        }).catch(error => {
            console.error(error)
        })
})

//DELETE USER
//have to delete from all the tables where it is a foreign key first, then delete from user table
app.get('/deleteAll', (req, res) => {
    console.log('my name is delete')
    // User.deleteUserFromEvent(req.session.user.id)

    //     .then(User.deleteUserFromFriendsUsers(req.session.user.id))

    //     .then(User.deleteUserFromFriendsFriends(req.session.user.id))
    User.deleteUser(req.session.user.id)
        .then(
            console.log('you have been deleted and')

        )

        .then(res.send('your account has been deleted'))

        .catch(error => {
            console.error(error)
        })
});


//==============
//ARTIST METHODS
//==============
const Artist = require('./models/Artist');

// GET USER'S FAVORITE ARTISTS
app.get('/myArtists', (req, res) => {
    Artist.getArtistsByUser(req.session.user.id)
        .then(artists => {
            res.send(artists);
            console.log('got me some artists');
        });
});

//GET OTHER's FAVE ARTISTS
app.post('/palArtists', (req, res) => {
    Artist.getArtistsByUser(req.body.userID)
        .then(artists => {
            res.send(artists);
            console.log('keep their artists closer');
        })
        .catch(error => {
            console.error(error)
        })
});

//DELETE ARTIST FROM USER_ARTISTS
app.post('/deleteArtistFromUser', (req, res) => {
    console.log('wake up! i\'m deleting artists!')
    Artist.deleteArtistFromUser(req.body.artist_id, req.session.user.id)
        .then(artists => {
            res.send(artists);
            console.log(`${req.session.user.name} don't need no stinkin artists`);
        })
        .catch(error => {
            console.error(error)
        })
})

//===================
// Artists from API
//====================
app.post('/APIartistList', (req, res) => {
    console.log(req.body.artistSearch)
    console.log(req.body.searchArtist)
    let artistSearch = req.body.searchArtist;


    const APIArtists = async () => {
        try {
            return await axios.get(`http://ws.audioscrobbler.com/2.0/?`, {
                params: {
                    method: `artist.search`,
                    artist: `${artistSearch}`,
                    api_key: `${lastfm_key}`,
                    format: `json`,
                    limit: `10`
                }
            })
        }

        catch (error) {
            console.error(error)
        }
    }

    const artists = (APIArtists()
        .then(data => {
            const artistResults = data.data.results.artistmatches.artist
            // console.log(data.data.results)
            artistArray = artistResults.map(artistObj => {
                let a = new Artist(
                    artistObj.id,
                    artistObj.name

                )
                console.log(a)
                return a;

            })
            // res.send(artistResults)
            console.log('api artists received')
            return artistArray
            // return artistArray

        }))
        .then(artistArray => {
            res.send(artistArray)
        })
        .catch(error => {
            console.error(error)
        })
});

// ==================
// ADD ARTIST
// ==================
app.post('/addArtistToUser', (req, res) => {

    Artist.addArtistToUser(req.body.artist, req.session.user.id)



    // return info
    // .then (console.log(info)  )          
    // Artist.add(req.body.artist)
    //     .then(() => {

    //     })
    // return info.artist_id
    //     .then(artist => {
    //         info.artist_id = artist.id
    //     })
    //     .then(() => {
    //         Artist.addArtistToUser(req.session.user.id, artist.id )
    //         console.log('artist added to your shows')
    //     })
    // .then(thisArtistInstance => {
    //     thisArtistInstance.addArtistToUser(req.session.user.id, )
    //     console.log('the universe is expanding')
});


//=============
//EVENT METHODS
//=============
const Event = require('./models/Event');

//GET EVENT BY ARTIST
// Event.getByArtist('amelia');

// GET EVENT BY EVENT ID
app.get('/isInDb', (req, res) => {

    Event.getEventById(req.body.eventID)
    then(existingEvent => {
        res.send(existingEvent);
        console.log(`confirm ${event.name} is in db`)
    })

});

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

//GET EVENTS LIST FOR USER LOGGED IN
app.get('/upcomingShows', (req, res) => {
    // let id = req.body.userID
    Event.getShowsForUser(req.session.user.id)
        .then(shows => {
            res.send(shows);
            console.log('got your user shows right here');
        });
});

//GET EVENTS LIST FOR OTHER USER
app.post('/otherShows', (req, res) => {
    console.log(`${req.body.userID} motherfucker`)
    Event.getShowsForUser(req.body.userID)
        .then(shows => {
            res.send(shows);
            console.log('sending other shows');
        });
});

//DELETE EVENT FROM USER
app.post('/deleteEventfromUser', (req, res) => {

    Event.deleteEventfromUserShows(req.body.eventID, req.session.user.id)
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
                        eventObj.id,
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
});

app.post('/addShowToDb', (req, res) => {
    console.log(req.body.artist);
    console.log(req.session.user.username)
    // let info = APIEvent.addAPIEvent(
    //     req.body.eventID,
    //     req.body.artist,
    //     req.body.venue,
    //     req.body.city,
    //     req.body.state,
    //     req.body.date
    // )
    // return Artist.add(req.body.artist)
    //     .then(artist => {
    //         info.artist_id = artist.id
    //     })
    //     .then(() => {
    Event.addEvent(req.body.eventID, req.body.artist, req.body.venue, req.body.city, req.body.state, req.body.date)
        .then(() => {
            User.addUserGoingToShow(req.session.user.id, req.body.eventID)
                .then(() => {
                    res.send('you did it!')
                })
        })
});


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