import config from "./config.json" with { type: "json" };
import seederConfig from "./seeder.config.json" with { type: "json" };
import swaggerConfig from "./swagger.config.json" with { type: "json" };

config.SEEDER = seederConfig;
config.SWAGGER = swaggerConfig;

export default config;
