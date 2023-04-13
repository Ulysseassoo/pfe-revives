import { body } from "express-validator";

export const rateCreate = [
	body("shoe_id").isNumeric(),
    body("rate").isNumeric(),
];

export const rateUpdate = [
    body("rate").isNumeric(),
]