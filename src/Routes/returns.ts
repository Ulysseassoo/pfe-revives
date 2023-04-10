import { shippingAddressesCreate, shippingAddressesUpdate } from "./../Validator/shippingAddressesValidator";
import { User } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { returnCreate, returnUpdate } from "../Validator/returnValidator";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/returns", authMiddleware, returnCreate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors,
			});
		}

		const { reason, order_id } = req.body;

		const returnData = await db.return.create({
			data: {
				reason,
				status: "In progress",
				order_id,
			},
		});

		res.status(201).json({
			status: 201,
			data: returnData,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when creating a return for your order"],
		});
	}
});

router.put("/returns/:id", authMiddleware, returnUpdate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors,
			});
		}

		const { reason, status } = req.body;

		const returnData = await db.return.update({
			where: {
				return_id: parseInt(req.params.id),
			},
			data: {
				reason,
				status,
			},
		});

		res.status(200).json({
			status: 200,
			data: returnData,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when updating"],
		});
	}
});

export default router;
