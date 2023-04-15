import { Rate, User, Shoe } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";
import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { rateCreate, rateUpdate } from "../Validator/rateValidator"


const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/rates/:shoe_id",
    authMiddleware,
	async (
		req: express.Request & { params: { shoe_id: string } },
		res: express.Response,
	) => {
		try {
            const ratesOfUser = await db.rate.findMany({
                where: {
                    shoes_shoe_id: parseInt(req.params.shoe_id)
                }
            }) as Rate[]

            return res.status(200).send({
                status: 200,
                data: ratesOfUser
            })

		} catch (error: any) {

            return res.status(400).json({
				status: 400,
				errors: ["Error when getting rates"],
			});

		}
	},
);

router.post(
	"/rates",
    authMiddleware,
	rateCreate,
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
            const { shoe_id, rate }: { shoe_id: number, rate: number } = req.body

            const rateToCreate = await db.rate.create({
                data: {
                    shoes_shoe_id: shoe_id,
                    users_user_id: user.user_id,
                    rate
                }
            })

            return res.status(200).json({
                status: 200,
                data: rateToCreate
            })
		} catch (error) {
            return res.status(400).json({
				status: 400,
				errors: ["Error when creating rates"],
			});
		}
	},
);

router.delete(
	"/rates/:id",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const user = req.user as User;

            const rate = await db.rate.findUnique({
                where: {
                    users_user_id_shoes_shoe_id: {
                        shoes_shoe_id: parseInt(req.params.id),
                        users_user_id: user.user_id
                    }
                }
            }) as Rate

            if (!rate) {
                return res.status(400).json({
                    status: 400,
                    errors: ['This rate does not exist']
                })
            }

            await db.rate.delete({
                where: {
                    users_user_id_shoes_shoe_id: {
                        shoes_shoe_id: parseInt(req.params.id),
                        users_user_id: user.user_id,
                    }
                }
            })
            
            return res.status(200).json({
                status: 200,
                data: rate
            })

		} catch (error) {
            return res.status(400).json({
				status: 400,
				errors: ["Error when deleting rates"],
			});
		}
	},
);

router.put('/rates/:shoe_id', authMiddleware, rateUpdate, async (
    req: express.Request & { params: { shoe_id: string } },
    res: express.Response
) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).send({
                status: 401,
                message: errors,
            });
        }
        const user = req.user as User

        const rateToFind = await db.rate.findUnique({
            where: {
                users_user_id_shoes_shoe_id: {
                    shoes_shoe_id: parseInt(req.params.shoe_id),
                    users_user_id: user.user_id
                }
            }
        })

        if (!rateToFind) {
            return res.status(400).send({
                status: 400,
                errors: ['This rate does not exist']
            })
        }

        const { rate } = req.body

        const rateToUpdate = await db.rate.update({
            where: {
                users_user_id_shoes_shoe_id: {
                    shoes_shoe_id: parseInt(req.params.shoe_id),
                    users_user_id: user.user_id
                }
            },
            data: {
                rate
            }
        })

        return res.status(200).send({
            status: 200,
            data: rateToUpdate
        })

    } catch(error: any) {
        return res.status(400).json({
            status: 400,
            errors: ["Error when updating rates"],
        });
    }
})

export default router;
