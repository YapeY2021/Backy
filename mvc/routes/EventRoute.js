import express from "express";
import {
	createEventController,
	deleteEventController,
	filterEventsController,
	getAttendingEventsController,
	getChatsController,
	getEventByIdController,
	getEventsController,
	getMyEventsController,
	getUnAttendedEventsController,
	seeEventParticipantsController,
	sortAttendedEventController,
	sortEventController,
	sortMyEventsController,
	sortUnattendedEventController,
	updateEventController,
} from "../controllers/eventControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

class EventRoute {
	constructor(eventRepo) {
		this.eventRepo = eventRepo;
		// creates express router
		this.router = express.Router();
	}

	createEventRoutes() {
		//-----------------------------------Events related routes----------------------------------------------
		this.router
			.route("/")
			.post(async (req, res, next) =>
				createEventController(req, res, next, this.eventRepo)
			);

		this.router
			.route("/new/:uid")
			.get(async (req, res, next) =>
				getUnAttendedEventsController(req, res, next, this.eventRepo)
			);

		// unattended sort
		this.router
			.route("/new/sort")
			.post(
				protect,
				async (req, res, next) => sortUnattendedEventController
			);

		this.router
			.route("/")
			.get(async (req, res, next) =>
				getEventsController(req, res, next, this.eventRepo)
			);
		this.router
			.route("/:eid")
			.get(async (req, res, next) =>
				getEventByIdController(req, res, next, this.eventRepo)
			);
		this.router
			.route("/:eid")
			.put(async (req, res, next) =>
				updateEventController(req, res, next, this.eventRepo)
			);
		this.router
			.route("/:eid")
			.delete(async (req, res, next) =>
				deleteEventController(req, res, next, this.eventRepo)
			);

		//-----------------------------------Additional event related routes-----------------------------------------

		this.router
			.route("/myevents/:uid")
			.get(async (req, res, next) =>
				getMyEventsController(req, res, next, this.eventRepo)
			);

		// my events sort
		this.router
			.route("/myevents/sort")
			.post(protect, async (req, res, next) =>
				sortMyEventsController(req, res, next, this.eventRepo)
			);

		// attending sort
		this.router
			.route("/attendingevents/sort")
			.post(protect, async (req, res, next) =>
				sortAttendedEventController(req, res, next, this.eventRepo)
			);

		this.router
			.route("/filter")
			.post(protect, async (req, res, next) =>
				filterEventsController(req, res, next, this.eventRepo)
			);

		this.router
			.route("/sort")
			.post(async (req, res, next) =>
				sortEventController(req, res, next, this.eventRepo)
			);

		this.router
			.route("/:eid/join")
			.post(async (req, res, next) =>
				getAttendingEventsController(req, res, next, this.eventRepo)
			);

		this.router
			.route("/:eid/image/dummy")
			.get(async (req, res, next) => res.render("upload_image"));

		this.router
			.route("/:eid/participants")
			.get(async (req, res, next) =>
				seeEventParticipantsController(req, res, next, this.eventRepo)
			);

		this.router.route("/:eid/chats").get(async (req, res, next) => {
			const eid = req.params.eid;
			console.log(eid);
			console.log("reached here");
			getChatsController(req, res, next, this.eventRepo);
		});
		return this.router;
	}
}

export default EventRoute;
