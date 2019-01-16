class APIEvent {
    constructor(id, artist, venue, city, state, date) {
        this.id = id;
        this.artist = artist;
        this.venue = venue;
        this.city = city;
        this.state = state;
        this.date = date
    }

    //set up to be able to display events from the eventful api call consistently
    static addAPIEvent(id, artist, venue, city, state, date) {
        let api = new APIEvent(id, artist, venue, city, state, date)
        return api;
    }
}

module.exports = APIEvent;