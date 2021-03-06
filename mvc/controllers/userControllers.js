import asyncHandler from "express-async-handler";
import parseJson from "parse-json";

import {
	deleteUserService,
	getUsersService,
	updateUserService,
	getUserByIdService,
	uploadUserImageFirebaseService,
} from "../services/UserServices.js";
import {
	BadRequestError,
	NotAuthorizedError,
} from "../../utilities/types/Errors.js";
import {
	authUserService,
	forgotPasswordService,
	registerUserService,
	resetPasswordService,
} from "../services/AutheticationServices.js";
import ReqBodyPolisher from "../../utilities/ReqBodyPolisher.js";
import { tables } from "../../utilities/types/Tables.js";

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const registerUserController = asyncHandler(
	async (req, res, next, userRepo) => {
		try {
			const userInfo = ReqBodyPolisher.polishUser(req.body);
			if (!userInfo.email) {
				throw new BadRequestError("Email Missing");
			}

			const responseData = await registerUserService(userInfo, userRepo);

			res.status(201).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUserController = asyncHandler(
	async (req, res, next, userRepo) => {
		try {
			const { email, password } = ReqBodyPolisher.polishUser(req.body);
			if (!email) {
				throw new BadRequestError("Email Missing");
			}

			const responseData = await authUserService(
				email,
				password,
				userRepo
			);
			res.status(201).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Get a list of users
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next, userRepo) => {
	console.log("reached getUsers controller");
	try {
		const responseData = await getUsersService(userRepo);
		res.status(200).json(responseData);
	} catch (e) {
		next(e);
	}
});

// @desc    Get an user by id
// @route   GET /api/users/:uid
// @access  Public
export const getUserById = asyncHandler(async (req, res, next, userRepo) => {
	const uid = parseInt(req.params.uid);
	try {
		const responseData = await getUserByIdService(uid, userRepo);
		res.status(200).json(responseData);
	} catch (e) {
		next(e);
	}
});

// @desc    Delete user account
// @route   DELETE /api/users/:uid
// @access  Public
export const deleteUser = asyncHandler(async (req, res, next, userRepo) => {
	const uid = parseInt(req.params.uid);
	try {
		// deletes user from the db
		const responseData = await deleteUserService(uid, userRepo);

		// response handling
		res.status(200).json(responseData);
	} catch (e) {
		next(e);
	}
});

// @desc    handles forgot password operation
// @route   POST /api/users/:uid/forgot-password
// @access  Public
export const forgotPasswordController = asyncHandler(
	async (req, res, next, userRepo, tokenRedisRepo) => {
		const { email } = req.body;
		try {
			if (!email) {
				throw new BadRequestError("Email Missing.");
			}
			const response = await forgotPasswordService(
				email,
				userRepo,
				tokenRedisRepo
			);
			res.status(200).json(response);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    reset password for the current user
// @route   POST /api/users/reset-password/:"token
// @access  Public
export const resetPasswordController = asyncHandler(
	async (req, res, next, userRepo, tokenRedisRepo) => {
		const token = req.params.token;

		try {
			const { password } = req.body;
			// reset password for the current user
			const responseData = await resetPasswordService(
				token,
				password,
				userRepo,
				tokenRedisRepo
			);

			// response handling
			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Update user account
// @route   PUT /api/users/:uid
// @access  Private
export const updateUserController = asyncHandler(
	async (req, res, next, userRepo) => {
		const uid = req.params.uid;
		let imageFile;
		let userInfo;

		try {
			if (req.body && req.body.user) {
				const polishedBody = ReqBodyPolisher.polishUser(req.body.user);
				if (polishedBody) {
					userInfo = parseJson(polishedBody);
				}
			}
			// if (!req.files || Object.keys(req.files).length === 0) {
			// 	return res.status(400).send("No files were uploaded.");
			// }

			if (req.files && req.files.file) {
				imageFile = req.files.file;
				console.log(imageFile);
				userInfo = await uploadUserImageFirebaseService(
					`${tables.USERS}/${uid}.jpeg`,
					userRepo,
					imageFile
				);
			}

			if (!userInfo) {
				throw new BadRequestError("No information to update");
			}

			const response = await updateUserService(userInfo, uid, userRepo);

			res.status(200).json(response);
		} catch (e) {
			next(e);
		}
	}
);
