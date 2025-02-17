import * as communitySeeder from "./community.seeder.js";
import * as userSeeder from "./community.seeder.js";
import * as peeklingSeeder from "./peekling.seeder.js";
import * as defaultSeeder from "./seeder.js";

export default {
  ...defaultSeeder,
  ...communitySeeder,
  ...userSeeder,
  ...peeklingSeeder,
};
