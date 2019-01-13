const db = require('./db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// const bcrypt = require('bcrypt');
// const saltRounds = 10;

class User {
    constructor(id, name, username, pwhash, email, home) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.pwhash = pwhash;
        this.email = email;
        this.home = home;
    }

    //=======
    // CREATE
    //=======
    static add(name, username, password, email, home) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return db.one(`
        INSERT INTO users
        (name, username, pwhash, email, home)
        VALUES
        ($1, $2, $3, $4, $5)
        returning id
        `, [name, username, hash, email, home])
            .then(data => {
                const u = new User(data.id, name, username, hash, email, home)
                return u;
            })
    };

    static addUserGoingToShow(id, event_id) {
        return db.one(`
        INSERT INTO user_shows
        (user_id, event_id)
        VALUES
        ($1, $2)
        returning id
        `, [id, event_id])
            .then(result => {
                console.log(result);
            })
    }

    addFriend(friend_id) {
        return db.one(`
        INSERT INTO user_friends
        (user_id, friend_id)
        VALUES
        ($1, $2)
        returning id
        `, [this.id, friend_id])
            .then(result => {
                console.log(result);
            })
    }

    //========
    //RETRIEVE
    //========
    static getUserById(id) {
        return db.one(`
        SELECT * FROM users
        WHERE id = $1
        `, [id])
            .then(result => {
                const u = new User(result.id, result.name, result.username, result.pwhash, result.email, result.home);
                return u;
            })
    }

    static getByUsername(username) {
        return db.one(`
        SELECT * from users
            WHERE username = $1
            `, [username])
            .then(result => {
                return new User(result.id, result.name, result.username, result.pwhash, result.pwhash, result.email, result.home)
            })
    }

    passwordDoesMatch(thePassword) {
        const didMatch = bcrypt.compareSync(thePassword, this.pwhash);
        return didMatch
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
                            let u = new User(userObj.id, userObj.name, userObj.username, userObj.pwhash, userObj.email, userObj.home);
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
                            let u = new User(userObj.id, userObj.name, userObj.username, userObj.pwhash, userObj.email, userObj.home);
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
    updateUserInfo(name, username, pwhash, email, home) {
        return db.result(`
        UPDATE users
            SET name = $2, username = $3, email = $4, home = $5
            WHERE id= $1;
        `, [this.id, name, username, pwhash, email, home])
            .then(result => {
                console.log(result)
            })
    };

    //======
    //DELETE
    //======
    static deleteUserFromEvent(id) {
        return db.any(`
        DELETE FROM user_shows 
            WHERE user_id = $1;
        `, [id]);
    }

    static deleteUserFromFriendsUsers(id) {
        return db.any(`
        DELETE FROM user_friends 
            WHERE user_id = $1;
        `, [id]);
    }

    static deleteUserFromFriendsFriends(id) {
        return db.any(`
        DELETE FROM user_friends 
            WHERE friend_id = $1;
        `, [id]);
    }

    static deleteUser(id) {
        return db.result(`
        DELETE FROM users
            WHERE id = $1 ;
        `, [id]);
    }
}

module.exports = User;

