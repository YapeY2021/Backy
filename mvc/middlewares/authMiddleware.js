import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {
	BadRequestError,
	NotAuthorizedError,
} from "../../utilities/types/Errors.js";

// provides protection against unauthorized access
export const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			// const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const verified = jwt.verify(token, process.env.JWT_SECRET);
			if (verified) {
				req.userInfo = verified;
			}

			next();
		} catch (error) {
			console.error(error);
			throw new NotAuthorizedError("Not authorized, token failed");
		}
	}

	if (!token) {
		throw new NotAuthorizedError("Not authorized, no token");
	}
});
