import express from "express";
import asyncHandler from "express-async-handler";
import {
	getEventByIdService,
	getEventsService,
	createEventService,
	jointEventService,
	updateEventService,
	seeEventParticipantsService,
	deleteEventService,
	getChatMessagesService,
	uploadEventImageFirebaseService,
	getMyEventsService,
	getAttendingEventsService,
	filterEventsService,
	sortEventService,
	getUnAttendedEventsService,
} from "../services/EventServices.js";
import {
	BadRequestError,
	NotAuthorizedError,
} from "../../utilities/types/Errors.js";
import { EventAccessRoles } from "../../utilities/types/EventAccessRoles.js";
import ReqBodyPolisher from "../../utilities/ReqBodyPolisher.js";
import { EVENTSORT, SORTORDER } from "../../utilities/types/ENUMS.js";

export const createEventController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const eventInfo = ReqBodyPolisher.polishEvent(req.body);

			//Event name missing added
			if (!eventInfo.name) {
				throw new BadRequestError("Event Name Missing");
			}

			const responseData = await createEventService(eventInfo, eventRepo);

			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Get a list of events
// @route   GET /api/events
// @access  Public
export const getEventsController = asyncHandler(
	async (_req, res, next, eventRepo) => {
		try {
			const responseData = await getEventsService(eventRepo);
			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Get a event by id
// @route   GET /api/events/:id
// @access  Public
export const getEventByIdController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const eid = parseInt(req.params.eid);
			const responseData = await getEventByIdService(eid, eventRepo);
			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

export const updateEventController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const eid = parseInt(req.params.eid);
			const eventInfo = ReqBodyPolisher.polishEvent(req.body);
			//Event id missing added
			if (!eid) {
				throw new BadRequestError("Event ID Missing");
			}

			//Event name missing added
			if (!eventInfo.name) {
				throw new BadRequestError("Event Name Missing");
			}

			const responseData = await updateEventService(
				eid,
				eventInfo,
				eventRepo
			);

			res.status(201).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public
export const deleteEventController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const eid = parseInt(req.params.eid);

			// deletes user from the db
			const responseData = await deleteEventService(eid, eventRepo);

			// response handling
			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

export const jointEventController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const { uid } = req.body;
			const accessRole = EventAccessRoles.READ;
			if (!uid) {
				throw new BadRequestError("User ID Missing");
			}
			const eid = req.params.eid;

			if (!eid) {
				throw new BadRequestError("Event ID Missing");
			}
			const responseData = await jointEventService(
				uid,
				eid,
				accessRole,
				eventRepo
			);

			res.status(201).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

export const seeEventParticipantsController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const eid = req.params.eid;

			if (!eid) {
				throw new BadRequestError("Event ID Missing");
			}
			const responseData = await seeEventParticipantsService(
				eid,
				eventRepo
			);

			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// returns all the events not attended by the user
export const getUnAttendedEventsController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const uid = req.params.uid;

			if (!uid) {
				throw new BadRequestError("User ID Missing");
			}
			const responseData = await getUnAttendedEventsService(
				uid,
				eventRepo
			);

			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// returns all the user created events
export const getMyEventsController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const uid = req.params.uid;

			if (!uid) {
				throw new BadRequestError("User ID Missing");
			}
			const responseData = await getMyEventsService(uid, eventRepo);

			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// returns all the events the user is going to attend
export const getAttendingEventsController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const uid = req.params.uid;

			if (!uid) {
				throw new BadRequestError("User ID Missing");
			}
			const responseData = await getAttendingEventsService(
				uid,
				eventRepo
			);

			res.status(200).json(responseData);
		} catch (e) {
			next(e);
		}
	}
);

// returns filtered list of events
export const filterEventsController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const { value } = req.body;
			if (!value) {
				throw new BadRequestError(
					"No value provided to filter events."
				);
			}

			const responseData = await filterEventsService(value, eventRepo);
			res.status(200).json(responseData);
			return "";
		} catch (e) {
			next(e);
		}
	}
);

// returns sorted list of events by user provided value
export const sortEventController = asyncHandler(
	async (req, res, next, eventRepo) => {
		try {
			const { sort = EVENTSORT.NAME, order = SORTORDER.ASC } = req.body;

			const responseData = await sortEventService(sort, order, eventRepo);
			res.status(200).json(responseData);
			return "";
		} catch (e) {
			next(e);
		}
	}
);

export const uploadImageController = asyncHandler(
	async (req, res, next, dirname, eventRepo) => {
		const eid = req.params.eid;
		let imageFile;
		let uploadPath;
		try {
			if (!req.files || Object.keys(req.files).length === 0) {
				return res.status(400).send("No files were uploaded.");
			}

			// name of the input is imageFile
			imageFile = req.files.imageFile;
			// uploadPath = dirname + "/upload/" + eid + ".jpg";

			// // Use mv() to place file on the server
			// imageFile.mv(uploadPath, async function (err) {
			// 	if (err) return res.status(500).send(err);

			// 	console.log("File uploaded");
			const response = await uploadEventImageFirebaseService(
				eid,
				eventRepo,
				imageFile
			);
			res.status(200).json(response);
			// });
		} catch (e) {
			next(e);
		}
	}
);

export const getChatsController = asyncHandler(
	async (req, res, next, messageRepo) => {
		try {
			const eid = req.params.eid;
			console.log(eid);
			const responseData = await getChatMessagesService(eid, messageRepo);
			res.status(200).json({ responseData });
		} catch (e) {
			next(e);
		}
	}
);
