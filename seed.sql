insert into users (
    name,
    username,
    email,
    city,
    state
) values
('Amelia', 'Amelia', 'amelia@amelia.com', 'Decatur', 'GA'),
('Jamie', 'Jamie', 'jamie@jamie.com', 'Mableton', 'GA'),
('Clare', 'Clare', 'clare@clare.com', 'Mableton', 'GA');

insert into artists (
    name
) values
('Sylvan Esso'),
('Panic! At the Disco'),
('Drake');

insert into events (
    artist_id,
    venue,
    location,
    date
) values 
('1', 'Tabernacle', 'Atlanta, GA', '2019-06-05'),
('2', 'Infinite Energy Center', 'Duluth, GA', '2020-01-01'),
('3', 'Statefarm Arena', 'Atlanta, GA', '2018-11-16');

insert into user_shows (
    user_id,
    event_id
) values
('3','1'),
('1','3'),
('3','2'),
('2','2');

insert into user_friends (
    user_id,
    friend_id
) values
('1', '2'),
('2', '1'),
('2', '3');

insert into user_artists (
    user_id,
    artist_id
) values 
('1', '1'),
('1', '3'),
('2', '2'),
('3', '1');