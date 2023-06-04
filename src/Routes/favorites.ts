import { Favorite, User, Shoe } from "@prisma/client"
import express from "express"
import { validationResult } from "express-validator"
import { db } from "../Utils/db.server"
import authMiddleware from "../Middleware/auth.middleware"
import { favoriteCreate, favoriteDelete } from "../Validator/favoriteValidator"

const router = express.Router()
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/favorites", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const user = req.user as User

		const favoritesOfUser = (await db.favorite.findMany({
			where: {
				users_user_id: user.user_id
			},
			include: {
				shoe: {
					include: {
						Photo: true
					}
				}
			}
		})) as Favorite[]

		return res.status(200).send({
			status: 200,
			data: favoritesOfUser
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when getting favorites"]
		})
	}
})

router.post("/favorites", authMiddleware, favoriteCreate, async (req: express.Request, res: express.Response) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(401).send({
				status: 401,
				message: errors
			})
		}

		const user = req.user as User
		const { shoe_id }: { shoe_id: number } = req.body

		const shoe = (await db.shoe.findUnique({
			where: {
				shoe_id
			}
		})) as Shoe

		if (!shoe) {
			return res.status(400).json({
				status: 400,
				errors: ["Ce produit n'existe pas"]
			})
		}

		const existingFavorite = await db.favorite.findFirst({
			where: {
				shoes_shoe_id: shoe_id,
				users_user_id: user.user_id
			}
		})

		if (existingFavorite) {
			return res.status(400).json({
				status: 400,
				errors: ["Ce produit existe déjà dans vos favoris."]
			})
		}

		const favoriteToCreate = await db.favorite.create({
			data: {
				shoes_shoe_id: shoe_id,
				users_user_id: user.user_id
			},
			include: {
				shoe: {
					include: {
						Photo: true
					}
				}
			}
		})

		return res.status(201).json({
			status: 201,
			data: favoriteToCreate
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Une erreur est survenue lors de la création."]
		})
	}
})

router.delete("/favorites/:id", authMiddleware, async (req: express.Request, res: express.Response) => {
	try {
		const user = req.user as User

		const shoe = (await db.shoe.findUnique({
			where: {
				shoe_id: parseInt(req.params.id)
			}
		})) as Shoe

		if (!shoe) {
			return res.status(400).json({
				status: 400,
				errors: ["This product does not exist"]
			})
		}

		await db.favorite.delete({
			where: {
				users_user_id_shoes_shoe_id: {
					users_user_id: user.user_id,
					shoes_shoe_id: shoe.shoe_id
				}
			}
		})

		return res.status(204).json({
			status: 204
		})
	} catch (error) {
		return res.status(400).json({
			status: 400,
			errors: ["Error when deleting favorites"]
		})
	}
})

export default router
