import jwt from "jsonwebtoken";

export const generateToken = (userId: number) => {
	const JWT_SECRET = process.env.JWT_SECRET as string;
	const token = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: "1d",
	});
	return token;
};
