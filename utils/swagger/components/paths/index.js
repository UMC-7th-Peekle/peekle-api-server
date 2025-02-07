import admin from "./admin.path.js";
import auth from "./auth.path.js";
import community from "./community.path.js";
import events from "./events.path.js";
import notices from "./notices.path.js";
import tests from "./tests.path.js";
import tickets from "./tickets.path.js";
import users from "./users.path.js";
import erros from "./errors.path.js";

export const paths = {
  ...admin,
  ...auth,
  ...community,
  ...events,
  ...notices,
  ...tests,
  ...tickets,
  ...users,
  ...erros,
};
