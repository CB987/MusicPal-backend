insert into users (
    name,
    username,
    pwhash,
    email,
    home
) values
('Amelia', 'amelia', '$2b$10$4a3j3GgFfAPXQAn3aDsst.XuVs58ozNsYfRM3a/LAbCz3HUzpCGoS', 'amelia@amelia.com', 'Decatur, GA'),
('Jamie',	'jamie',	'$2b$10$hcNfrqNcgDhGCkWb3ZvTJe88umWV5GS7/asFIeeAeOl3KNwsuhiwa',	'jamie@jamie.com',	'Mableton, GA'),
('Clare', 'clare', '$2b$10$eTwIGAx0ZtzV/ZjVC5n8WunF9YFY1gJKQU5gyEBrdEVsTMRaQ/zbG', 'clare@clare.com', 'Mableton, GA');

insert into artists (
    name
) values
('Elton John'),
('Justin Timberlake'),
('Meiko');

insert into events (
    id,
    artist,
    venue,
    city,
    state,
    date
) values 
('E0-001-118770124-8', 'Elton John', 'Boise State University - Taco Bell Arena', 'Boise', 'ID', '2019-01-11 20:00:00'),
('E0-001-111352112-8', 'Justin Timberlake', 'State Farm Arena (Formerly Philips Arena)', 'Atlanta', 'GA', '2019-01-10 19:30:00'),
('E0-001-121493856-2', 'Meiko in Los Angeles!', 'The Hotel Cafe', 'Los Angeles', 'CA', '2019-02-20 20:00:00');

insert into user_shows (
    user_id,
    event_id
) values
('3','E0-001-121493856-2'),
('1','E0-001-118770124-8'),
('3','E0-001-111352112-8'),
('2','E0-001-121493856-2');

insert into user_friends (
    user_id,
    friend_id
) values
('1', '2'),
('1', '3'),
('2', '1'),
('2', '3'),
('3', '1'),
('3', '2');

insert into user_artists (
    user_id,
    artist_id
) values 
('1', '1'),
('1', '3'),
('2', '2'),
('3', '1');