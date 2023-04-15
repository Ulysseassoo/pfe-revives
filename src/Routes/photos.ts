import { Photo, User } from "@prisma/client";
import express from "express";
import { validationResult } from "express-validator";

import { db } from "../Utils/db.server";
import authMiddleware from "../Middleware/auth.middleware";
import { photoCreate, photoUpdate } from "../Validator/photoValidator";

const router = express.Router();

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get(
	"/photos/:shoe_id",
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

            const { shoe_id } = req.params

            const photos = await db.photo.findMany({
                where: {
                    shoes_shoe_id: parseInt(shoe_id)
                }
            })

			res.status(201).json({
				status: 201,
				data: photos,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when getting photos"],
			});
		}
	},
);


router.post(
	"/photos",
    authMiddleware,
	photoCreate,
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

            const { shoe_id, image_url } = req.body

            const shoe = await db.shoe.findUnique({
                where: {
                    shoe_id
                }
            })

            if (!shoe) {
                return res.status(400).send({
                    status: 400,
                    errors: ["This shoe does not exist"]
                })
            }

            const photo = await db.photo.create({
                data: {
                    image_url,
                    shoes_shoe_id: shoe_id
                }
            })

			res.status(201).json({
				status: 201,
				data: photo,
			});
		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when creating photo"],
			});
		}
	},
);

router.put(
	"/photos/:id",
    authMiddleware,
	photoUpdate,
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
				})
			}
            
            const { id } = req.params
            const { image_url } = req.body

			const photo = await db.photo.findUnique({
				where: {
                    id: parseInt(id)
				}
			}) as Photo

			if (!photo) {
				return res.status(401).send({
					status: 404,
					errors: ['This photo does not exist'],
				})
			}

			const photoUpdated = await db.photo.update({
				where: {
					id: parseInt(id)
				},
				data: {
                    image_url
				}
			})

			res.status(201).json({
				status: 201,
				data: photoUpdated,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when updating photo"],
			});
		}
	},
);

router.delete(
	"/photos/:id",
    authMiddleware,
	async (
		req: express.Request,
		res: express.Response,
	) => {
		try {

            const { id } = req.params;

            const photo = await db.photo.findUnique({
				where: {
                    id: parseInt(id)
                }
			}) as Photo

			if (!photo) {
				return res.status(401).send({
					status: 404,
					errors: ['This photo does not exist'],
				})
			}

			const photoDeleted = await db.photo.delete({
                where: {
                    id: parseInt(id)
                }
			})

			res.status(201).json({
				status: 201,
				data: photoDeleted,
			})

		} catch (error) {
			return res.status(400).json({
				status: 400,
				errors: ["Error when deleting photo"],
			});
		}
	},
);


export default router;