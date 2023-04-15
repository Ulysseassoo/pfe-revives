import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../Utils/db.server";
import { User } from "@prisma/client";

interface UserPayload {
	userId: number;
	exp: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: User | null;
		}
	}
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).send({ status: 401, error: "Authentication required" });
	}

	try {
		const JWT_SECRET = process.env.JWT_SECRET as string;
		const payload = jwt.verify(token, JWT_SECRET) as UserPayload;

		// check if token has expired
		if (Date.now() >= payload.exp * 1000) {
			return res.status(401).send({ status: 401, error: "Token has expired" });
		}

		const user = await db.user.findUnique({
			where: { user_id: payload.userId },
		});
		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			// token has expired, send an error response
			return res.status(401).send({
				status: 401,
				message: "Token has expired",
			});
		} else {
			res.status(401).send({ status: 401, error: "Invalid token" });
		}
	}
};

export default authMiddleware;
