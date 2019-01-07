const db = require('./db');

const bcrypt= require('bcrypt');
const saltRounds = 10;

// const bcrypt = require('bcrypt');
// const saltRounds = 10;

class User {
    constructor(id, name, username, pwhash, email, city, state) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.pwhash = pwhash;
        this.email = email;
        this.city = city;
        this.state = state;
    }

    //=======
    // CREATE
    //=======
    static add(name, username, password, email, city, state) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return db.one(`
        INSERT INTO users
        (name, username, pwhash, email, city, state)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        returning id
        `, [name, username, hash, email, city, state])
            .then(data => {
                const u = new User(data.id, name, username, hash, email, city, state)
                return u;
            })
    };

    //========
    //RETRIEVE
    //========
    static getUserById(id) {
        return db.one(`
        SELECT * FROM users
        WHERE id = $1
        `, [id])
            .then(result => {
                const u = new User(result.id, result.name, result.username, result.email, result.city, result.state);
                return u;
            })
    }

    static getUsersGoingToShow(event_id) {
        return db.any(`
        SELECT * FROM user_shows
        WHERE event_id = $1
        `, [event_id])
            .then(async (resultsArray) => {
                // because this is querying a linking table, we have to do another query to get back the information about each user. that query takes longer, so we have to do async/await so that the .then won't try and return empty results before it has gotten back the information from sql. furthermore, because it is multiple queries, we need to do a Promise.all around the inner queries so that it will wait and return them all at once. last of all, another async await with the Promise.all ensures that all data is returned at the same time.

                let usersArray = await Promise.all(resultsArray.map(async (userObj) => {
                    return await db.one(`
            SELECT * FROM users
            WHERE id = $1
            `, [userObj.user_id])
                        .then(userObj => {
                            let u = new User(userObj.id, userObj.name, userObj.username, userObj.email, userObj.city, userObj.state);
                            console.log(u);
                            return u;
                        })
                }));
                console.log(usersArray);
                console.log('almost thre');
                return usersArray;
            })
    };

    static getFriendsOfUser(user_id) {
        return db.any(`
            SELECT * FROM user_friends
            WHERE USER_ID = $1
        `, [user_id])
            .then(async (resultsArray) => {
                let friendsArray = await Promise.all(resultsArray.map(async (userObj) => {
                    return await db.one(`
                        SELECT * FROM users
                        WHERE id = $1
                    `, [userObj.friend_id])
                        .then(userObj => {
                            let u = new User(userObj.id, userObj.name, userObj.username, userObj.email, userObj.city, userObj.state);
                            // console.log(u);
                            return u;
                        })
                }));
                return friendsArray;
            })
    };

    // static getUsersByGenre(genre) {
    //     return db.any(`
    //     SELECT * FROM users
    //     WHERE genre = $1
    //     `, [genre])
    // }

    //======
    //UPDATE
    //======
    updateUserInfo(name, username, email, city, state) {
        return db.result(`
        UPDATE users
            SET name = $2, username = $3, email = $4, city = $5, state = $6
            WHERE id= $1;
        `, [this.id, name, username, email, city, state])
            .then(result => {
                console.log(result)
            })
    };

    //======
    //DELETE
    //======
    deleteUserFromEvent() {
        return db.any(`
        DELETE FROM user_shows 
            WHERE user_id = $1;
        `, [this.id]);
    }

    deleteUserFromFriendsUsers() {
        return db.any(`
        DELETE FROM friends 
            WHERE user_id = $1;
        `, [this.id]);
    }

    deleteUserFromFriendsFriends() {
        return db.any(`
        DELETE FROM friends 
            WHERE friend_id = $1;
        `, [this.id]);
    }

    deleteUser() {
        return db.result(`
        DELETE FROM users
            WHERE id = $1 ;
        `, [this.id]);
    }
}

module.exports = User;

