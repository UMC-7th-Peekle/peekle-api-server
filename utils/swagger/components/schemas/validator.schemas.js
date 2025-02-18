import * as authSchema from "../../../validators/auth/auth.validators.js";
import * as articleSchema from "../../../validators/community/article.validators.js";
import * as usersSchema from "../../../validators/users/users.validators.js";
import * as communitySchema from "../../../validators/community/article.validators.js";
import * as ticketSchema from "../../../validators/tickets/tickets.validators.js";
import * as eventSchema from "../../../validators/events/events.validators.js";

export const validatorSchemas = {
  auth: authSchema,
  article: articleSchema,
  users: usersSchema,
  community: communitySchema,
  tickets: ticketSchema,
  events: eventSchema,
};
