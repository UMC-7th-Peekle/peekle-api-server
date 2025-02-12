import config from "./config.json" with { type: "json" };
import seederConfig from "./seeder.config.json" with { type: "json" };

config.SEEDER = seederConfig;
export default config;
