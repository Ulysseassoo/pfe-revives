import { body } from "express-validator";

export const shippinOptionsCreate = [
	body("name").isString(),
	body("description").isString(),
	body("price").isNumeric(),
	body("estimated_delivery_time").isString(),
];
