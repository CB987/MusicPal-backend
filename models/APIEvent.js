class APIEvent {
    constructor(artist, venue, city, state, date) {
        this.artist = artist;
        this.venue = venue;
        this.city = city;
        this.state = state;
        this.date = date
    }


    static addAPIEvent(artist, venue, city, state, date) {
        let api = new APIEvent(artist, venue, city, state, date)
        return api;
    }
}

module.exports = APIEvent;