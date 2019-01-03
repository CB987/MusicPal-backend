create table users (
    id serial primary key,
    name varchar(50),
    username varchar(20),
    email varchar(50),
    city text,
    state varchar(2)
);

create table artists (
    id serial primary key,
    name text
);

create table events (
    id serial primary key,
    artist_id integer references artists (id),
    venue text,
    location text,
    date DATE
);

create table user_shows (
    id serial primary key,
    user_id integer references users (id),
    event_id integer references events (id)
);

create table user_friends (
    id serial primary key,
    user_id integer references users (id),
    friend_id integer references users (id)
);

create table user_artists (
    id serial primary key,
    artist_id integer references artists (id),
    fan_id integer references users (id)
);