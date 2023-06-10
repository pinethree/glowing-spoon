-- Create the temporary teams table
CREATE TEMPORARY TABLE temp_teams (
  position VARCHAR(5),
  team_name VARCHAR(255),
  points DECIMAL,
  year INT
);

-- Create the temporary races table
CREATE TEMPORARY TABLE temp_races (
  grand_prix VARCHAR(255),
  race_date DATE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  team_name VARCHAR(255),
  laps VARCHAR(10),
  race_time TIME,
  year INT
);

-- Create the temporary drivers table
CREATE TEMPORARY TABLE temp_drivers (
  position VARCHAR(5),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  nationality VARCHAR(255),
  team_name VARCHAR(255),
  points DECIMAL,
  year INT
);

-- Copy data from CSV files into temporary tables
COPY temp_teams (position, team_name, points, year) FROM '/data/teams.csv' CSV HEADER;
COPY temp_races (grand_prix, race_date, first_name, last_name, team_name, laps, race_time, year) FROM '/data/races.csv' CSV HEADER;
COPY temp_drivers (position, first_name, last_name, nationality, team_name, points, year) FROM '/data/drivers.csv' CSV HEADER;

-- Create the teams table to store team information
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

-- Insert data from the temporary table into the teams table
INSERT INTO teams (name)
SELECT DISTINCT team_name
FROM temp_teams;

-- Create the team_points table to store team points for each year
CREATE TABLE team_points (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams (id),
  position VARCHAR(5),
  points INTEGER,
  year INTEGER
);

-- Insert data from the temporary table into the team_points table
INSERT INTO team_points (team_id, position, points, year)
SELECT teams.id, temp_teams.position, temp_teams.points, temp_teams.year
FROM temp_teams
INNER JOIN teams ON teams.name = temp_teams.team_name;

-- Create the drivers table
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  nationality VARCHAR(255)
);

-- Insert data from the temporary table into the drivers table
INSERT INTO drivers (first_name, last_name, nationality)
SELECT DISTINCT first_name, last_name, nationality
FROM temp_drivers;

-- Create the driver_teams table to store driver-team relationships
CREATE TABLE driver_teams (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES drivers (id),
  team_id INTEGER REFERENCES teams (id),
  position VARCHAR(5),
  points INTEGER,
  year INTEGER
);

-- Insert data from the temporary table into the driver_teams table
INSERT INTO driver_teams (driver_id, team_id, position, points, year)
SELECT drivers.id, teams.id, temp_drivers.position, temp_drivers.points, temp_drivers.year
FROM temp_drivers
INNER JOIN drivers ON drivers.first_name = temp_drivers.first_name AND drivers.last_name = temp_drivers.last_name
INNER JOIN teams ON teams.name = temp_drivers.team_name;

-- Create the races table
CREATE TABLE races (
  id SERIAL PRIMARY KEY,
  grand_prix VARCHAR(255),
  race_date DATE,
  winner_id INTEGER REFERENCES drivers (id),
  team_id INTEGER REFERENCES teams (id),
  laps INTEGER,
  race_time INTERVAL,
  year INTEGER
);

-- Insert data from the temporary table into the races table
INSERT INTO races (grand_prix, race_date, winner_id, team_id, laps, race_time, year)
SELECT temp_races.grand_prix, temp_races.race_date, drivers.id, teams.id,
       CASE WHEN temp_races.laps = 'null' THEN NULL ELSE CAST(temp_races.laps AS INTEGER) END,
       temp_races.race_time, temp_races.year
FROM temp_races
INNER JOIN drivers ON drivers.first_name = temp_races.first_name AND drivers.last_name = temp_races.last_name
INNER JOIN teams ON teams.name = temp_races.team_name;
