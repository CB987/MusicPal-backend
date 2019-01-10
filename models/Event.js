const db = require('./db');

class Event {
    constructor(id, artist, venue, city, state, date) {
        this.id = id;
        this.artist = artist;
        this.venue = venue;
        this.city = city;
        this.state = state;
        this.date = date;
    }

    //**********
    // CREATE */
    //********** 

    static addEvent(id, artist, venue, city, state, date) {
        return db.one(`
            INSERT INTO events
            (id, artist, venue, city, state, date)
            VALUES
            ($1, $2, $3, $4, $5, $6)
            returning id
            `, [id, artist, venue, city, state, date])
            .then(data => {
                const e = new Event(id, artist, venue, city, state, date)
                return e;
            })
    }

    // static addEventFromAPI

    // ********
    // RETRIEVE
    // ********

    static getEventById(id) {
        return db.one(`
        SELECT * from events
        WHERE id = $1
            `, [id])
            .then(result => {
                const e = new Event(result.id, result.artist, result.venue, result.city, result.state, result.date)
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
                let e = new Event(itemObj.id, itemObj.artist, itemObj.venue, itemObj.city, itemObj.state, itemObj.date);
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
                let e = new Event(itemObj.id, itemObj.artist, itemObj.venue, itemObj.city, itemObj.state, itemObj.date);
                return e;
            });
            console.log(locationItems)
            return locationItems;
        })
    }

    static getFilteredShows(searchTerm) {
        return db.any(`
        SELECT * from events
        WHERE (artist ILIKE '%$1:raw%' OR city ILIKE '%$1:raw%')
            `, [searchTerm])
            .then(eventObjArray => {
                // console.log(eventObjArray)
                return eventObjArray;
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
        SELECT *
        FROM events
        WHERE id = $1
            `, [eventObj.event_id])
                        .then(eventObj => {
                            console.log(eventObj);
                            let e = new Event(eventObj.id, eventObj.artist, eventObj.venue, eventObj.city, eventObj.state, eventObj.date);
                            console.log(e);
                            return e;
                        })
                }));
                console.log(eventsArray);
                console.log('almost there');
                return eventsArray;
            })
    }

}

module.exports = Event;
