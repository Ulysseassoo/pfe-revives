import { body } from "express-validator";

export const shippingAddressesCreate = [
	body("full_name").isString(),
	body("address_line_1").isString(),
	body("city").isString(),
	body("state").isString(),
	body("zip_code").isString(),
	body("country").isString(),
];

export const shippingAddressesUpdate = [
	body("full_name").isString(),
	body("address_line_1").isString(),
	body("city").isString(),
	body("state").isString(),
	body("zip_code").isString(),
	body("country").isString(),
];
