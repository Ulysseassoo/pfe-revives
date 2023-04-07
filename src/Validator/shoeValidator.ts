import { body } from "express-validator";

export const shoeCreate = [
	body("model").isString(),
	body("brand").isString(),
	body("color").isString(),
	body("status").isString(),
	body("description").isString(),
	body("is_validate").isBoolean(),
	body("size").isNumeric(),
	body("price").isNumeric(),
];

export const shoeUpdate = [
	body("model").isString(),
	body("brand").isString(),
	body("color").isString(),
	body("status").isString(),
	body("description").isString(),
	body("is_validate").isBoolean(),
	body("size").isNumeric(),
	body("price").isNumeric(),
]