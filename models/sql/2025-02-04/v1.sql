create table communities
(
    community_id bigint auto_increment
        primary key,
    title        varchar(512)                              not null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint communities_pk
        unique (title)
);

create table event_category
(
    category_id bigint auto_increment
        primary key,
    name        varchar(256)                              not null,
    description varchar(512)                              not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table event_location_groups
(
    group_id   bigint auto_increment
        primary key,
    name       varchar(512)                              not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table notice_category
(
    category_id bigint auto_increment
        primary key,
    name        varchar(512)                              not null,
    description varchar(512)                              not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table peekling_category
(
    category_id bigint auto_increment
        primary key,
    name        varchar(50)                               not null,
    description varchar(512)                              null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table permissions
(
    permission_id bigint                                    not null
        primary key,
    name          varchar(100)                              not null,
    description   varchar(255)                              null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table roles
(
    role_id        bigint auto_increment
        primary key,
    parent_role_id bigint                                    null,
    name           varchar(128)                              not null,
    description    varchar(512)                              null,
    created_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint roles_roles_role_id_fk
        foreign key (parent_role_id) references roles (role_id)
            on update cascade on delete cascade
);

create table role_permissions
(
    role_id       bigint                                    not null,
    permission_id bigint                                    not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    primary key (role_id, permission_id),
    constraint role_permissions_permissions_permission_id_fk
        foreign key (permission_id) references permissions (permission_id)
            on update cascade on delete cascade,
    constraint role_permissions_roles_role_id_fk
        foreign key (role_id) references roles (role_id)
            on update cascade on delete cascade
);

create table terms
(
    term_id     bigint auto_increment
        primary key,
    title       varchar(512)                              null,
    content     text                                      not null,
    is_required tinyint(1)                                not null,
    status      enum ('active', 'inactive', 'pending')    not null,
    version     int          default 0                    not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

create table users
(
    user_id                   bigint auto_increment
        primary key,
    name                      varchar(128)                                                          not null,
    nickname                  varchar(128)                                                          not null,
    birthdate                 date                                                                  not null,
    gender                    enum ('male', 'female')                                               not null,
    phone                     varchar(20)                                                           not null,
    last_nickname_change_date date                                                                  null,
    profile_image             varchar(1024)                                                         not null,
    status                    enum ('active', 'dormant', 'terminated') default 'active'             not null,
    last_activity_date        timestamp(6)                             default CURRENT_TIMESTAMP(6) not null,
    dormant_date              date                                                                  null,
    termination_date          date                                                                  null,
    created_at                timestamp(6)                             default CURRENT_TIMESTAMP(6) not null,
    updated_at                timestamp(6)                             default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint users_pk
        unique (phone),
    constraint users_pk_2
        unique (nickname)
);

create table articles
(
    article_id   bigint auto_increment
        primary key,
    title        varchar(512)                              not null,
    content      text                                      not null,
    author_id    bigint                                    null,
    is_anonymous tinyint(1)                                not null,
    community_id bigint                                    null,
    created_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at   timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint articles_communities_community_id_fk
        foreign key (community_id) references communities (community_id)
            on update cascade on delete set null,
    constraint articles_users_user_id_fk
        foreign key (author_id) references users (user_id)
            on update cascade on delete set null
);

create table article_comments
(
    comment_id        bigint auto_increment
        primary key,
    article_id        bigint                                    not null,
    parent_comment_id bigint                                    null,
    status            enum ('active', 'deleted', 'reported')    not null,
    author_id         bigint                                    null,
    is_anonymous      tinyint(1)                                not null,
    content           varchar(1024)                             not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint article_comments_article_comments_comment_id_fk
        foreign key (parent_comment_id) references article_comments (comment_id)
            on update cascade on delete cascade,
    constraint article_comments_articles_article_id_fk
        foreign key (article_id) references articles (article_id)
            on update cascade on delete cascade,
    constraint article_comments_users_user_id_fk
        foreign key (author_id) references users (user_id)
            on update cascade on delete set null
);

create table article_comment_likes
(
    like_id       bigint auto_increment
        primary key,
    comment_id    bigint                                    not null,
    liked_user_id bigint                                    not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint article_comment_likes_pk
        unique (comment_id, liked_user_id),
    constraint article_comment_likes_ibfk_1
        foreign key (comment_id) references article_comments (comment_id)
            on update cascade on delete cascade,
    constraint article_comment_likes_ibfk_2
        foreign key (liked_user_id) references users (user_id)
            on update cascade on delete cascade
);

create index article_comment_likes_article_comments_comment_id_fk
    on article_comment_likes (comment_id);

create index article_comment_likes_users_user_id_fk
    on article_comment_likes (liked_user_id);

create table article_images
(
    article_image_id bigint auto_increment
        primary key,
    article_id       bigint                                    not null,
    image_url        varchar(512)                              not null,
    sequence         int                                       not null,
    created_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint article_images_pk
        unique (image_url),
    constraint article_images_articles_article_id_fk
        foreign key (article_id) references articles (article_id)
            on update cascade on delete cascade
);

create table article_likes
(
    article_likes_id bigint auto_increment
        primary key,
    article_id       bigint                                    not null,
    liked_user_id    bigint                                    not null,
    created_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint article_likes_pk
        unique (article_id, liked_user_id),
    constraint article_likes_articles_article_id_fk
        foreign key (article_id) references articles (article_id)
            on update cascade on delete cascade,
    constraint article_likes_users_user_id_fk
        foreign key (liked_user_id) references users (user_id)
            on update cascade on delete cascade
);

create index community_article_user_user_id_fk
    on articles (author_id);

create table events
(
    event_id          bigint auto_increment
        primary key,
    title             varchar(128)                              not null,
    content           text                                      null,
    price             int                                       not null,
    category_id       bigint                                    null,
    location          varchar(512)                              not null,
    location_group_id bigint                                    null,
    event_url         varchar(1024)                             not null,
    application_start datetime                                  null,
    application_end   datetime                                  null,
    created_user_id   bigint                                    null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint events_event_category_category_id_fk
        foreign key (category_id) references event_category (category_id)
            on update cascade on delete set null,
    constraint events_event_location_groups_group_id_fk
        foreign key (location_group_id) references event_location_groups (group_id)
            on update cascade on delete set null,
    constraint events_users_user_id_fk
        foreign key (created_user_id) references users (user_id)
            on update cascade on delete set null
);

create table event_images
(
    image_id   bigint auto_increment
        primary key,
    event_id   bigint                                    not null,
    image_url  varchar(512)                              not null,
    sequence   int                                       not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint event_images_pk
        unique (image_url),
    constraint event_images_events_event_id_fk
        foreign key (event_id) references events (event_id)
            on update cascade on delete cascade
);

create table event_schedules
(
    schedule_id     bigint auto_increment
        primary key,
    event_id        bigint                                                          not null,
    repeat_type     enum ('none', 'daily', 'weekly', 'monthly', 'yearly', 'custom') not null,
    repeat_end_date date                                                            null,
    is_all_day      tinyint(1)                                                      not null,
    custom_text     varchar(512)                                                    not null,
    start_date      date                                                            not null,
    end_date        date                                                            null,
    start_time      time                                                            null,
    end_time        time                                                            null,
    created_at      timestamp(6) default CURRENT_TIMESTAMP(6)                       not null,
    updated_at      timestamp(6) default CURRENT_TIMESTAMP(6)                       not null on update CURRENT_TIMESTAMP(6),
    constraint event_schedules_events_event_id_fk
        foreign key (event_id) references events (event_id)
            on update cascade on delete cascade
);

create table event_scraps
(
    event_scrap_id bigint auto_increment
        primary key,
    event_id       bigint                                    not null,
    user_id        bigint                                    null,
    created_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at     timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint event_scraps_pk
        unique (event_id, user_id),
    constraint event_scraps_pk_2
        unique (event_id, user_id),
    constraint event_scraps_events_event_id_fk
        foreign key (event_id) references events (event_id)
            on update cascade on delete cascade,
    constraint event_scraps_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete set null
);

create index event_scrap_events_event_id_fk
    on event_scraps (event_id);

create index event_scrap_users_user_id_fk
    on event_scraps (user_id);

create table logs
(
    log_id      bigint auto_increment
        primary key,
    action_type varchar(128)                              not null,
    action      varchar(1024)                             not null,
    user_id     bigint                                    null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    constraint logs_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete set null
);

create table notices
(
    notice_id   bigint auto_increment
        primary key,
    category_id bigint                                    null,
    author_id   bigint                                    null,
    title       varchar(512)                              not null,
    content     text                                      not null,
    is_notice   tinyint(1)   default 0                    not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint notices_notice_category_category_id_fk
        foreign key (category_id) references notice_category (category_id)
            on update cascade on delete set null,
    constraint notices_users_user_id_fk
        foreign key (author_id) references users (user_id)
            on update cascade on delete set null
);

create table notice_images
(
    image_id   bigint auto_increment
        primary key,
    notice_id  bigint                                    not null,
    image_url  varchar(512)                              not null,
    sequence   int                                       not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint notice_images_pk
        unique (image_url),
    constraint notice_images_notices_notice_id_fk
        foreign key (notice_id) references notices (notice_id)
            on update cascade on delete cascade
);

create index notices_admins_admin_id_fk
    on notices (author_id);

create index notices_notice_categories_category_id_fk
    on notices (category_id);

create table peekling
(
    peekling_id     bigint auto_increment
        primary key,
    title           varchar(20)                               not null,
    description     varchar(1000)                             null,
    min_people      int                                       not null,
    max_people      int                                       not null,
    schedule        timestamp(6)                              not null,
    category_id     bigint                                    null,
    created_user_id bigint                                    null,
    created_at      timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at      timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint peekling_peekling_category_category_id_fk
        foreign key (category_id) references peekling_category (category_id)
            on update cascade on delete set null,
    constraint peekling_users_user_id_fk
        foreign key (created_user_id) references users (user_id)
            on update cascade on delete set null
);

create table peekling_images
(
    image_id    bigint auto_increment
        primary key,
    image_url   varchar(512)                              not null,
    sequence    int                                       not null,
    peekling_id bigint                                    not null,
    created_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint peekling_images_pk
        unique (image_url),
    constraint peekling_images_peekling_peekling_id_fk
        foreign key (peekling_id) references peekling (peekling_id)
            on update cascade on delete cascade
);

create table refresh_tokens
(
    token_id   bigint auto_increment
        primary key,
    user_id    bigint                                    not null,
    token      varchar(512)                              not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint refresh_tokens_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create table reports
(
    report_id        bigint auto_increment
        primary key,
    type             enum ('user', 'article', 'comment', 'event')                    not null,
    target_id        bigint                                                          not null,
    reported_user_id bigint                                                          null,
    reason           varchar(1024)                                                   not null,
    status           enum ('open', 'pending', 'closed') default 'open'               not null,
    created_at       timestamp(6)                       default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6)                       default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint reports_pk
        unique (target_id, type, reported_user_id),
    constraint reports_users_user_id_fk
        foreign key (reported_user_id) references users (user_id)
            on update cascade on delete set null
);

create table tickets
(
    ticket_id       bigint auto_increment
        primary key,
    title           varchar(512)                                      not null,
    status          enum ('open', 'closed', 'in_progress', 'deleted') not null,
    created_user_id bigint                                            null,
    created_at      timestamp(6) default CURRENT_TIMESTAMP(6)         not null,
    updated_at      timestamp(6) default CURRENT_TIMESTAMP(6)         not null on update CURRENT_TIMESTAMP(6),
    constraint tickets_ibfk_1
        foreign key (created_user_id) references users (user_id)
            on update cascade on delete set null
);

create table ticket_messages
(
    ticket_message_id bigint auto_increment
        primary key,
    ticket_id         bigint                                    not null,
    title             varchar(512)                              not null,
    content           text                                      null,
    created_user_id   bigint                                    not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint ticket_messages_tickets_ticket_id_fk
        foreign key (ticket_id) references tickets (ticket_id)
            on update cascade on delete cascade,
    constraint ticket_messages_users_user_id_fk
        foreign key (created_user_id) references users (user_id)
            on update cascade
);

create table ticket_message_images
(
    image_id          bigint auto_increment
        primary key,
    ticket_message_id bigint                                    not null,
    image_url         varchar(512)                              not null,
    sequence          int                                       not null,
    created_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at        timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint ticket_message_images_pk
        unique (image_url),
    constraint ticket_message_images_ibfk_1
        foreign key (ticket_message_id) references ticket_messages (ticket_message_id)
            on update cascade on delete cascade
);

create index ticket_message_images_ticket_messages_ticket_message_id_fk
    on ticket_message_images (ticket_message_id);

create index tickets_users_user_id_fk
    on tickets (created_user_id);

create table user_blocks
(
    block_id        bigint auto_increment
        primary key,
    blocker_user_id bigint                                    not null comment '차단을 하는 사람',
    blocked_user_id bigint                                    not null comment '차단 당한 사람',
    reason          varchar(512)                              not null,
    status          enum ('active', 'deleted')                not null,
    created_at      timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at      timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_blocks_pk
        unique (blocker_user_id, blocked_user_id),
    constraint user_blocks_users_user_id_fk
        foreign key (blocker_user_id) references users (user_id)
            on update cascade on delete cascade,
    constraint user_blocks_users_user_id_fk_2
        foreign key (blocked_user_id) references users (user_id)
            on update cascade on delete cascade
);

create table user_filters
(
    user_filter_id     bigint auto_increment
        primary key,
    user_id            bigint                                    not null,
    date_ascending     tinyint(1)   default 1                    not null,
    price_ascending    tinyint(1)   default 1                    not null,
    distance_ascending tinyint(1)   default 1                    not null,
    category           int                                       not null comment 'bitwise_operation',
    created_at         timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at         timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_filters_ibfk_1
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create index user_filters_users_user_id_fk
    on user_filters (user_id);

create table user_oauth
(
    user_id    bigint                                    not null,
    oauth_id   bigint                                    not null,
    oauth_type enum ('kakao', 'google', 'naver')         not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    primary key (user_id, oauth_type, oauth_id),
    constraint user_oauth_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create table user_restrictions
(
    user_restriction_id bigint auto_increment
        primary key,
    user_id             bigint                                         not null,
    admin_user_id       bigint                                         null,
    type                enum ('suspend', 'ban', 'canceled', 'expired') not null,
    reason              text                                           null,
    ends_at             date                                           null,
    created_at          timestamp(6) default CURRENT_TIMESTAMP(6)      not null,
    updated_at          timestamp(6) default CURRENT_TIMESTAMP(6)      not null on update CURRENT_TIMESTAMP(6),
    constraint user_restrictions_users_user_id_fk
        foreign key (admin_user_id) references users (user_id)
            on update cascade on delete set null,
    constraint user_restrictions_users_user_id_fk_2
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create index user_restrictions_admins_admin_id_fk
    on user_restrictions (admin_user_id);

create table user_roles
(
    role_id    bigint                                    not null,
    user_id    bigint                                    not null,
    created_at timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    primary key (role_id, user_id),
    constraint user_roles_roles_role_id_fk
        foreign key (role_id) references roles (role_id)
            on update cascade on delete cascade,
    constraint user_roles_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create table user_terms
(
    user_terms_id bigint auto_increment
        primary key,
    user_id       bigint                                    not null,
    term_id       bigint                                    null,
    is_agreed     tinyint(1)                                not null,
    created_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    constraint user_terms_terms_term_id_fk
        foreign key (term_id) references terms (term_id)
            on update cascade on delete set null,
    constraint user_terms_users_user_id_fk
        foreign key (user_id) references users (user_id)
            on update cascade on delete cascade
);

create table verification_code
(
    session_id       bigint auto_increment
        primary key,
    identifier_type  enum ('phone', 'email')                   not null,
    identifier_value varchar(512)                              not null,
    attempts         int                                       not null,
    is_verified      tinyint(1)   default 0                    not null,
    code             varchar(6)                                not null,
    created_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       timestamp(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
);

