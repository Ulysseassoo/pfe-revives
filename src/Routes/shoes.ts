import { PrismaClient, Shoe } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import process from "process";
import { validationResult } from "express-validator";
import { userUpdate, userValidator } from "../Validator/userValidator";
import { db } from "../Utils/db.server";
import { generateToken } from "../Utils/jwt";
import authMiddleware from "../Middleware/auth.middleware";
import adminMiddleware from "../Middleware/admin.middleware";
import { shoeCreate } from "../Validator/shoeValidator";


const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

interface ProductsQueryParams {
	model?: string;
	gte?: string;
	gt?: string;
	lte?: string;
	lt?: string;
    size?: number;
    brand?: string;
	color?: string;
}

interface PriceRangeFilter {
	gte?: number;
	gt?: number;
	lte?: number;
	lt?: number;
}

const sanitizePriceRangeFilter = (
	filter: ProductsQueryParams,
): PriceRangeFilter => {
	const sanitizedFilter: PriceRangeFilter = {};
	if (filter.gte !== undefined) {
		sanitizedFilter.gte = parseFloat(filter.gte);
	}
	if (filter.gt !== undefined) {
		sanitizedFilter.gt = parseFloat(filter.gt);
	}
	if (filter.lte !== undefined) {
		sanitizedFilter.lte = parseFloat(filter.lte);
	}
	if (filter.lt !== undefined) {
		sanitizedFilter.lt = parseFloat(filter.lt);
	}
	return sanitizedFilter;
};

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/shoes",
	async (
		req: express.Request<any, any, any, ProductsQueryParams>,
		res: express.Response,
	) => {
		try {
			const { model, gt, gte, lt, lte, size, brand, color } = req.query;

			const sanitizedFilter = sanitizePriceRangeFilter({ gt, gte, lt, lte });
			const products = await db.shoe.findMany({
				where: {
					model: {
						contains: model,
					},
					price: sanitizedFilter,
                    size,
                    brand,
					color
				},
			});
			res.status(200).json({
				status: 200,
				data: products,
			});
		} catch (error) {
			console.log("🚀 ~ file: shoes.ts:83 ~ error:", error)
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting products"],
			});
		}
	},
);

router.post(
	"/shoes",
    authMiddleware,
    adminMiddleware,
	shoeCreate,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				});
			}

			const { model, brand, color, size, status, description, price, is_validate } = req.body;

            const product = await db.shoe.create({
                data: {
                    model,
					brand,
					color,
					size,
					status,
					description,
					price,
					is_validate
                }
            })

			
			res.status(201).json({
				status: 201,
				data: product,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting products"],
			});
		}
	},
);



export default router;
