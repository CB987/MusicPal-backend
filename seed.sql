insert into users (
    name,
    username,
    pwhash,
    email,
    city,
    state
) values
('Amelia', 'amelia', '$2b$10$4a3j3GgFfAPXQAn3aDsst.XuVs58ozNsYfRM3a/LAbCz3HUzpCGoS', 'amelia@amelia.com', 'Decatur', 'GA'),
('Jamie',	'jamie',	'$2b$10$hcNfrqNcgDhGCkWb3ZvTJe88umWV5GS7/asFIeeAeOl3KNwsuhiwa',	'jamie@jamie.com',	'Mableton',	'GA'),
('Clare', 'clare', '$2b$10$eTwIGAx0ZtzV/ZjVC5n8WunF9YFY1gJKQU5gyEBrdEVsTMRaQ/zbG', 'clare@clare.com', 'Mableton', 'GA');

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