insert into users
( name,
    username,
    email,
    city,
    state
)
values
('Amelia', 'Amelia', 'amelia@amelia.com', 'Decatur', 'GA'),
('Clare', 'Clare', 'clare@clare.com', 'Mableton', 'GA');

insert into events (
    artist,
    venue,
    location,
    date
) values 
('Sylvan Esso', 'Tabernacle', 'Atlanta GA', '2019-06-05'),
('Amelia', 'Roxy', 'Portland OR', '2020-01-01'),
('Drake', 'Statefarm Arena', 'Atlanta GA', '2018-11-16');

insert into user_shows (
    user_id,
    event_id
) values
(1,1),
(2,2);

insert into friends (
    user_id,
    friend_id
) values
(1, 2),
(2, 1);
