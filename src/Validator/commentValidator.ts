import { body } from "express-validator";

export const commentCreate = [
	body("shoe_id").isNumeric(),
    body("content").isString(),
];

export const commentUpdate = [
    body("content").isString()
]