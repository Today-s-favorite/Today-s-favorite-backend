create database favorite;

use favorite;


-- DROP TABLE IF EXISTS favorite_list;
-- DROP TABLE IF EXISTS heart_post;
-- DROP TABLE IF EXISTS naver;
-- DROP TABLE IF EXISTS youtube;
-- DROP TABLE IF EXISTS twitter;
-- DROP TABLE IF EXISTS instagram;
-- DROP TABLE IF EXISTS user;
-- 회원정보 테이블
create table user(
    auto_id int auto_increment primary key,         -- 내부적으로 사용하는 고유 식별자
    user_id varchar(50) not null unique,            -- 아이디
    user_name varchar(50) not null,                 -- 사용자 실명    
    user_pw varchar(255) not null,                  -- 비밀번호
    user_salt varchar(255) not null,                -- 비밀번호 암호와 용
    nickname varchar(100) not null unique,          --  닉네임
    one_favorite varchar(50) not null,              -- 최애
    created_at datetime default current_timestamp,  -- 가입일시
    profile_picture longblob,                       -- 프로필 사진
    email varchar(100) not null unique,             -- 이메일
    user_intro varchar(500) default null,           -- 소개글
    theme varchar(50)  default '#FFFFFF'            -- 테마     뭐로 하면 좋나요 헥사코드?
    
);


-- 차애 목록 테이블
create table favorite_list (
    user_info int not null,
    favorite_number int auto_increment primary key,
    star_name varchar(50),
    constraint fk_user_info foreign key (user_info) references user (auto_id) on delete cascade
);

create table naver(
    naver_id int auto_increment primary key,        -- 각 게시물 고유 id
    date_n date not null,                           -- 업로드 날짜
    naver_title varchar(500) not null,              -- 제목
    content text not null,                          -- 내용
    naver_url varchar(500) not null,                -- urlinstagram
    heart int,
    thumb_down int
);

create table youtube(
    youtube_id int auto_increment primary key,      -- 각 게시물 고유 id
    date_y date not null,                           -- 업로드 날짜
    title varchar(500) not null,                    -- 제목
    photo longblob not null,                        -- 썸네일
    video_url varchar(500) not null,                -- url
    heart int,
    thumb_down int
);

create table twitter(
    twitter_id int auto_increment primary key,      -- 각 게시물 고유 id
    date_t date not null,							-- 업로드 날짜(YYYY-MM-DD)
    content varchar(500),							--	트윗 내용
    photo varchar(500),								-- 트윗 게시 사진 
    post_url varchar(500),							-- 트윗에 링크된 주소
    video_url varchar(500),							-- 트윗에 링크된 영상
    twitter_video longblob,							-- 트윗에 게시된 영상
    heart int,
    thumb_down int
);

create table instagram(
    instagram_id int auto_increment primary key,            -- 각 게시물 고유 id
    date_i datetime not null,							-- 업로드 날짜(YYYY-MM-DD HH:MM:SS)
    content text,										-- 피드 내용
    photo longblob,										-- 업로드 사진
    insta_video longblob,								-- 업로드 영상
    heart int,
    thumb_down int
);

-- 내가 좋아요한 게시글 테이블--
create table heart_post(
    user_info int not null,                                 -- user 고유 식별자 받아올 변수
    post_id int auto_increment primary key,                 -- 사용자가 좋아요 누른 전체 포스트 넘버링
    naver_heart tinyint(1) default null,                    -- 사용자가 좋아요 누른 네이버 포스트 구분용
    youtube_heart tinyint(1) default null,                  -- 사용자가 좋아요 누른 유튜브 포스트 구분용
    twitter_heart tinyint(1) default null,                  -- 사용자가 좋아요 누른 트위터 포스트 구분용
    instagram_heart tinyint(1) default null,                -- 사용자가 좋아요 누른 인스타 포스트 구분용
	naver_post int default null,                    		-- 사용자가 좋아요 누른 네이버 포스트 id 가져오기
    youtube_post int default null,                  		-- 사용자가 좋아요 누른 유튜브 포스트 id 가져오기
    twitter_post int default null,                  		-- 사용자가 좋아요 누른 트위터 포스트 id 가져오기
    instagram_post int default null,                		-- 사용자가 좋아요 누른 인스타 포스트 id 가져오기

    
    constraint fk_user_info2 foreign key(user_info) references user (auto_id) on delete cascade,
    -- 유저 테이블의 고유 식별자 사용해서 참조하고 auto_id 날아가면 삭제
    constraint fk_heart_naver foreign key(naver_post) references naver (naver_id) on delete cascade,
    -- 네이버 테이블의 포스트 id 사용해서 참조, 해당 포스트 날아가면 삭제
    constraint fk_heart_youtube foreign key(youtube_post) references youtube (youtube_id) on delete cascade,
    -- 유튜브 테이블의 포스트 id 사용해서 참조, 해당 포스트 날아가면 삭제
    constraint fk_heart_twitter foreign key(twitter_post) references twitter (twitter_id) on delete cascade,
    -- 트위터 테이블의 포스트 id 사용해서 참조, 해당 포스트 날아가면 삭제
    constraint fk_heart_instagram foreign key(instagram_post) references instagram (instagram_id) on delete cascade
    -- 인스타 테이블의 포스트 id 사용해서 참조, 해당 포스트 날아가면 삭제
); 

-- 데이터베이스 인코딩 설정
ALTER DATABASE favorite CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 테이블 인코딩 설정
ALTER TABLE twitter CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;