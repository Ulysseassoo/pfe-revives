import { Comment, User } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";

import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { commentCreate, commentUpdate } from "../Validator/commentValidator";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/comments/:shoe_id",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const { shoe_id } = req.params

            const comments = await db.comment.findMany({
                where: {
                    shoes_shoe_id: parseInt(shoe_id)
                }
            })
			
			res.status(201).json({
				status: 201,
				data: comments,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting shoe's comments"],
			});
		}
	},
);

router.post(
	"/comments",
    authMiddleware,
	commentCreate,
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

            const user = req.user as User
			const { content, shoe_id } = req.body;

            const comment = await db.comment.create({
                data: {
                    content,
                    shoes_shoe_id: shoe_id,
                    users_user_id: user.user_id
                }
            })

			
			res.status(201).json({
				status: 201,
				data: comment,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when creating comment"],
			});
		}
	},
);

router.put(
	"/comments/:shoe_id",
    authMiddleware,
	commentUpdate,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const errors = validationResult(req);

            const user = req.user as User
			const { content } = req.body;
            const { shoe_id } = req.params;

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				})
			}

			const comment = await db.comment.findUnique({
				where: {
					users_user_id_shoes_shoe_id: {
                        users_user_id: user.user_id,
                        shoes_shoe_id: parseInt(shoe_id)
                    }
				}
			}) as Comment

			if (!comment) {
				return res.status(401).send({
					status: 404,
					errors: ['This comment does not exist'],
				})
			}

			const commentUpdated = await db.comment.update({
				where: {
					users_user_id_shoes_shoe_id: {
                        users_user_id: user.user_id,
                        shoes_shoe_id: parseInt(shoe_id)
                    }
				},
				data: {
                    content
				}
			})

			res.status(201).json({
				status: 201,
				data: commentUpdated,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when updating comment"],
			});
		}
	},
);

router.delete(
	"/comments/:shoe_id",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {

            const user = req.user as User
            const { shoe_id } = req.params;

            const comment = await db.comment.findUnique({
				where: {
					users_user_id_shoes_shoe_id: {
                        users_user_id: user.user_id,
                        shoes_shoe_id: parseInt(shoe_id)
                    }
				}
			}) as Comment

			if (!comment) {
				return res.status(401).send({
					status: 404,
					errors: ['This comment does not exist'],
				})
			}

			const commentDeleted = await db.comment.delete({
				where: {
					users_user_id_shoes_shoe_id: {
                        users_user_id: user.user_id,
                        shoes_shoe_id: parseInt(shoe_id)
                    }
				}
			})

			res.status(201).json({
				status: 201,
				data: commentDeleted,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when deleting comment"],
			});
		}
	},
);


export default router;
