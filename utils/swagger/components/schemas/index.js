import { errorSchemas } from "./error.schemas.js";
import { validatorSchemas } from "./validator.schemas.js";

export const schemas = {
  ...validatorSchemas,
  errors: errorSchemas,
};
