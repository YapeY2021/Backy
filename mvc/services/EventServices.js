import {
	fStorage,
	uploadBytesResumable,
	ref,
	getDownloadURL,
} from "../../firebase/firebase.js";
import {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} from "../../utilities/types/Errors.js";
import { EventAccessRoles } from "../../utilities/types/EventAccessRoles.js";

export const createEventService = async (eventInfo, eventRepo, uid) => {
	if (!eventInfo.name) {
		throw new BadRequestError("Event name missing");
	}

	if (!eventInfo.hostname) {
		throw new BadRequestError("Host name missing");
	}

	if (!uid) {
		throw new NotFoundError("User ID Missing");
	}

	const createdEvent = await eventRepo.createEvent(eventInfo);

	await eventRepo.joinEvent(uid, createdEvent.eid, EventAccessRoles.HOST);

	if (createdEvent) {
		return createdEvent;
	} else {
		throw new InternalServerError(
			"Something went wrong while creating the event"
		);
	}
};

// @desc    Get a list of events from the db
// @input: nothing
// @return: list of events
export const getEventsService = async (eventRepo) => {
	const responseData = await eventRepo.getEvents();
	if (responseData.length > 0) {
		return responseData;
	} else {
		throw new NotFoundError("No Events found");
	}
};

// @desc    Get a event by id from the db
// @input:  Event id - eid
// @return: return user in the db matching the unique user id
export const getEventByIdService = async (eid, eventRepo) => {
	if (!eid) {
		throw new BadRequestError("Invalid Event ID");
	}
	const event = await eventRepo.getEventbyId(eid);
	//if event does not exists
	if (!event) {
		throw new NotFoundError("Event does not exist.");
	}
	return event;
};

export const updateEventService = async (eid, eventInfo, eventRepo) => {
	// checks whether the event exists in the database
	console.log("reached here");
	const eventExists = await eventRepo.checkEventbyId(eid);
	console.log(eventExists);
	//if event does not exists
	if (!eventExists) {
		throw new NotFoundError("Event does not exist.");
	}

	const responseData = await eventRepo.updateEvent(eid, eventInfo);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while updating the event from the database"
		);
	}
};

// @description: delete the event from the db
// @input: eid - event id
// @return: response object
export const deleteEventService = async (eid, eventRepo) => {
	if (!eid) {
		throw new BadRequestError("Invalid Event ID");
	}

	// checks whether the event exists in the database
	const eventExists = await eventRepo.checkEventbyId(eid);

	//if event does not exists
	if (!eventExists) {
		throw new NotFoundError("Event does not exist.");
	}
	// deletes user from the db
	const responseData = await eventRepo.deleteUser(eid);

	if (responseData) {
		return `Successfully deleted event ${eid}`;
	} else {
		throw new InternalServerError(
			"Something went wrong while deleting the event in the database"
		);
	}
};

export const jointEventService = async (uid, eid, accessRole, eventRepo) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	if (!eid) {
		throw new BadRequestError("Event ID Missing");
	}

	const participantExists = await eventRepo.checkEventParticipant(uid, eid);

	if (participantExists) {
		throw new BadRequestError("Already joined the event");
	}

	const responseData = await eventRepo.joinEvent(uid, eid, accessRole);
	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while joining event"
		);
	}
};

export const getMyEventsService = async (uid, eventRepo) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	const responseData = await eventRepo.getMyEvents(uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const getUnAttendedEventsService = async (uid, eventRepo) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}

	console.log(uid);
	const responseData = await eventRepo.getUnAttendedEvents(uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const getAttendingEventsService = async (uid, eventRepo) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}

	const responseData = await eventRepo.getAttendingEvents(uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const filterAttendingEventsService = async (value, uid, eventRepo) => {
	if (!value) {
		throw new BadRequestError("No value provided to filter events.");
	}

	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}

	const responseData = await eventRepo.filterAttendingEvents(value, uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const filterUnAttendedEventsService = async (value, uid, eventRepo) => {
	if (!value) {
		throw new BadRequestError("No value provided to filter events.");
	}

	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}

	const responseData = await eventRepo.filterUnAttendedEvents(value, uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const filterMyEventsService = async (value, uid, eventRepo) => {
	if (!value) {
		throw new BadRequestError("No value provided to filter events.");
	}

	const responseData = await eventRepo.filterMyEvents(value, uid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

// sort events based on the value provided by the user
export const sortEventService = async (
	uid,
	sort = EVENTSORT.NAME,
	order = SORTORDER.ASC,
	eventRepo
) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	if (!sort) {
		throw new BadRequestError("Sort Missing");
	}
	if (!order) {
		throw new BadRequestError("Order Missing");
	}
	const responseData = await eventRepo.sortEvents(uid, sort, order);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const sortUnattendedEventService = async (
	uid,
	sort = EVENTSORT.NAME,
	order = SORTORDER.ASC,
	eventRepo
) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	if (!sort) {
		throw new BadRequestError("Sort Missing");
	}
	if (!order) {
		throw new BadRequestError("Order Missing");
	}
	const responseData = await eventRepo.sortUnattendedEvents(uid, sort, order);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const sortAttendedEventService = async (
	uid,
	sort = EVENTSORT.NAME,
	order = SORTORDER.ASC,
	eventRepo
) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	if (!sort) {
		throw new BadRequestError("Sort Missing");
	}
	if (!order) {
		throw new BadRequestError("Order Missing");
	}
	const responseData = await eventRepo.sortAttendedEvents(uid, sort, order);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const sortMyEventsService = async (
	sort = EVENTSORT.NAME,
	order = SORTORDER.ASC,
	eventRepo
) => {
	if (!uid) {
		throw new BadRequestError("User ID Missing");
	}
	if (!sort) {
		throw new BadRequestError("Sort Missing");
	}
	if (!order) {
		throw new BadRequestError("Order Missing");
	}

	const responseData = await eventRepo.sortMyEvents(uid, sort, order);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching events."
		);
	}
};

export const seeEventParticipantsService = async (eid, eventRepo) => {
	if (!eid) {
		throw new BadRequestError("Event ID Missing");
	}
	const responseData = await eventRepo.seeEventParticipants(eid);

	if (responseData) {
		return responseData;
	} else {
		throw new InternalServerError(
			"Something went wrong while fetching event participants"
		);
	}
};

// fetches all the messages of the event from db
export const getChatMessagesService = async (eid, eventRepo) => {
	if (!eid) {
		throw new BadRequestError("No event id found. Please try again.");
	}

	const response = await eventRepo.getChatMessages(eid);
	if (response) {
		return response;
	}

	throw new NotFoundError("No chat history found.");
};

export const uploadEventImageFirebaseService = async (
	eid,
	eventRepo,
	imageFile
) => {
	if (!eid) {
		throw new BadRequestError("No event id found. Please try again.");
	}
	const imagePathRef = ref(fStorage, `events/${eid}.jpeg`);

	await uploadBytesResumable(imagePathRef, imageFile.data);
	const imageurl = await getDownloadURL(imagePathRef);
	const response = await eventRepo.updateEvent(eid, { imageurl });
	if (response) {
		return response;
	} else {
		throw new InternalServerError("Failed to upload image.");
	}
};
