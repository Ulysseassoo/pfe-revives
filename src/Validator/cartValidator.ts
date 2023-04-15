import { body } from "express-validator";

export const cartUpdate = [body("products").isString()];
