import { Prisma, Shoe, User } from "@prisma/client"
import express from "express"
import { validationResult } from "express-validator"
import { db } from "../Utils/db.server"
import authMiddleware from "../Middleware/auth.middleware"
import adminMiddleware from "../Middleware/admin.middleware"
import { shoeCreate, shoeUpdate } from "../Validator/shoeValidator"
import { orderCreate } from "../Validator/orderValidator"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
	apiVersion: "2022-11-15"
})
interface ShoeWithQuantity extends Shoe {
	quantity: number
	size: number
}

const router = express.Router()

const getTotalPrice = async (products: ShoeWithQuantity[]) => {
	const productIds = products.map((product) => product.shoe_id)

	// Fetch the actual product information from the database based on the IDs
	const fetchedProducts = await db.shoe.findMany({
		where: {
			shoe_id: {
				in: productIds
			}
		}
	})

	// Create a map of the fetched products for easier lookup later
	const productMap = new Map(fetchedProducts.map((product) => [product.shoe_id, product]))

	let totalPrice = 0
	products.forEach((product) => {
		const fetchedProduct = productMap.get(product.shoe_id)
		if (fetchedProduct) {
			totalPrice += fetchedProduct.price * product.quantity
		}
	})

	return totalPrice
}

const getOrderHasShoes = async (products: ShoeWithQuantity[]) =>
	products.map((product) => ({ quantity: product.quantity, shoes_shoe_id: product.shoe_id }))

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/orders", authMiddleware, orderCreate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors
			})
		}

		const { products, shipping_options_shipping_option_id } = req.body
		const user = req.user as User

		const shipping_options = await db.shippingOption.findUnique({
			where: {
				shipping_option_id: shipping_options_shipping_option_id
			}
		})

		if (shipping_options !== null) {
			const totalPrice = await getTotalPrice(products)
			const orderHasShoes = await getOrderHasShoes(products)
			const lineItems = await Promise.all(
				products.map(async (product: ShoeWithQuantity) => {
					const product_item = await db.shoe.findUnique({
						where: {
							shoe_id: product.shoe_id
						},
						include: {
							Photo: true
						}
					})

					const images = product_item?.Photo.map((ph) => ph.image_url)

					if (product_item) {
						return {
							price_data: {
								currency: "eur",
								product_data: {
									name: product_item.model,
									images: images,
									metadata: {
										size: product.size
									}
								},
								unit_amount: Math.round(product_item.price * 100)
							},
							quantity: product.quantity
						}
					}
					return {}
				})
			)

			const session = await stripe.checkout.sessions.create({
				shipping_address_collection: { allowed_countries: ["FR"] },
				payment_method_types: ["card"],
				mode: "payment",
				success_url: `${process.env.CLIENT_URL}/success`,
				cancel_url: `${process.env.CLIENT_URL}/failed`,
				line_items: lineItems,
				customer: user.stripe_id ?? undefined,
				client_reference_id: user.stripe_id ?? undefined
			})

			const order = await db.order.create({
				data: {
					user_id: req.user?.user_id,
					status: "Pending",
					price: totalPrice + shipping_options.price!,
					shipping_options_shipping_option_id,
					Orders_has_shoes: {
						create: orderHasShoes
					}
				},
				include: {
					Orders_has_shoes: true
				}
			})

			res.status(201).json({
				status: 201,
				data: {
					order,
					sessionId: session.id
				}
			})
		} else {
			return res.status(401).send({
				status: 401,
				message: "Shipping option not found"
			})
		}
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when creating order"]
		})
	}
})

router.get("/orders", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const user = req.user as User

		const userOrders = await db.order.findMany({
			where: {
				user_id: user.user_id
			},
			include: {
				Orders_has_shoes: true
			}
		})

		return res.json({ status: 200, data: userOrders })
	} catch (error) {
		return res.status(401).send({
			status: 401,
			message: error
		})
	}
})

export default router
