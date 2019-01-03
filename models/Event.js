const db = require('./db');

class Event {
    constructor(id, artist, venue, location, date) {
        this.id = id;
        this.artist= artist;
        this.venue = venue;
        this.location = location;
        this.date = date;
    }
    
    // *********************
    // CRUD - RETRIEVE only
    // *********************
    
    static getByArtist(artist) {
        return db.any(`
            select * from events
                where artist ILIKE '%$1:raw%'
        `, [artist]).then(resultsArray => {
            let artistItems = resultsArray.map(itemObj => {
                let e = new Event(itemObj.id, itemObj.artist, itemObj.venue, itemObj.location, itemObj.date);
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
                let e = new Event(itemObj.id, itemObj.artist, itemObj.venue, itemObj.location, itemObj.date);
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
            SELECT * FROM events
            WHERE id = $1
            `, [eventObj.event_id])
                        .then(eventObj => {
                            let e = new Event(eventObj.id, eventObj.artist, eventObj.venue, eventObj.location, eventObj.date);
                            // console.log(e);
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
