import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import process from "process";
import { validationResult } from "express-validator";
import { userValidator } from "../Validator/userValidator";
import { db } from "../Utils/db.server";
import { generateToken } from "../Utils/jwt";

const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post(
	"/users",
	userValidator,
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(401).send({
					status: 401,
					message: errors,
				});
			}

			const { email, password, firstname, lastname } = req.body;

			const existingUser = await db.user.findUnique({
				where: {
					email,
				},
			});
			if (existingUser) {
				return res.status(400).json({ message: "User already exists" });
			}

			const salt = bcrypt.genSaltSync(10);
			const passwordEncrypted = bcrypt.hashSync(password, salt);

			const user = await db.user.create({
				data: {
					email,
					first_name: firstname,
					last_name: lastname,
					password: passwordEncrypted,
					role: 1,
				},
			});

			return res.json({ status: 201, data: user });
		} catch (error) {
			console.log(error);
			return res.status(401).send({
				status: 401,
				message: error,
			});
		}
	},
);

router.post("/auth", async (req, res) => {
	const { email, password } = req.body;
	const user = await db.user.findUnique({ where: { email } });

	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const token = generateToken(user.user_id);

	return res.status(200).json({ token });
});

export default router;
