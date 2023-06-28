import { Prisma, Shoe } from "@prisma/client"
import express from "express"
import { validationResult } from "express-validator"
import { db } from "../Utils/db.server"
import authMiddleware from "../Middleware/auth.middleware"
import adminMiddleware from "../Middleware/admin.middleware"
import { shoeCreate, shoeUpdate } from "../Validator/shoeValidator"

const router = express.Router()
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

interface ProductsQueryParams {
	model?: string
	gte?: string
	gt?: string
	lte?: string
	lt?: string
	size?: number
	brand?: string
	color?: string
	take?: string
	rate?: string
}

interface PriceRangeFilter {
	gte?: number
	gt?: number
	lte?: number
	lt?: number
}

const sanitizePriceRangeFilter = (filter: ProductsQueryParams): PriceRangeFilter => {
	const sanitizedFilter: PriceRangeFilter = {}
	if (filter.gte !== undefined) {
		sanitizedFilter.gte = parseFloat(filter.gte)
	}
	if (filter.gt !== undefined) {
		sanitizedFilter.gt = parseFloat(filter.gt)
	}
	if (filter.lte !== undefined) {
		sanitizedFilter.lte = parseFloat(filter.lte)
	}
	if (filter.lt !== undefined) {
		sanitizedFilter.lt = parseFloat(filter.lt)
	}
	return sanitizedFilter
}

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/shoes", async (req: express.Request<any, any, any, ProductsQueryParams>, res: express.Response) => {
	try {
		const { model, gt, gte, lt, lte, size, brand, color, take, rate } = req.query
		const sanitizedFilter = sanitizePriceRangeFilter({ gt, gte, lt, lte })
		const products = await db.shoe.findMany({
			take: take !== undefined ? parseInt(take) : undefined,
			where: {
				model: {
					contains: model
				},
				price: sanitizedFilter,
				brand,
				color,
				size: {
					every: {
						size
					}
				},
				rate: rate !== undefined ? parseInt(rate) : undefined
			},
			include: {
				Photo: true,
				size: true
			}
		})
		res.status(200).json({
			status: 200,
			data: products
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when getting products"]
		})
	}
})

router.post("/shoes", authMiddleware, adminMiddleware, shoeCreate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors
			})
		}

		const { model, brand, color, size, status, description, price, is_validate, real_price, rate } = req.body

		const product = await db.shoe.create({
			data: {
				model,
				brand,
				color,
				size,
				status,
				description,
				price,
				is_validate,
				real_price,
				rate
			}
		})

		res.status(201).json({
			status: 201,
			data: product
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when getting products"]
		})
	}
})

router.put("/shoes/:id", authMiddleware, adminMiddleware, shoeUpdate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors
			})
		}

		const product = (await db.shoe.findUnique({
			where: {
				shoe_id: parseInt(req.params.id)
			}
		})) as Shoe

		if (!product) {
			return res.status(401).send({
				status: 404,
				errors: ["This product does not exist"]
			})
		}

		const { model, brand, color, size, status, description, price, is_validate } = req.body

		const productUpdated = await db.shoe.update({
			where: {
				shoe_id: parseInt(req.params.id)
			},
			data: {
				model,
				brand,
				color,
				size,
				status,
				description,
				price,
				is_validate
			},
			select: {
				model: true,
				brand: true,
				color: true,
				size: true,
				status: true,
				description: true,
				price: true,
				is_validate: true
			}
		})

		res.status(201).json({
			status: 201,
			data: productUpdated
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when updating products"]
		})
	}
})

router.delete("/shoes/:id", authMiddleware, adminMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const product = (await db.shoe.findUnique({
			where: {
				shoe_id: parseInt(req.params.id)
			}
		})) as Shoe

		if (!product) {
			return res.status(401).send({
				status: 404,
				errors: ["This product does not exist"]
			})
		}

		const productDeleted = await db.shoe.delete({
			where: {
				shoe_id: parseInt(req.params.id)
			}
		})

		res.status(201).json({
			status: 201,
			data: productDeleted
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when deleting products"]
		})
	}
})

export default router
