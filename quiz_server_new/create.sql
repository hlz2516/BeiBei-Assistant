drop table if exists tag;
create table tag(
    id int primary key auto_increment,
    name char(16) unique not null,
    destroy_time Timestamp null
);

drop table if exists player;
create table player(
    id int primary key auto_increment,
    name varchar(16) unique not null,
    password varchar(36) not null,
    destroy_time Timestamp null
);

drop table if exists repo;
create table repo(
    id int primary key auto_increment,
    playerId int references player(id),
    name varchar(32) not null,
    destroy_time Timestamp null
);

drop table if exists quiz;
create table quiz(
    id bigint primary key auto_increment,
    repoId int references repo(id),
    question varchar(128) not null,
    answer varchar(2048) not null,
    -- 通过tagquizs表与quiz表进行多对多关联
    -- tags char(64) not null,
    -- 题目的重要程度，出题时决定 可选字符串 'important' 'understand' 'know' 'unknown'
    importance char(16) default 'unknown',
    -- 自己的记忆程度，可选字符串 'familiar' 'understand' 'hard' 'unknown',其中unknown是在数据库中还没抽到(背过)的题
    level char(16) default 'unknown',
    -- 最后一次更新理解程度的时间，在出题时就必须登记
    last_time Timestamp null,
    destroy_time Timestamp null
);

drop table if exists tagquizs;
create table tagquizs(
    id int primary key auto_increment,
    tagId int references tag(id),
    quizId bigint references quiz(id),
    destroy_time Timestamp null
);