import { body } from "express-validator";

export const orderCreate = [body("products").isArray(), body("shipping_options_shipping_option_id").isNumeric()];
