import * as authSchema from "../../../validators/auth/auth.validators.js";
import * as articleSchema from "../../../validators/community/article.validators.js";
import * as usersSchema from "../../../validators/users/users.validators.js";

export const validatorSchemas = {
  auth: authSchema,
  article: articleSchema,
  users: usersSchema,
};
