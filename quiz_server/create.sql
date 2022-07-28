drop table if exists quiz;
drop table if exists tag;

create table tag(
    id char(16) primary key,
    name char(16) unique not null
);

create table quiz(
    id bigint primary key auto_increment,
    question varchar(128) not null,
    answer varchar(512) not null,
    -- 格式:'tag1|tag2|tag3'
    tags char(64) not null,
    -- 题目的重要程度，出题时决定 可选字符串 'important' 'understand' 'know' 'unknown'
    importance char(16) default 'unknown',
    -- 自己的记忆程度，可选字符串 'familiar' 'understand' 'hard' 'unknown',其中unknown是在数据库中还没抽到(背过)的题
    level char(16) default 'unknown',
    -- 最后一次更新理解程度的时间，在出题时就必须登记
    level_time DateTime not null
);