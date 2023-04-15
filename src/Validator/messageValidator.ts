import { body } from "express-validator";

export const messageCreate = [
	body("text").isString(),
    body("recipient_id").isNumeric(),
];

export const messageUpdate = [
    body("text").isString(),
]