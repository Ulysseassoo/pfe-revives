import { Shoe } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import adminMiddleware from "../Middleware/admin.middleware";
import { shippinOptionsCreate } from "../Validator/shippingOptionsValidator";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post(
	"/shipping/options",
	authMiddleware,
	adminMiddleware,
	shippinOptionsCreate,
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				});
			}

			const { name, description, price, estimated_delivery_time } = req.body;

			const shippingOption = await db.shippingOption.create({
				data: {
					name,
					description,
					price,
					estimated_delivery_time,
				},
			});

			res.status(201).json({
				status: 201,
				data: shippingOption,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when creating shipping option"],
			});
		}
	},
);

router.get("/shipping/options", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const shippingOptions = await db.shippingOption.findMany();

		res.status(200).json({
			status: 200,
			data: shippingOptions,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when getting shipping options"],
		});
	}
});

export default router;
