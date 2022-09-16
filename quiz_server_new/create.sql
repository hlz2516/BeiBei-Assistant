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
    origin char(6) default '',
    destroy_time Timestamp null,
    unique index(playerId,name)
);

drop table if exists quiz;
create table quiz(
    id bigint primary key auto_increment,
    repoId int references repo(id),
    question varchar(128) not null,
    answer varchar(2048) not null,
    -- 通过tagquizs表与quiz表进行多对多关联，这里不再记录
    -- tags char(64) not null,
    -- 回答的参考链接
    `references` varchar(256),
    -- 题目的重要程度，出题时决定 可选字符串:'重要' '理解' '了解' '未知'
    importance char(16) default '未知',
    -- 自己的记忆程度，可选字符串:'已熟悉' '已理解' '不理解' '未知',其中未知是在数据库中还没抽到(背过)的题
    level char(16) default '未知',
    -- 最后一次更新理解程度的时间，在出题时就必须登记
    last_time Timestamp null,
    destroy_time Timestamp null
);

drop table if exists tagquizs;
create table tagquizs(
    -- id int primary key auto_increment,
    tagId int not null references tag(id),
    quizId bigint not null references quiz(id),
    -- 为了能让用户根据标签搜索，后台查询更方便快速，增加该字段
    playerId int references player(id),
    destroy_time Timestamp null,
    unique index(tagId,quizId)
);

drop table if exists pub_repo;
create table pub_repo(
    id int primary key auto_increment,
    code char(6) unique not null,
    name varchar(32) unique not null 
);

drop table if exists pub_quiz;
create table pub_quiz(
    id bigint primary key auto_increment,
    code char(6) not null references pub_repo(code),
    question varchar(128) not null,
    answer varchar(2048) not null,
    importance char(16) default 'unknown',
    tags json
);

insert into player(`name`,`password`) values('tom','dc483e80a7a0bd9ef71d8cf973673924');

insert into repo(`name`,playerId) values('前端',1);

insert into quiz(question,answer,repoId) values('ques','ans',1);
insert into quiz(question,answer,repoId) values('ques1','ans1',1);
insert into quiz(question,answer,repoId) values('ques2','ans2',1);

insert into tag(`name`) values('java');
insert into tag(`name`) values('C#');
insert into tag(`name`) values('php');
insert into tag(`name`) values('node');
insert into tag(`name`) values('javascript');


insert into tagquizs(quizId,tagId) values(1,1);
insert into tagquizs(quizId,tagId) values(1,2);
insert into tagquizs(quizId,tagId) values(1,3);
insert into tagquizs(quizId,tagId) values(2,4);
insert into tagquizs(quizId,tagId) values(2,5);
insert into tagquizs(quizId,tagId) values(2,6);