import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Admins from  "./Admins.js";
import _ArticleCommentLikes from  "./ArticleCommentLikes.js";
import _ArticleComments from  "./ArticleComments.js";
import _ArticleImages from  "./ArticleImages.js";
import _ArticleLikes from  "./ArticleLikes.js";
import _Articles from  "./Articles.js";
import _Communities from  "./Communities.js";
import _EventCategory from  "./EventCategory.js";
import _EventImages from  "./EventImages.js";
import _EventSchedules from  "./EventSchedules.js";
import _EventScraps from  "./EventScraps.js";
import _Events from  "./Events.js";
import _NoticeCategory from  "./NoticeCategory.js";
import _NoticeImages from  "./NoticeImages.js";
import _Notices from  "./Notices.js";
import _Reports from  "./Reports.js";
import _Terms from  "./Terms.js";
import _TicketMessageImages from  "./TicketMessageImages.js";
import _TicketMessages from  "./TicketMessages.js";
import _Tickets from  "./Tickets.js";
import _UserBlocks from  "./UserBlocks.js";
import _UserFilters from  "./UserFilters.js";
import _UserLocal from  "./UserLocal.js";
import _UserOauth from  "./UserOauth.js";
import _UserRestrictions from  "./UserRestrictions.js";
import _UserTerms from  "./UserTerms.js";
import _Users from  "./Users.js";
import _VerificationCode from  "./VerificationCode.js";

export default function initModels(sequelize) {
  const Admins = _Admins.init(sequelize, DataTypes);
  const ArticleCommentLikes = _ArticleCommentLikes.init(sequelize, DataTypes);
  const ArticleComments = _ArticleComments.init(sequelize, DataTypes);
  const ArticleImages = _ArticleImages.init(sequelize, DataTypes);
  const ArticleLikes = _ArticleLikes.init(sequelize, DataTypes);
  const Articles = _Articles.init(sequelize, DataTypes);
  const Communities = _Communities.init(sequelize, DataTypes);
  const EventCategory = _EventCategory.init(sequelize, DataTypes);
  const EventImages = _EventImages.init(sequelize, DataTypes);
  const EventSchedules = _EventSchedules.init(sequelize, DataTypes);
  const EventScraps = _EventScraps.init(sequelize, DataTypes);
  const Events = _Events.init(sequelize, DataTypes);
  const NoticeCategory = _NoticeCategory.init(sequelize, DataTypes);
  const NoticeImages = _NoticeImages.init(sequelize, DataTypes);
  const Notices = _Notices.init(sequelize, DataTypes);
  const Reports = _Reports.init(sequelize, DataTypes);
  const Terms = _Terms.init(sequelize, DataTypes);
  const TicketMessageImages = _TicketMessageImages.init(sequelize, DataTypes);
  const TicketMessages = _TicketMessages.init(sequelize, DataTypes);
  const Tickets = _Tickets.init(sequelize, DataTypes);
  const UserBlocks = _UserBlocks.init(sequelize, DataTypes);
  const UserFilters = _UserFilters.init(sequelize, DataTypes);
  const UserLocal = _UserLocal.init(sequelize, DataTypes);
  const UserOauth = _UserOauth.init(sequelize, DataTypes);
  const UserRestrictions = _UserRestrictions.init(sequelize, DataTypes);
  const UserTerms = _UserTerms.init(sequelize, DataTypes);
  const Users = _Users.init(sequelize, DataTypes);
  const VerificationCode = _VerificationCode.init(sequelize, DataTypes);

  Notices.belongsTo(Admins, { as: "admin", foreignKey: "adminId"});
  Admins.hasMany(Notices, { as: "notices", foreignKey: "adminId"});
  UserRestrictions.belongsTo(Admins, { as: "admin", foreignKey: "adminId"});
  Admins.hasMany(UserRestrictions, { as: "userRestrictions", foreignKey: "adminId"});
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
  Articles.belongsTo(Communities, { as: "community", foreignKey: "communityId"});
  Communities.hasMany(Articles, { as: "articles", foreignKey: "communityId"});
  Events.belongsTo(EventCategory, { as: "category", foreignKey: "categoryId"});
  EventCategory.hasMany(Events, { as: "events", foreignKey: "categoryId"});
  EventImages.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventImages, { as: "eventImages", foreignKey: "eventId"});
  EventSchedules.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventSchedules, { as: "eventSchedules", foreignKey: "eventId"});
  EventScraps.belongsTo(Events, { as: "event", foreignKey: "eventId"});
  Events.hasMany(EventScraps, { as: "eventScraps", foreignKey: "eventId"});
  Notices.belongsTo(NoticeCategory, { as: "category", foreignKey: "categoryId"});
  NoticeCategory.hasMany(Notices, { as: "notices", foreignKey: "categoryId"});
  NoticeImages.belongsTo(Notices, { as: "notice", foreignKey: "noticeId"});
  Notices.hasMany(NoticeImages, { as: "noticeImages", foreignKey: "noticeId"});
  UserTerms.belongsTo(Terms, { as: "term", foreignKey: "termId"});
  Terms.hasMany(UserTerms, { as: "userTerms", foreignKey: "termId"});
  TicketMessageImages.belongsTo(TicketMessages, { as: "ticketMessage", foreignKey: "ticketMessageId"});
  TicketMessages.hasMany(TicketMessageImages, { as: "ticketMessageImages", foreignKey: "ticketMessageId"});
  TicketMessages.belongsTo(Tickets, { as: "ticket", foreignKey: "ticketId"});
  Tickets.hasMany(TicketMessages, { as: "ticketMessages", foreignKey: "ticketId"});
  Admins.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Admins, { as: "admins", foreignKey: "userId"});
  ArticleCommentLikes.belongsTo(Users, { as: "likedUser", foreignKey: "likedUserId"});
  Users.hasMany(ArticleCommentLikes, { as: "articleCommentLikes", foreignKey: "likedUserId"});
  ArticleComments.belongsTo(Users, { as: "author", foreignKey: "authorId"});
  Users.hasMany(ArticleComments, { as: "articleComments", foreignKey: "authorId"});
  ArticleLikes.belongsTo(Users, { as: "likedUser", foreignKey: "likedUserId"});
  Users.hasMany(ArticleLikes, { as: "articleLikes", foreignKey: "likedUserId"});
  EventScraps.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(EventScraps, { as: "eventScraps", foreignKey: "userId"});
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
  UserLocal.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasOne(UserLocal, { as: "userLocal", foreignKey: "userId"});
  UserOauth.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserOauth, { as: "userOauths", foreignKey: "userId"});
  UserRestrictions.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserRestrictions, { as: "userRestrictions", foreignKey: "userId"});
  UserTerms.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(UserTerms, { as: "userTerms", foreignKey: "userId"});

  return {
    Admins,
    ArticleCommentLikes,
    ArticleComments,
    ArticleImages,
    ArticleLikes,
    Articles,
    Communities,
    EventCategory,
    EventImages,
    EventSchedules,
    EventScraps,
    Events,
    NoticeCategory,
    NoticeImages,
    Notices,
    Reports,
    Terms,
    TicketMessageImages,
    TicketMessages,
    Tickets,
    UserBlocks,
    UserFilters,
    UserLocal,
    UserOauth,
    UserRestrictions,
    UserTerms,
    Users,
    VerificationCode,
  };
}
