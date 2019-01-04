const db = require('./db');

class Event {
    constructor(id, artist_id, venue, location, date) {
        this.id = id;
        this.artist_id = artist_id;
        this.venue = venue;
        this.location = location;
        this.date = date;
    }

    // *********************
    // CRUD - RETRIEVE only
    // *********************

    static getEventById(id) {
        return db.one(`
        SELECT * from events
            WHERE id = $1
        `, [id])
            .then(result => {
                const e = new Event(result.id, result.artist_id, result.venue, result.location, result.date)
                console.log(e)
                return e;
            })
    }

    static getByArtist(artist) {
        return db.any(`
            select * from events
                where artist ILIKE '%$1:raw%'
        `, [artist]).then(resultsArray => {
            let artistItems = resultsArray.map(itemObj => {
                let e = new Event(itemObj.id, itemObj.artist_id, itemObj.venue, itemObj.location, itemObj.date);
                return e;
            });
            console.log(artistItems)
            return artistItems;
        })
    }

    static getByLocation(location) {
        return db.any(`
            select * from events
                where location ILIKE '%$1:raw%'
        `, [location]).then(resultsArray => {
            let locationItems = resultsArray.map(itemObj => {
                let e = new Event(itemObj.id, itemObj.artist_id, itemObj.venue, itemObj.location, itemObj.date);
                return e;
            });
            console.log(locationItems)
            return locationItems;
        })
    }

    static getShowsForUser(user_id) {
        return db.any(`
        SELECT * FROM user_shows
        WHERE user_id = $1
        `, [user_id])
            .then(async (resultsArray) => {
                // because 

                let eventsArray = await Promise.all(resultsArray.map(async (eventObj) => {
                    return await db.one(`
            SELECT a.name, e.venue, e.location, e.date
            FROM events e
            INNER JOIN artists a
            ON e.artist_id = a.id
            WHERE e.id = $1
            `, [eventObj.event_id])
                        .then(eventObj => {
                            console.log(eventObj);
                            let e = new Event(eventObj.id, eventObj.artist_id, eventObj.venue, eventObj.location, eventObj.date);
                            e.name = eventObj.name;
                            console.log(e);
                            return e;
                        })
                }));
                // .then(result => {
                //     // const u = new User(result.id, result.name, result.username, result.email, result.city, result.state);
                //     console.log(result);
                // })
                console.log(eventsArray);
                console.log('almost there');
                return eventsArray;
            })
    }




}

module.exports = Event;
