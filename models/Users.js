const db = rewuire('./db');

const bcrypt = require('bcrypt'):
const saltRounds = 10;

class User {
    constructor(id, name, username, email, city, state) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.city = city;
        this.state = state;
    }

    //=======
    // CREATE
    //=======
    static add(name, username, email, city, state) {
        return db.one(`
        INSERT INTO users
        (name, username, email, city, state)
        VALUES
        ($1, $2, $3, $4, $5)
        returning id
        `, [name, username, email, city, state])
            .then(data => {
                const u = new User(data.id, name, username, email, city, state)
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
            .then(resultsArray => {
                let usersArray = resultsArray.map(userObj => {
                    let u = new User(userObj.id, userObj.name, userObj.username, userObj.email, userObj.city, userObj.state);
                    return u;
                });
                return usersArray;
            })
    }

    // static getUsersByGenre(genre) {
    //     return db.any(`
    //     SELECT * FROM users
    //     WHERE genre = $1
    //     `, [genre])
    // }

}

