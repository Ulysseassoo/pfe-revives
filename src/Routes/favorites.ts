import { Favorite, User, Shoe } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { favoriteCreate, favoriteDelete } from "../Validator/favoriteValidator";


const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/favorites",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const user = req.user as User;

            const favoritesOfUser = await db.favorite.findMany({
                where: {
                    users_user_id: user.user_id
                }
            }) as Favorite[]

            return res.status(200).send({
                status: 200,
                data: favoritesOfUser
            })
		} catch (error) {
            return res.status(400).json({
				status: 400,
				errors: ["Error when getting favorites"],
			});
		}
	},
);

router.post(
	"/favorites",
    authMiddleware,
	favoriteCreate,
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

            const user = req.user as User;
            const { shoe_id }: { shoe_id: number } = req.body

            const shoe = await db.shoe.findUnique({
                where: {
                    shoe_id
                }
            }) as Shoe

            if (!shoe) {
                return res.status(400).json({
                    status: 400,
                    errors: ['This product does not exist']
                })
            }

            const favoriteToCreate = await db.favorite.create({
                data: {
                    shoes_shoe_id: shoe_id,
                    users_user_id: user.user_id
                }
            })

            return res.status(200).json({
                status: 200,
                data: favoriteToCreate
            })
		} catch (error) {
            return res.status(400).json({
				status: 400,
				errors: ["Error when creating favorites"],
			});
		}
	},
);

router.delete(
	"/favorites",
    authMiddleware,
	favoriteDelete,
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

            const user = req.user as User;
            const { shoe_id }: { shoe_id: number } = req.body

            const shoe = await db.shoe.findUnique({
                where: {
                    shoe_id
                }
            }) as Shoe

            if (!shoe) {
                return res.status(400).json({
                    status: 400,
                    errors: ['This product does not exist']
                })
            }

            await db.favorite.delete({
                where: {
                    users_user_id_shoes_shoe_id: {
                        users_user_id: user.user_id,
                        shoes_shoe_id: shoe_id,
                    }
                }
            })
            
            return res.status(200).json({
                status: 200,
                data: shoe
            })

		} catch (error) {
            return res.status(400).json({
				status: 400,
				errors: ["Error when deleting favorites"],
			});
		}
	},
);

export default router;
