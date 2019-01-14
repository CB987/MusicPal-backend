create table users (
    id serial primary key,
    name varchar(50),
    username varchar(20),
    pwhash varchar(100),
    email varchar(50),
    home varchar(50),
    likes text,
    dislikes text,
    pal text
);

create table artists (
    id serial primary key,
    name text
);

create table events (
    id varchar(18) primary key,
    artist varchar(50),
    venue text,
    city text,
    state text,
    date DATE
);

create table user_shows (
    id serial primary key,
    user_id integer references users (id) ON DELETE CASCADE,
    event_id varchar references events (id) ON DELETE CASCADE
);

create table user_friends (
    id serial primary key,
    user_id integer references users (id) ON DELETE CASCADE,
    friend_id integer references users (id) ON DELETE CASCADE
);

create table user_artists (
    id serial primary key,
    user_id integer references users (id) ON DELETE CASCADE,
    artist_id integer references artists (id) ON DELETE CASCADE
);