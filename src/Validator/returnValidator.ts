import { body } from "express-validator";

export const returnCreate = [body("reason").isString(), body("order_id").isNumeric()];
export const returnUpdate = [body("reason").isString(), body("status").isNumeric()];
