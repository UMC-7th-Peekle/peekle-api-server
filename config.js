import config from "./config/config.json" with { type: "json" };
import seederConfig from "./config/seeder.config.json" with { type: "json" };
import swaggerConfig from "./config/swagger.config.json" with { type: "json" };

config.SEEDER = seederConfig;
config.SWAGGER = swaggerConfig;

export default config;
