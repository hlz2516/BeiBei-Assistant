-- 由于在第一次上线测试环境后，我在stage数据库中存储了一些重要数据，因此不再使用create.sql重建表结构(这样会丢失原来的数据)
-- 我会把create.sql还原到commit-id为f935b10aec750af2e6fb3994919f2e660b89984f的这个版本，以这个版本为标准进行表的修改

alter table repo add `desc` varchar(200) default '';
alter table quiz modify column `references` varchar(512);
alter table quiz add `remConutBefore` int default 0;

create table remember_record(
    id bigint primary key auto_increment,
    playerId int not null references player(id),
    quizId bigint not null references quiz(id),
    record_time Timestamp not null
);