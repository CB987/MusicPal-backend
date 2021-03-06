const db = require('./db');

class Artist {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    //=======
    // CREATE
    //=======
    static add(name) {
        return db.one(`
            INSERT INTO artists
            (name)
            VALUES
            ($1)
            returning id
        `, [name])
            .then(data => {
                const a = new Artist(data.id, name)
                return a;
            })
    };

    static addArtistToUser(name, user_id) {
        return db.one(`
        INSERT into artists
        (name)
        VALUES
        ($1)
        returning id
        `, [name])
            .then(data => {
                const a = new Artist(data.id, name)
                return a
            })
            .then((a) => {
                return db.one(`
            INSERT into user_artists
            (user_id, artist_id)
            VALUES
            ($1, $2)
            returning id
            `, [user_id, a.id])
                    .then(result => {
                        console.log(result)
                    })
            })
    }

    //========
    //RETRIEVE
    //========
    static getArtistById(id) {
        return db.one(`
            SELECT * FROM artists
            WHERE id = $1
        `, [id])
            .then(result => {
                const a = new Artist(result.id, result.name);
                return a;
            })
    }

    static getArtistsByUser(user_id) {
        return db.any(`
            SELECT * FROM user_artists
            WHERE USER_ID = $1
        `, [user_id])
            .then(async (resultsArray) => {
                let artistsArray = await Promise.all(resultsArray.map(async (artistObj) => {
                    return await db.one(`
                        SELECT * FROM artists
                        WHERE id = $1
                    `, [artistObj.artist_id])
                        .then(artistObj => {
                            let a = new Artist(artistObj.id, artistObj.name);
                            // console.log(a);
                            return a;
                        })
                }));
                return artistsArray
            })
    }

    //======
    //DELETE
    //======
    static deleteArtistFromUser(artist_id, user_id) {
        return db.one(`
        DELETE from user_artists
        WHERE (artist_id = $1 AND user_id = $2)
        `, [artist_id, user_id])
    }
}

module.exports = Artist;