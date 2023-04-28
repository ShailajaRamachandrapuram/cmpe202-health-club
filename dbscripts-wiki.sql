create database gymdb;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	phone varchar(255),
	email varchar(255),
	password varchar(255),
	membership int,
	admin bool,
	PRIMARY KEY (id) 
);

CREATE TABLE user_log
(
	user_id int,
	in_time varchar(255),
	out_time varchar(255),
	is_active bool
);


CREATE TABLE memberships
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	duration varchar(255),
	cost varchar(255),
	location varchar(255),
	PRIMARY KEY (id) 
);


CREATE TABLE schedules
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	s_date DATE,
	s_time TIME,
	duration varchar(255),
	PRIMARY KEY (id) 
);

CREATE TABLE activities
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	PRIMARY KEY (id) 
);


CREATE TABLE user_activities
(
	user_id int NOT NULL,
	activity_id int NOT NULL,
	duration varchar(255),
	activity_date DATE
);

CREATE TABLE user_schedules
(
	user_id int NOT NULL,
	schedule_id int NOT NULL
);

