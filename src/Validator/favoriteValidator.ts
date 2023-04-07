import { body } from "express-validator";

export const favoriteCreate = [
	body("shoe_id").isNumeric(),
];

export const favoriteDelete = [
    body("shoe_id").isNumeric(),
]
