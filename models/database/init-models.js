import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _ArticleCommentLikes from  "./ArticleCommentLikes.js";
import _ArticleComments from  "./ArticleComments.js";
import _ArticleImages from  "./ArticleImages.js";
import _ArticleLikes from  "./ArticleLikes.js";
import _Articles from  "./Articles.js";
import _ChatImages from  "./ChatImages.js";
import _Chatroom from  "./Chatroom.js";
import _Chats from  "./Chats.js";
import _Communities from  "./Communities.js";
import _CommunitySuggestions from  "./CommunitySuggestions.js";
import _EventCategory from  "./EventCategory.js";
import _EventImages from  "./EventImages.js";
import _EventLocation from  "./EventLocation.js";
import _EventLocationGroups from  "./EventLocationGroups.js";
import _EventSchedules from  "./EventSchedules.js";
import _EventScraps from  "./EventScraps.js";
import _Events from  "./Events.js";
import _Logs from  "./Logs.js";
import _NoticeCategory from  "./NoticeCategory.js";
import _NoticeImages from  "./NoticeImages.js";
import _Notices from  "./Notices.js";
import _Peekling from  "./Peekling.js";
import _PeeklingCategory from  "./PeeklingCategory.js";
import _PeeklingChatImages from  "./PeeklingChatImages.js";
import _PeeklingChatroom from  "./PeeklingChatroom.js";
import _PeeklingChats from  "./PeeklingChats.js";
import _PeeklingImages from  "./PeeklingImages.js";
import _PeeklingParticipants from  "./PeeklingParticipants.js";
import _PeeklingSave from  "./PeeklingSave.js";
import _Permissions from  "./Permissions.js";
import _RefreshTokens from  "./RefreshTokens.js";
import _Reports from  "./Reports.js";
import _RoleHierarchy from  "./RoleHierarchy.js";
import _RolePermissions from  "./RolePermissions.js";
import _Roles from  "./Roles.js";
import _Terms from  "./Terms.js";
import _TicketMessageImages from  "./TicketMessageImages.js";
import _TicketMessages from  "./TicketMessages.js";
import _Tickets from  "./Tickets.js";
import _UserBlocks from  "./UserBlocks.js";
import _UserFilters from  "./UserFilters.js";
import _UserOauth from  "./UserOauth.js";
import _UserRestrictions from  "./UserRestrictions.js";
import _UserRoles from  "./UserRoles.js";
import _UserSocketRooms from  "./UserSocketRooms.js";
import _UserTerms from  "./UserTerms.js";
import _Users from  "./Users.js";
import _VerificationCode from  "./VerificationCode.js";

