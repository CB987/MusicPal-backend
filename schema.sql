create table users (
    id serial primary key,
    name varchar(50),
    username varchar(20),
    email varchar(50),
    city text,
    state varchar(2)
);

create table events (
    id serial primary key,
    band text,
    venue text,
    city text,
    state varchar(2),
    date DATE
);

create table user_shows (
    id serial primary key,
    user_id integer references users (id),
    event_id integer references events (id)
);

create table friends (
    id serial primary key,
    user_id integer references users (id),
    friend_id integer references users (id)
);
