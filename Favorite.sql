create database favorite;

use favorite;

-- DROP TABLE IF EXISTS user;

-- 회원정보 테이블
create table user(
    auto_id int auto_increment primary key,         -- 내부적으로 사용하는 고유 식별자
    user_id varchar(50) not null,                   -- 아이디
    user_name varchar(10) not null,                 -- 사용자 실명    
    user_pw varchar(500) not null,                   -- 비밀번호
    user_salt varchar(500) not null,                -- 비밀번호 암호와 용
    nickname varchar(100) not null,                 --  닉네임
    one_favorite varchar(50) not null,              -- 최애
    created_at datetime default current_timestamp,  -- 가입일시
    profile_picture longblob,                   -- 프로필 사진
    email varchar(100) not null,                    -- 이메일
    user_intro varchar(500) default null,           -- 소개글
    theme varchar(50) not null                      -- 테마     뭐로 하면 좋나요 헥사코드?
    
);

-- 차에 목록 테이블--
create table favorite_list(
    auto_id int not null,									-- 내부적으로 사용하는 고유 식별자
    favorite_number int auto_increment primary key,			-- 차애용 아이디
    star_name varchar(50)									-- 차애 이름
    

    -- foreign key(auto_id) references user(auto_id)     -- 멤버 테이블의 고유 식별자 사용해서 참조
);

-- 내가 좋아요한 게시글 테이블--
create table heart_post(
    auto_id int not null,
    post_id int auto_increment primary key

    -- foreign key(auto_id) references user(auto_id)
);

create table naver(
    naver_id int auto_increment primary key,        -- 각 게시물 고유 id
    date_n date not null,
    naver_title varchar(500),
    content varchar(500),
    naver_url varchar(500),
    heart int,
    thumb_down int

    -- foreign key(auto_id) references user(auto_id)
);

create table youtube(
    youtube_id int auto_increment primary key,      -- 각 게시물 고유 id
    date_y date not null,
    content varchar(500),
    photo longblob,
    video_url varchar(500),
    heart int,
    thumb_down int

    -- foreign key(auto_id) references user(auto_id)
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

   -- foreign key(auto_id) references user(auto_id)
);

create table instagram(
    insta_id int auto_increment primary key,            -- 각 게시물 고유 id
    date_i datetime not null,							-- 업로드 날짜(YYYY-MM-DD HH:MM:SS)
    content text,										-- 피드 내용
    photo longblob,										-- 업로드 사진
    insta_video longblob,								-- 업로드 영상
    heart int,
    thumb_down int

   -- foreign key(auto_id) references user(auto_id)
);
-- 데이터베이스 인코딩 설정
ALTER DATABASE favorite CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 테이블 인코딩 설정
ALTER TABLE twitter CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;