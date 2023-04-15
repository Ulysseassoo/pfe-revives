import { body } from "express-validator";

export const photoCreate = [
	body("image_url").isString(),
    body("shoe_id").isNumeric(),
];

export const photoUpdate = [
    body("image_url").isString(),
]