drop procedure if exists gettags;

DELIMITER $$

create procedure `interview_stage`.`gettags`(in quiz_id bigint,out tags json)
	BEGIN
		-- 定义一些变量用于接收tag
		-- 定义游标，从tagquizs表联合tag表找对应的tagname
		declare tag_name char(16) default '';
		declare res_tag json;
		declare done int default 0;
		declare cur_tag cursor for select b.`name` from tagquizs a,tag b where a.quizId = quiz_id and a.tagId = b.`id`;
		declare continue handler for not found set done = 1;

		set res_tag = JSON_ARRAY();
		-- 打开游标，每次取出tag名就添加到tags中
		open cur_tag;
		flag:loop
			fetch cur_tag into tag_name;
			if done = 1 then
				leave flag;
			else
				select JSON_ARRAY_APPEND(res_tag, '$', tag_name) into res_tag;
			end if;
		end loop;
		close cur_tag;
		set tags = res_tag;
	END$$
DELIMITER ;

-- call gettags(1,@tags);
-- select @tags;


drop procedure if exists upload;

DELIMITER $$

CREATE
    PROCEDURE `interview_stage`.`upload`(in repo_id int,in code char(6))
	-- 存储过程体
	BEGIN
		-- 根据repo_id找到repo_name，插入到pub_repo表
		declare repo_name varchar(32);
		-- 定义变量用于接收question,answer,importance
		declare quiz_id bigint;
		declare q varchar(128);
		declare a varchar(2048);
		declare i char(16);
		-- 定义根据repo_id找到与该repo_id相关的quizs的游标
		declare done int default 0;
		declare tags json default '[]';
		declare player_id int;
		declare player_name varchar(16);
		declare cur_quiz cursor for select `id`,`question`,`answer`,`importance` from quiz where `repoId` = repo_id;
		declare continue handler for not found set done = 1;

		select `name`,`playerId` into repo_name,player_id from repo where `id` = repo_id;
		select `name` into player_name from player where id = player_id;
		insert into pub_repo(`code`,`name`,`creator`) values(code,repo_name,player_name);
		-- 循环游标，每次取出一个quiz，就赋予q,a,i三个变量，并去tagquizs表寻找对应的tag，封装成tags，最后插入到pub_quiz表
		open cur_quiz;
		flag:loop
			fetch cur_quiz into quiz_id,q,a,i;
	    	call gettags(quiz_id,tags);
			if done = 1 then
				leave flag;
			else
				insert into pub_quiz(`code`,`question`,`answer`,`importance`,`tags`) values(code,q,a,i,tags);
				set tags = '[]';
				set q = '';
				set a = '';
				set i = '';
			end if;
			end loop;
		close cur_quiz;
	END$$

DELIMITER ;

-- call upload(1,'x54tg5',@result);

drop procedure if exists deal_tags;

DELIMITER $$
-- 分解pub_quiz中的tags，对于每个tag，在tag表中寻找是否存在，如果存在则与当前quiz_id建立关联
-- 否则在quiz表中新建tag，再建立关联
create procedure `interview_stage`.`deal_tags`(in tags json,in quiz_id bigint,in _player_id int)
    BEGIN
        declare cur_tag varchar(16);
        declare tag_len int default 0;
        declare i int default 0;
        declare if_exists int default 0;
        declare prefix char(3) default '$[';
        declare sufix char(2) default ']';
        declare json_index varchar(6);
        declare tag_id int default 0;

        select JSON_LENGTH(tags) into tag_len;

        flag:loop
            if (i >= tag_len) then
                leave flag;
            end if;
            select CONCAT(prefix,i,sufix) into json_index;
            -- json_index=>$[0]，$[1]...
            select JSON_UNQUOTE(JSON_EXTRACT(tags,json_index)) into cur_tag;
            -- 在tag表中找是否存在这个tag
            select count(*) into if_exists from tag where `name` = cur_tag;
            -- select cur_tag;
            if(if_exists = 0) then
                insert into tag(`name`) values(cur_tag);
            end if;

            select id into tag_id from tag where `name` = cur_tag;
            insert into tagquizs(`tagId`,`quizId`,`playerId`) values(tag_id,quiz_id,_player_id);
            
            set i = i + 1;
        end loop;
    END$$
DELIMITER ;

-- set @tags = '["what","fuck"]';

-- call deal_tags(@tags,1);


drop procedure if exists download;

DELIMITER $$

create procedure `interview_stage`.`download`(in player_id int,in _code char(6))
    BEGIN
        -- 在pub_repo中找到对应code的题库，并插入到用户的题库中
        declare repo_name varchar(32);
        declare repo_id int default 0;
        declare q varchar(128);
        declare a varchar(2048);
        declare i char(16);
        declare my_tags json default '[]';
        declare done int default 0;
        declare cur_id bigint;
		declare ifdup int default 0;
		declare _download_time int;
        declare cur_quiz cursor for select question,answer,importance,tags from pub_quiz where `code` = _code;
        declare continue handler for not found set done = 1;
        
        select `name` into repo_name from pub_repo where `code` = _code;
		-- 检查该用户的题库中是否存在同名的题库，若存在，则在要插入的题库后添加后缀*
		select count(*) into ifdup from repo where playerId = player_id and `name` = repo_name limit 1;
		select ifdup;
		if ifdup > 0 then
			select CONCAT(repo_name,'*') into repo_name;
		end if;
        insert into repo(playerId,`name`,origin) values(player_id,repo_name,_code); 
        select id into repo_id from repo where `playerId` = player_id and `name` = repo_name;

        open cur_quiz;
        flag:loop
            fetch cur_quiz into q,a,i,my_tags;
            select my_tags;
            if (done = 1) then
				leave flag;
			else
				-- 插入quiz表
                insert into quiz(`repoId`,`question`,`answer`,`importance`) values(repo_id,q,a,i);
                -- 查找该quiz的id
                select id into cur_id from quiz where `repoId` = repo_id and `question` = q;
                -- 对tags处理,关联tag表
                call deal_tags(my_tags,cur_id,player_id);
			end if;
		end loop;
		close cur_quiz;
		-- 给该公共题库的下载次数+1
		select download_time into _download_time from pub_repo where code = _code;
		set _download_time = _download_time + 1;
		update pub_repo set download_time = _download_time where code = _code;
    END$$
DELIMITER ;

-- call download(1,'x54tg5');