create table peekle_v1.communities
(
    community_id bigint auto_increment
        primary key,
    title        varchar(512)                             not null,
    created_at   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table peekle_v1.articles
(
    article_id   bigint auto_increment
        primary key,
    title        varchar(512)                             not null,
    content      text                                     not null,
    author_id    bigint                                   not null,
    community_id bigint                                   not null,
    created_at   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint articles_ibfk_1
        foreign key (community_id) references peekle_v1.communities (community_id)
            on update cascade
);

create table peekle_v1.article_images
(
    article_image_id bigint auto_increment
        primary key,
    article_id       bigint                                   not null,
    image_url        varchar(512)                             not null,
    sequence         int                                      not null,
    created_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint article_images_ibfk_1
        foreign key (article_id) references peekle_v1.articles (article_id)
            on update cascade
);

create index article_images_articles_article_id_fk
    on peekle_v1.article_images (article_id);

create index articles_communities_community_id_fk
    on peekle_v1.articles (community_id);

create index community_article_user_user_id_fk
    on peekle_v1.articles (author_id);

create table peekle_v1.event_category
(
    category_id bigint auto_increment
        primary key,
    name        varchar(256)                             not null,
    description varchar(512)                             not null,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table peekle_v1.event_schedules
(
    schedule_id     bigint auto_increment
        primary key,
    repeat_type     enum ('daily', 'weekly', 'monthly', 'once') not null,
    repeat_end_date date                                        null,
    start_date      date                                        not null,
    end_date        date                                        null,
    start_time      time                                        null,
    end_time        time                                        null
);

create table peekle_v1.events
(
    event_id          bigint auto_increment
        primary key,
    schedule_id       bigint                                   not null,
    title             varchar(128)                             not null,
    content           text                                     null,
    price             int                                      not null,
    category_id       bigint                                   not null,
    location          varchar(512)                             not null,
    event_url         varchar(1024)                            not null,
    application_start datetime                                 null,
    application_end   datetime                                 null,
    created_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint events_ibfk_1
        foreign key (schedule_id) references peekle_v1.event_schedules (schedule_id)
            on update cascade,
    constraint events_ibfk_2
        foreign key (category_id) references peekle_v1.event_category (category_id)
            on update cascade
);

create table peekle_v1.event_images
(
    image_id   bigint auto_increment
        primary key,
    event_id   bigint                                   not null,
    image_url  varchar(512)                             not null,
    sequence   int                                      not null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint event_images_ibfk_1
        foreign key (event_id) references peekle_v1.events (event_id)
            on update cascade
);

create index event_images_events_event_id_fk
    on peekle_v1.event_images (event_id);

create index events_event_category_category_id_fk
    on peekle_v1.events (category_id);

create index events_event_schedules_schedule_id_fk
    on peekle_v1.events (schedule_id);

create table peekle_v1.notice_category
(
    category_id bigint auto_increment
        primary key,
    name        varchar(512)                             not null,
    description varchar(512)                             not null,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table peekle_v1.terms
(
    term_id     bigint auto_increment
        primary key,
    title       varchar(512)                             null,
    content     text                                     not null,
    is_required tinyint(1)                               not null,
    status      enum ('active', 'inactive', 'pending')   not null,
    version     int         default 0                    not null,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table peekle_v1.users
(
    user_id                   bigint auto_increment
        primary key,
    name                      varchar(128)                             not null,
    nickname                  varchar(128)                             not null,
    birthdate                 date                                     not null,
    gender                    enum ('male', 'female')                  not null,
    phone                     varchar(20)                              not null,
    email                     varchar(512)                             not null,
    last_nickname_change_date date                                     not null,
    profile_image             varchar(1024)                            not null,
    status                    enum ('active', 'dormant', 'terminated') not null,
    last_activity_date        date                                     not null,
    dormant_date              date                                     null,
    termination_date          date                                     null,
    created_at                datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at                datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table peekle_v1.admins
(
    admin_id    bigint auto_increment
        primary key,
    user_id     bigint                                   not null,
    permissions int                                      not null,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint admins_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index admins_users_user_id_fk
    on peekle_v1.admins (user_id);

create table peekle_v1.article_comments
(
    comment_id        bigint auto_increment
        primary key,
    article_id        bigint                                   not null,
    parent_comment_id bigint                                   null,
    author_id         bigint                                   not null,
    comment           varchar(1024)                            not null,
    created_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint article_comments_ibfk_1
        foreign key (article_id) references peekle_v1.articles (article_id)
            on update cascade,
    constraint article_comments_ibfk_2
        foreign key (parent_comment_id) references peekle_v1.article_comments (comment_id)
            on update cascade on delete set null,
    constraint article_comments_ibfk_3
        foreign key (author_id) references peekle_v1.users (user_id)
            on update cascade
);

create table peekle_v1.article_comment_likes
(
    like_id       bigint auto_increment
        primary key,
    comment_id    bigint                                   not null,
    liked_user_id bigint                                   not null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint article_comment_likes_ibfk_1
        foreign key (comment_id) references peekle_v1.article_comments (comment_id)
            on update cascade,
    constraint article_comment_likes_ibfk_2
        foreign key (liked_user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index article_comment_likes_article_comments_comment_id_fk
    on peekle_v1.article_comment_likes (comment_id);

create index article_comment_likes_users_user_id_fk
    on peekle_v1.article_comment_likes (liked_user_id);

create index article_comments_article_comments_comment_id_fk
    on peekle_v1.article_comments (parent_comment_id);

create index article_comments_articles_article_id_fk
    on peekle_v1.article_comments (article_id);

create index article_comments_users_user_id_fk
    on peekle_v1.article_comments (author_id);

create table peekle_v1.article_likes
(
    article_likes_id bigint auto_increment
        primary key,
    article_id       bigint                                   not null,
    liked_user_id    bigint                                   not null,
    created_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint article_likes_ibfk_1
        foreign key (article_id) references peekle_v1.articles (article_id)
            on update cascade,
    constraint article_likes_ibfk_2
        foreign key (liked_user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index article_likes_articles_article_id_fk
    on peekle_v1.article_likes (article_id);

create index article_likes_users_user_id_fk
    on peekle_v1.article_likes (liked_user_id);

create table peekle_v1.event_scraps
(
    event_scrap_id bigint auto_increment
        primary key,
    event_id       bigint                                   not null,
    user_id        bigint                                   not null,
    created_at     datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at     datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint event_scraps_ibfk_1
        foreign key (event_id) references peekle_v1.events (event_id)
            on update cascade,
    constraint event_scraps_ibfk_2
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index event_scrap_events_event_id_fk
    on peekle_v1.event_scraps (event_id);

create index event_scrap_users_user_id_fk
    on peekle_v1.event_scraps (user_id);

create table peekle_v1.notices
(
    notice_id   bigint auto_increment
        primary key,
    category_id bigint                                   not null,
    admin_id    bigint                                   not null,
    title       varchar(512)                             not null,
    content     text                                     not null,
    is_notice   tinyint(1)  default 0                    not null,
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint notices_ibfk_1
        foreign key (category_id) references peekle_v1.notice_category (category_id)
            on update cascade,
    constraint notices_ibfk_2
        foreign key (admin_id) references peekle_v1.admins (admin_id)
            on update cascade
);

create table peekle_v1.notice_images
(
    image_id   bigint auto_increment
        primary key,
    notice_id  bigint                                   not null,
    image_url  varchar(512)                             not null,
    sequence   int                                      not null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint notice_images_ibfk_1
        foreign key (notice_id) references peekle_v1.notices (notice_id)
            on update cascade
);

create index notice_images_notices_notice_id_fk
    on peekle_v1.notice_images (notice_id);

create index notices_admins_admin_id_fk
    on peekle_v1.notices (admin_id);

create index notices_notice_categories_category_id_fk
    on peekle_v1.notices (category_id);

create table peekle_v1.tickets
(
    ticket_id  bigint auto_increment
        primary key,
    title      varchar(512)                                      not null,
    status     enum ('open', 'closed', 'in_progress', 'deleted') not null,
    created_by bigint                                            not null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6)          not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6)          not null,
    constraint tickets_ibfk_1
        foreign key (created_by) references peekle_v1.users (user_id)
            on update cascade
);

create table peekle_v1.ticket_messages
(
    ticket_message_id bigint auto_increment
        primary key,
    ticket_id         bigint                                   not null,
    title             varchar(512)                             not null,
    content           text                                     null,
    created_by        bigint                                   not null,
    created_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint ticket_messages_ibfk_1
        foreign key (ticket_id) references peekle_v1.tickets (ticket_id)
            on update cascade,
    constraint ticket_messages_ibfk_2
        foreign key (created_by) references peekle_v1.users (user_id)
            on update cascade
);

create table peekle_v1.ticket_message_images
(
    image_id          bigint auto_increment
        primary key,
    ticket_message_id bigint                                   not null,
    image_url         varchar(512)                             not null,
    sequence          int                                      not null,
    created_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint ticket_message_images_ibfk_1
        foreign key (ticket_message_id) references peekle_v1.ticket_messages (ticket_message_id)
            on update cascade
);

create index ticket_message_images_ticket_messages_ticket_message_id_fk
    on peekle_v1.ticket_message_images (ticket_message_id);

create index ticket_messages_tickets_ticket_id_fk
    on peekle_v1.ticket_messages (ticket_id);

create index ticket_messages_users_user_id_fk
    on peekle_v1.ticket_messages (created_by);

create index tickets_users_user_id_fk
    on peekle_v1.tickets (created_by);

create table peekle_v1.user_filters
(
    user_filter_id     bigint auto_increment
        primary key,
    user_id            bigint                                   not null,
    date_ascending     tinyint(1)  default 1                    not null,
    price_ascending    tinyint(1)  default 1                    not null,
    distance_ascending tinyint(1)  default 1                    not null,
    category           int                                      not null comment 'bitwise_operation',
    created_at         datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at         datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint user_filters_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index user_filters_users_user_id_fk
    on peekle_v1.user_filters (user_id);

create table peekle_v1.user_local
(
    user_id    bigint                                   not null
        primary key,
    password   varchar(256)                             not null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint user_local_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade
);

create table peekle_v1.user_oauth
(
    user_oauth_id bigint auto_increment
        primary key,
    user_id       bigint                                   not null,
    oauth_id      bigint                                   not null,
    oauth_type    enum ('kakao')                           not null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint user_oauth_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade
);

create index user_oauth_users_user_id_fk
    on peekle_v1.user_oauth (user_id);

create table peekle_v1.user_restrictions
(
    user_restriction_id bigint auto_increment
        primary key,
    user_id             bigint                                   not null,
    admin_id            bigint                                   not null,
    reason              text                                     null,
    ends_at             date                                     null,
    created_at          datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint user_restrictions_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade,
    constraint user_restrictions_ibfk_2
        foreign key (admin_id) references peekle_v1.admins (admin_id)
            on update cascade
);

create index user_restrictions_admins_admin_id_fk
    on peekle_v1.user_restrictions (admin_id);

create index user_restrictions_users_user_id_fk
    on peekle_v1.user_restrictions (user_id);

create table peekle_v1.user_terms
(
    user_terms_id bigint auto_increment
        primary key,
    user_id       bigint                                   not null,
    term_id       bigint                                   not null,
    is_agreed     tinyint(1)                               not null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    constraint user_terms_ibfk_1
        foreign key (user_id) references peekle_v1.users (user_id)
            on update cascade,
    constraint user_terms_ibfk_2
        foreign key (term_id) references peekle_v1.terms (term_id)
            on update cascade
);

create index user_terms_terms_term_id_fk
    on peekle_v1.user_terms (term_id);

create index user_terms_users_user_id_fk
    on peekle_v1.user_terms (user_id);

