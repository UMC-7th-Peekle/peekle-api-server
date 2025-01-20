-- communities 테이블
ALTER TABLE communities
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- articles 테이블
ALTER TABLE articles
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- article_images 테이블
ALTER TABLE article_images
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- event_category 테이블
ALTER TABLE event_category
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- notice_category 테이블
ALTER TABLE notice_category
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- terms 테이블
ALTER TABLE terms
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- users 테이블
ALTER TABLE users
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- admins 테이블
ALTER TABLE admins
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- article_comment_likes 테이블
ALTER TABLE article_comment_likes
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- article_likes 테이블
ALTER TABLE article_likes
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- events 테이블
ALTER TABLE events
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- event_images 테이블
ALTER TABLE event_images
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- event_schedules 테이블
ALTER TABLE event_schedules
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- event_scraps 테이블
ALTER TABLE event_scraps
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- notices 테이블
ALTER TABLE notices
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- notice_images 테이블
ALTER TABLE notice_images
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- tickets 테이블
ALTER TABLE tickets
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- ticket_messages 테이블
ALTER TABLE ticket_messages
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- ticket_message_images 테이블
ALTER TABLE ticket_message_images
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- user_filters 테이블
ALTER TABLE user_filters
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- user_oauth 테이블
ALTER TABLE user_oauth
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- user_restrictions 테이블
ALTER TABLE user_restrictions
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);

-- user_terms 테이블
ALTER TABLE user_terms
MODIFY COLUMN created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
MODIFY COLUMN updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6);
