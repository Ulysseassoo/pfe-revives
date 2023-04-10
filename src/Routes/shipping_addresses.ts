import { shippingAddressesCreate, shippingAddressesUpdate } from "./../Validator/shippingAddressesValidator";
import { User } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post(
	"/shipping/addresses",
	authMiddleware,
	shippingAddressesCreate,
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				});
			}

			const user = req.user as User;

			const { full_name, address_line_1, address_line_2, city, state, country, zip_code } = req.body;

			const shippingAddress = await db.shippingAddress.create({
				data: {
					full_name,
					address_line_1,
					address_line_2,
					city,
					state,
					country,
					zip_code,
					user_id: user.user_id,
				},
			});

			res.status(201).json({
				status: 201,
				data: shippingAddress,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when adding your address"],
			});
		}
	},
);

router.get("/shipping/addresses", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const user = req.user;

		if (user) {
			const shippingAddresses = await db.shippingAddress.findMany({
				where: {
					user_id: user.user_id,
				},
			});

			res.status(200).json({
				status: 200,
				data: shippingAddresses,
			});
		} else {
			return res.status(400).json({
				status: 400,
				errors: ["User not found"],
			});
		}
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when getting user shipping addresses"],
		});
	}
});

router.put(
	"/shipping/addresses/:id",
	authMiddleware,
	shippingAddressesUpdate,
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				});
			}

			const user = req.user as User;

			const { full_name, address_line_1, address_line_2, city, state, country, zip_code } = req.body;

			const shippingAddress = await db.shippingAddress.update({
				where: {
					shipping_address_id: parseInt(req.params.id),
					// user_id: user.user_id
				},
				data: {
					full_name,
					address_line_1,
					address_line_2,
					city,
					state,
					country,
					zip_code,
				},
			});

			if (shippingAddress) {
				return res.status(200).json({
					status: 200,
					data: shippingAddress,
				});
			} else {
				return res.status(400).json({
					status: 400,
					errors: ["Address not found"],
				});
			}
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting shipping options"],
			});
		}
	},
);

router.delete("/shipping/addresses/:id", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const shippingAddress = await db.shippingAddress.findUnique({
			where: {
				shipping_address_id: parseInt(req.params.id),
			},
		});

		if (shippingAddress) {
			await db.shippingAddress.delete({
				where: {
					shipping_address_id: shippingAddress.shipping_address_id,
				},
			});
			res.status(204).json({
				status: 204,
			});
		} else {
			return res.status(400).json({
				status: 400,
				errors: ["Address not found"],
			});
		}
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when deleting address"],
		});
	}
});

export default router;