export default function initModels(sequelize) {
  const ArticleCommentLikes = _ArticleCommentLikes.init(sequelize, DataTypes);
  const ArticleComments = _ArticleComments.init(sequelize, DataTypes);
  const ArticleImages = _ArticleImages.init(sequelize, DataTypes);
  const ArticleLikes = _ArticleLikes.init(sequelize, DataTypes);
  const Articles = _Articles.init(sequelize, DataTypes);
  const ChatImages = _ChatImages.init(sequelize, DataTypes);
  const Chatroom = _Chatroom.init(sequelize, DataTypes);
  const Chats = _Chats.init(sequelize, DataTypes);
  const Communities = _Communities.init(sequelize, DataTypes);
  const CommunitySuggestions = _CommunitySuggestions.init(sequelize, DataTypes);
  const EventCategory = _EventCategory.init(sequelize, DataTypes);
  const EventImages = _EventImages.init(sequelize, DataTypes);
  const EventLocation = _EventLocation.init(sequelize, DataTypes);
  const EventLocationGroups = _EventLocationGroups.init(sequelize, DataTypes);
  const EventSchedules = _EventSchedules.init(sequelize, DataTypes);
  const EventScraps = _EventScraps.init(sequelize, DataTypes);
  const Events = _Events.init(sequelize, DataTypes);
  const Logs = _Logs.init(sequelize, DataTypes);
  const NoticeCategory = _NoticeCategory.init(sequelize, DataTypes);
  const NoticeImages = _NoticeImages.init(sequelize, DataTypes);
  const Notices = _Notices.init(sequelize, DataTypes);
  const Peekling = _Peekling.init(sequelize, DataTypes);
  const PeeklingCategory = _PeeklingCategory.init(sequelize, DataTypes);
  const PeeklingChatImages = _PeeklingChatImages.init(sequelize, DataTypes);
  const PeeklingChatroom = _PeeklingChatroom.init(sequelize, DataTypes);
  const PeeklingChats = _PeeklingChats.init(sequelize, DataTypes);
  const PeeklingImages = _PeeklingImages.init(sequelize, DataTypes);
  const PeeklingParticipants = _PeeklingParticipants.init(sequelize, DataTypes);
  const PeeklingSave = _PeeklingSave.init(sequelize, DataTypes);
  const Permissions = _Permissions.init(sequelize, DataTypes);
  const RefreshTokens = _RefreshTokens.init(sequelize, DataTypes);
  const Reports = _Reports.init(sequelize, DataTypes);
  const RoleHierarchy = _RoleHierarchy.init(sequelize, DataTypes);
  const RolePermissions = _RolePermissions.init(sequelize, DataTypes);
  const Roles = _Roles.init(sequelize, DataTypes);
  const Terms = _Terms.init(sequelize, DataTypes);
  const TicketMessageImages = _TicketMessageImages.init(sequelize, DataTypes);
  const TicketMessages = _TicketMessages.init(sequelize, DataTypes);
  const Tickets = _Tickets.init(sequelize, DataTypes);
  const UserBlocks = _UserBlocks.init(sequelize, DataTypes);
  const UserFilters = _UserFilters.init(sequelize, DataTypes);
  const UserOauth = _UserOauth.init(sequelize, DataTypes);
  const UserRestrictions = _UserRestrictions.init(sequelize, DataTypes);
  const UserRoles = _UserRoles.init(sequelize, DataTypes);
  const UserSocketRooms = _UserSocketRooms.init(sequelize, DataTypes);
  const UserTerms = _UserTerms.init(sequelize, DataTypes);
  const Users = _Users.init(sequelize, DataTypes);
  const VerificationCode = _VerificationCode.init(sequelize, DataTypes);

  Peekling.belongsToMany(Users, { as: 'participantIdUsers', through: PeeklingParticipants, foreignKey: "peeklingId", otherKey: "participantId" });
  Permissions.belongsToMany(Roles, { as: 'roleIdRoles', through: RolePermissions, foreignKey: "permissionId", otherKey: "roleId" });
  Roles.belongsToMany(Permissions, { as: 'permissionIdPermissions', through: RolePermissions, foreignKey: "roleId", otherKey: "permissionId" });
  Roles.belongsToMany(Roles, { as: 'childRoleIdRoles', through: RoleHierarchy, foreignKey: "parentRoleId", otherKey: "childRoleId" });
  Roles.belongsToMany(Roles, { as: 'parentRoleIdRoles', through: RoleHierarchy, foreignKey: "childRoleId", otherKey: "parentRoleId" });
  Roles.belongsToMany(Users, { as: 'userIdUsers', through: UserRoles, foreignKey: "roleId", otherKey: "userId" });
  Users.belongsToMany(Peekling, { as: 'peeklingIdPeeklings', through: PeeklingParticipants, foreignKey: "participantId", otherKey: "peeklingId" });
  Users.belongsToMany(Roles, { as: 'roleIdRolesUserRoles', through: UserRoles, foreignKey: "userId", otherKey: "roleId" });
  ArticleCommentLikes.belongsTo(ArticleComments, { as: "comment", foreignKey: "commentId"});
  ArticleComments.hasMany(ArticleCommentLikes, { as: "articleCommentLikes", foreignKey: "commentId"});
  ArticleComments.belongsTo(ArticleComments, { as: "parentComment", foreignKey: "parentCommentId"});
  ArticleComments.hasMany(ArticleComments, { as: "articleComments", foreignKey: "parentCommentId"});
  ArticleComments.belongsTo(Articles, { as: "article", foreignKey: "articleId"});
  Articles.hasMany(ArticleComments, { as: "articleComments", foreignKey: "articleId"});
  ArticleImages.belongsTo(Articles, { as: "article", foreignKey: "articleId"});
  Articles.hasMany(ArticleImages, { as: "articleImages", foreignKey: "articleId"});
  ArticleLikes.belongsTo(Articles, { as: "article", foreignKey: "articleId"});
  Articles.hasMany(ArticleLikes, { as: "articleLikes", foreignKey: "articleId"});
  Chats.belongsTo(Chatroom, { as: "chatroomChatroom", foreignKey: "chatroomId"});
  Chatroom.hasMany(Chats, { as: "chats", foreignKey: "chatroomId"});
  ChatImages.belongsTo(Chats, { as: "chat", foreignKey: "chatId"});
  Chats.hasOne(ChatImages, { as: "chatImage", foreignKey: "chatId"});
  Chatroom.belongsTo(Chats, { as: "noticeChat", foreignKey: "noticeChatId"});
  Chats.hasMany(Chatroom, { as: "chatrooms", foreignKey: "noticeChatId"});
  Articles.belongsTo(Communities, { as: "community", foreignKey: "communityId"});
  Communities.hasMany(Articles, { as: "articles", foreignKey: "communityId"});
  Events.belongsTo(EventCategory, { as: "category", foreignKey: "categoryId"});
  EventCategory.hasMany(Events, { as: "events", foreignKey: "categoryId"});
  EventLocation.belongsTo(EventLocationGroups, { as: "locationGroup", foreignKey: "locationGroupId"});
  EventLocationGroups.hasMany(EventLocation, { as: "eventLocations", foreignKey: "locationGroupId"});
  EventImages.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventImages, { as: "eventImages", foreignKey: "eventId"});
  EventLocation.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasOne(EventLocation, { as: "eventLocation", foreignKey: "eventId"});
  EventSchedules.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventSchedules, { as: "eventSchedules", foreignKey: "eventId"});
  EventScraps.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventScraps, { as: "eventScraps", foreignKey: "eventId"});
  Notices.belongsTo(NoticeCategory, { as: "category", foreignKey: "categoryId"});
  NoticeCategory.hasMany(Notices, { as: "notices", foreignKey: "categoryId"});
  NoticeImages.belongsTo(Notices, { as: "notice", foreignKey: "noticeId"});
  Notices.hasMany(NoticeImages, { as: "noticeImages", foreignKey: "noticeId"});
  PeeklingChatroom.belongsTo(Peekling, { as: "chatroom", foreignKey: "chatroomId"});
  Peekling.hasOne(PeeklingChatroom, { as: "peeklingChatroom", foreignKey: "chatroomId"});
  PeeklingImages.belongsTo(Peekling, { as: "peekling", foreignKey: "peeklingId"});
  Peekling.hasMany(PeeklingImages, { as: "peeklingImages", foreignKey: "peeklingId"});
  PeeklingParticipants.belongsTo(Peekling, { as: "peekling", foreignKey: "peeklingId"});
  Peekling.hasMany(PeeklingParticipants, { as: "peeklingParticipants", foreignKey: "peeklingId"});
  Peekling.belongsTo(PeeklingCategory, { as: "category", foreignKey: "categoryId"});
  PeeklingCategory.hasMany(Peekling, { as: "peeklings", foreignKey: "categoryId"});
  PeeklingSave.belongsTo(PeeklingCategory, { as: "category", foreignKey: "categoryId"});
  PeeklingCategory.hasMany(PeeklingSave, { as: "peeklingSaves", foreignKey: "categoryId"});
  PeeklingChats.belongsTo(PeeklingChatroom, { as: "chatroom", foreignKey: "chatroomId"});
  PeeklingChatroom.hasMany(PeeklingChats, { as: "peeklingChats", foreignKey: "chatroomId"});
  PeeklingChatImages.belongsTo(PeeklingChats, { as: "chat", foreignKey: "chatId"});
  PeeklingChats.hasOne(PeeklingChatImages, { as: "peeklingChatImage", foreignKey: "chatId"});
  PeeklingChatroom.belongsTo(PeeklingChats, { as: "noticeChat", foreignKey: "noticeChatId"});
  PeeklingChats.hasMany(PeeklingChatroom, { as: "peeklingChatrooms", foreignKey: "noticeChatId"});
  PeeklingChats.belongsTo(PeeklingChats, { as: "parentChat", foreignKey: "parentChatId"});
  PeeklingChats.hasMany(PeeklingChats, { as: "peeklingChats", foreignKey: "parentChatId"});
  RolePermissions.belongsTo(Permissions, { as: "permission", foreignKey: "permissionId"});
  Permissions.hasMany(RolePermissions, { as: "rolePermissions", foreignKey: "permissionId"});
  RoleHierarchy.belongsTo(Roles, { as: "parentRole", foreignKey: "parentRoleId"});
  Roles.hasMany(RoleHierarchy, { as: "roleHierarchies", foreignKey: "parentRoleId"});
  RoleHierarchy.belongsTo(Roles, { as: "childRole", foreignKey: "childRoleId"});
  Roles.hasMany(RoleHierarchy, { as: "childRoleRoleHierarchies", foreignKey: "childRoleId"});
  RolePermissions.belongsTo(Roles, { as: "role", foreignKey: "roleId"});
  Roles.hasMany(RolePermissions, { as: "rolePermissions", foreignKey: "roleId"});
  UserRoles.belongsTo(Roles, { as: "role", foreignKey: "roleId"});
  Roles.hasMany(UserRoles, { as: "userRoles", foreignKey: "roleId"});
  UserTerms.belongsTo(Terms, { as: "term", foreignKey: "termId"});
  Terms.hasMany(UserTerms, { as: "userTerms", foreignKey: "termId"});
  TicketMessageImages.belongsTo(TicketMessages, { as: "ticketMessage", foreignKey: "ticketMessageId"});
  TicketMessages.hasMany(TicketMessageImages, { as: "ticketMessageImages", foreignKey: "ticketMessageId"});
  TicketMessages.belongsTo(Tickets, { as: "ticket", foreignKey: "ticketId"});
  Tickets.hasMany(TicketMessages, { as: "ticketMessages", foreignKey: "ticketId"});
  ArticleCommentLikes.belongsTo(Users, { as: "likedUser", foreignKey: "likedUserId"});
  Users.hasMany(ArticleCommentLikes, { as: "articleCommentLikes", foreignKey: "likedUserId"});
  ArticleComments.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(ArticleComments, { as: "articleComments", foreignKey: "authorId"});
  ArticleLikes.belongsTo(Users, { as: "likedUser", foreignKey: "likedUserId"});
  Users.hasMany(ArticleLikes, { as: "articleLikes", foreignKey: "likedUserId"});
  Articles.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(Articles, { as: "articles", foreignKey: "authorId"});
  Chatroom.belongsTo(Users, { as: "sender", foreignKey: "senderId"});
  Users.hasMany(Chatroom, { as: "chatrooms", foreignKey: "senderId"});
  Chatroom.belongsTo(Users, { as: "receiver", foreignKey: "receiverId"});
  Users.hasMany(Chatroom, { as: "receiverChatrooms", foreignKey: "receiverId"});
  CommunitySuggestions.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(CommunitySuggestions, { as: "communitySuggestions", foreignKey: "authorId"});
  EventScraps.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(EventScraps, { as: "eventScraps", foreignKey: "userId"});
  Events.belongsTo(Users, { as: "createdUser", foreignKey: "createdUserId"});
  Users.hasMany(Events, { as: "events", foreignKey: "createdUserId"});
  Logs.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Logs, { as: "logs", foreignKey: "userId"});
  Notices.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(Notices, { as: "notices", foreignKey: "authorId"});
  Peekling.belongsTo(Users, { as: "createdUser", foreignKey: "createdUserId"});
  Users.hasMany(Peekling, { as: "peeklings", foreignKey: "createdUserId"});
  PeeklingChats.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(PeeklingChats, { as: "peeklingChats", foreignKey: "authorId"});
  PeeklingParticipants.belongsTo(Users, { as: "participant", foreignKey: "participantId"});
  Users.hasMany(PeeklingParticipants, { as: "peeklingParticipants", foreignKey: "participantId"});
  PeeklingSave.belongsTo(Users, { as: "createdUser", foreignKey: "createdUserId"});
  Users.hasMany(PeeklingSave, { as: "peeklingSaves", foreignKey: "createdUserId"});
  RefreshTokens.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(RefreshTokens, { as: "refreshTokens", foreignKey: "userId"});
  Reports.belongsTo(Users, { as: "reportedUser", foreignKey: "reportedUserId"});
  Users.hasMany(Reports, { as: "reports", foreignKey: "reportedUserId"});
  TicketMessages.belongsTo(Users, { as: "createdUser", foreignKey: "createdUserId"});
  Users.hasMany(TicketMessages, { as: "ticketMessages", foreignKey: "createdUserId"});
  Tickets.belongsTo(Users, { as: "createdUser", foreignKey: "createdUserId"});
  Users.hasMany(Tickets, { as: "tickets", foreignKey: "createdUserId"});
  UserBlocks.belongsTo(Users, { as: "blockerUser", foreignKey: "blockerUserId"});
  Users.hasMany(UserBlocks, { as: "userBlocks", foreignKey: "blockerUserId"});
  UserBlocks.belongsTo(Users, { as: "blockedUser", foreignKey: "blockedUserId"});
  Users.hasMany(UserBlocks, { as: "blockedUserUserBlocks", foreignKey: "blockedUserId"});
  UserFilters.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserFilters, { as: "userFilters", foreignKey: "userId"});
  UserOauth.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserOauth, { as: "userOauths", foreignKey: "userId"});
  UserRestrictions.belongsTo(Users, { as: "adminUser", foreignKey: "adminUserId"});
  Users.hasMany(UserRestrictions, { as: "userRestrictions", foreignKey: "adminUserId"});
  UserRestrictions.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserRestrictions, { as: "userUserRestrictions", foreignKey: "userId"});
  UserRoles.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserRoles, { as: "userRoles", foreignKey: "userId"});
  UserSocketRooms.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserSocketRooms, { as: "userSocketRooms", foreignKey: "userId"});
  UserTerms.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserTerms, { as: "userTerms", foreignKey: "userId"});

  return {
    ArticleCommentLikes,
    ArticleComments,
    ArticleImages,
    ArticleLikes,
    Articles,
    ChatImages,
    Chatroom,
    Chats,
    Communities,
    CommunitySuggestions,
    EventCategory,
    EventImages,
    EventLocation,
    EventLocationGroups,
    EventSchedules,
    EventScraps,
    Events,
    Logs,
    NoticeCategory,
    NoticeImages,
    Notices,
    Peekling,
    PeeklingCategory,
    PeeklingChatImages,
    PeeklingChatroom,
    PeeklingChats,
    PeeklingImages,
    PeeklingParticipants,
    PeeklingSave,
    Permissions,
    RefreshTokens,
    Reports,
    RoleHierarchy,
    RolePermissions,
    Roles,
    Terms,
    TicketMessageImages,
    TicketMessages,
    Tickets,
    UserBlocks,
    UserFilters,
    UserOauth,
    UserRestrictions,
    UserRoles,
    UserSocketRooms,
    UserTerms,
    Users,
    VerificationCode,
  };
}
