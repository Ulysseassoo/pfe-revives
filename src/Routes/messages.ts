import { Message, User } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";

import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { messageCreate, messageUpdate } from "../Validator/messageValidator";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/messages/:recipient_id",
    authMiddleware,
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
            const { recipient_id } = req.params

            const messages = await db.message.findMany({
                where: {
                    sender_id: user.user_id,
                    recipient_id: parseInt(recipient_id)
                }
            })

			res.status(201).json({
				status: 201,
				data: messages,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting messages"],
			});
		}
	},
);


router.post(
	"/messages",
    authMiddleware,
	messageCreate,
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
            const { text, recipient_id } = req.body

            const recipient = await db.user.findUnique({
                where: {
                    user_id: recipient_id
                }
            })

            if (!recipient) {
                return res.status(400).send({
                    status: 400,
                    errors: ['This recipient does not exist']
                })
            }

            const message = await db.message.create({
                data: {
                    text,
                    recipient_id,
                    sender_id: user.user_id
                }
            })

			res.status(201).json({
				status: 201,
				data: message,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when creating message"],
			});
		}
	},
);

router.put(
	"/messages/:id",
    authMiddleware,
	messageUpdate,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
            const errors = validationResult(req);

            const user = req.user as User
			const { text } = req.body
            const { id } = req.params

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				})
			}

			const message = await db.message.findUnique({
				where: {
                    id: parseInt(id)
				}
			}) as Message

			if (!message) {
				return res.status(401).send({
					status: 404,
					errors: ['This message does not exist'],
				})
			}

			const messageUpdated = await db.message.update({
				where: {
					id: parseInt(id)
				},
				data: {
                    text
				}
			})

			res.status(201).json({
				status: 201,
				data: messageUpdated,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when updating message"],
			});
		}
	},
);

router.delete(
	"/messages/:id",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {

            const user = req.user as User
            const { id } = req.params;

            const message = await db.message.findUnique({
				where: {
                    id: parseInt(id)
                }
			}) as Message

			if (!message) {
				return res.status(401).send({
					status: 404,
					errors: ['This message does not exist'],
				})
			}

			const messageDeleted = await db.message.delete({
                where: {
                    id: parseInt(id)
                }
			})

			res.status(201).json({
				status: 201,
				data: messageDeleted,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when deleting message"],
			});
		}
	},
);


export default router;