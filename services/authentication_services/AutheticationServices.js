import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../../types/Errors.js";
import brcypt from "bcrypt";
import { Constants } from "../../utilities/Constants.js";
import pool from "../../Configs/dbConfig.js";
import generateToken from "../../utilities/generateToken.js";
import redisClient from "../../Configs/redisConfig.js";
import DBUser from "../../db/dbUser.js";
import DBAuthentication from "../../db/dbAuthentication.js";

// @description: register new user
// @input: firstName, lastName, email,  phoneNumber,  password,
// @access  public
// @return: uid, email, token
export const registerUserService = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
}) => {
  // checks whether the user exists in the db or not
  const userExists = await DBUser.checkEmailInDB(email);

  // if user exists in the db
  if (userExists) {
    throw new BadRequestError(
      "Account with this email already exists. Please try to login instead!"
    );
  }

  const hashedPassword = await brcypt.hash(password, Constants.saltRounds);

  // registers new user in the database
  const responseData = await DBAuthentication.registerUser(
    firstName,
    lastName,
    email,
    hashedPassword,
    phoneNumber
  );

  if (responseData) {
    const { uid } = responseData;
    const token = generateToken(uid, email);
    return { uid, email, token };
  } else {
    throw InternalServerError(
      "Something went wrong while registering the user account from the db"
    );
  }
};

// @description: authenticates the user
// @input: firstName, lastName, email,  phoneNumber,  password,
// @access  public
// @return: uid, email, token
export const authUserService = async ({ email, password }) => {
  // checks for the user in db using its email
  const userInfo = await DBAuthentication.authUserService({ email, password });

  // if we find valid user info
  if (userInfo) {
    const uid = userInfo.uid;
    // checks for password matchs
    const passwordMatched = await brcypt.compare(password, userInfo.password);

    // if password matches
    if (passwordMatched) {
      // stores userInfo to the redis cache
      redisClient.setex("currentUser", 3600, JSON.stringify(userInfo));

      // generates token for the frontend
      const token = generateToken(uid, email);

      return {
        uid,
        email,
        token,
      };
    } else {
      throw new BadRequestError("Invalid Password. Please try again!");
    }
  } else {
    throw new NotFoundError("User not found.");
  }
};