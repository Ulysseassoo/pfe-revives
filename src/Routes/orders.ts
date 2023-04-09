import { Shoe } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import adminMiddleware from "../Middleware/admin.middleware";
import { shoeCreate, shoeUpdate } from "../Validator/shoeValidator";
import { orderCreate } from "../Validator/orderValidator";

interface ShoeWithQuantity extends Shoe {
	quantity: number;
}

const router = express.Router();

const getTotalPrice = async (products: ShoeWithQuantity[]) => {
	const productIds = products.map((product) => product.shoe_id);

	// Fetch the actual product information from the database based on the IDs
	const fetchedProducts = await db.shoe.findMany({
		where: {
			shoe_id: {
				in: productIds,
			},
		},
	});

	// Create a map of the fetched products for easier lookup later
	const productMap = new Map(fetchedProducts.map((product) => [product.shoe_id, product]));

	let totalPrice = 0;
	products.forEach((product) => {
		const fetchedProduct = productMap.get(product.shoe_id);
		if (fetchedProduct) {
			totalPrice += fetchedProduct.price * product.quantity;
		}
	});

	return totalPrice;
};

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/orders", authMiddleware, orderCreate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors,
			});
		}

		const { products, shipping_options_shipping_option_id } = req.body;

		const shipping_options = await db.shippingOption.findUnique({
			where: {
				shipping_option_id: shipping_options_shipping_option_id,
			},
		});

		if (!shipping_options) {
			return res.status(401).send({
				status: 401,
				message: "Shipping option not found",
			});
		}

		const totalPrice = await getTotalPrice(products);

		const order = await db.order.create({
			data: {
				user_id: req.user?.user_id,
				status: "Pending",
				price: totalPrice,
				shipping_options_shipping_option_id,
			},
		});

		res.status(201).json({
			status: 201,
			data: order,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when creating order"],
		});
	}
});

export default router;
