import express from "express";
import { body } from "express-validator";
import {
	authUserController,
	deleteUser,
	forgotPasswordController,
	getUserById,
	getUsers,
	registerUserController,
	resetPasswordController,
	updateUserController,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

class UserRoute {
	constructor(userRepo, TokenRedisRepo) {
		this.userRepo = userRepo;
		this.tokenRedisRepo = TokenRedisRepo;
		this.router = express.Router();
	}

	// creates user routes
	createUserRoute() {
		this.router.route("/signup").post(
			[
				// we use the body middleware to validate the body of the request body
				body("email").isEmail().withMessage("Invalid Email"),
				body("password")
					.trim()
					.isLength({ min: 4, max: 20 })
					.withMessage(
						"Password must be between 4  to 20 character in length."
					),
			],
			(req, res, next) =>
				registerUserController(req, res, next, this.userRepo)
		);

		this.router.route("/login").post(
			[
				// we use the body middleware to validate the body of the request body
				body("email").isEmail().withMessage("Invalid Email"),
				body("password")
					.trim()
					.isLength({ min: 4, max: 20 })
					.withMessage(
						"Password must be between 4  to 20 character in length."
					),
			],
			(req, res, next) =>
				authUserController(req, res, next, this.userRepo)
		);

		// TODO: don't forget to remove this
		this.router
			.route("/")
			.get(async (req, res, next) =>
				getUsers(req, res, next, this.userRepo)
			);

		this.router
			.route("/:uid")
			.get(async (req, res, next) =>
				getUserById(req, res, next, this.userRepo)
			);

		this.router
			.route("/:uid/")
			.put(protect, async (req, res, next) =>
				updateUserController(req, res, next, this.userRepo)
			);

		this.router
			.route("/:uid")
			.delete(protect, async (req, res, next) =>
				deleteUser(req, res, next, this.userRepo)
			);

		this.router
			.route("/reset-password/:token")
			.post(protect, async (req, res, next) =>
				resetPasswordController(
					req,
					res,
					next,
					this.userRepo,
					this.tokenRedisRepo
				)
			);

		this.router
			.route("/forgot-password")
			.post(protect, async (req, res, next) =>
				forgotPasswordController(
					req,
					res,
					next,
					this.userRepo,
					this.tokenRedisRepo
				)
			);

		this.router
			.route("/:uid/image/dummy")
			.get(protect, async (req, res) => res.render("upload_image"));

		return this.router;
	}
}

export default UserRoute;
