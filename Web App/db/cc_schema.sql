drop table users;
drop table trips;
drop table activities;
drop table notes;
drop table tasks;
drop table userTrips;
drop table tripSuggestedActivities;
drop table tripItineraryActivities;
drop table tripNotes;
drop table tripTasks;

create table users(
  id int not null auto_increment,
  email text not null,
  password text not null,
  createdDate timestamp default current_timestamp,
  primary key (id)
);

create table trips(
  id int not null auto_increment,
  title text not null,
  city text not null,
  startLocation text not null,
  endLocation text not null,
  tripDate date not null,
  startTime timestamp default 0,
  endTime timestamp default 0,
  categories text not null,
  constraints text not null,
  creatorId int not null,
  createdDate timestamp default 0,
  lastModified timestamp default current_timestamp on update current_timestamp,
  primary key (id)
);

create table activities(
  id int not null auto_increment,
  name text not null,
  description text not null,
  categories text not null,
  duration int not null,
  startTime timestamp default 0,
  creatorId int not null,
  lastEditedId int not null,
  createdDate timestamp default 0,
  lastModified timestamp default current_timestamp on update current_timestamp,
  primary key (id)
);

create table notes(
  id int not null auto_increment,
  title text not null,
  content text not null,
  categories text not null,
  creatorId int not null,
  lastEditedId int not null,
  createdDate timestamp default 0,
  lastModified timestamp default current_timestamp on update current_timestamp,
  primary key (id)
);

create table tasks(
  id int not null auto_increment,
  type text not null,
  relevantActivityIds text not null,
  keepActivityIds text not null,
  currentLocation text not null,
  currentTime timestamp default 0,
  createdDate timestamp default 0,
  lastModified timestamp default current_timestamp on update current_timestamp,
  primary key (id)
);

create table userTrips(
  userId int not null,
  tripId int not null,
  primary key (userId, tripId)
);

create table tripSuggestedActivities(
  tripId int not null,
  activityId int not null,
  primary key (tripId, activityId)
);

create table tripItineraryActivities(
  tripId int not null,
  activityId int not null,
  primary key (tripId, activityId)
);

create table tripNotes(
  tripId int not null,
  noteId int not null,
  primary key (tripId, noteId)
);

create table tripTasks(
  tripId int not null,
  taskId int not null,
  primary key (tripId, taskId)
);