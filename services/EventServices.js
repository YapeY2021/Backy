import db from "../db/db.js";
import DBChat from "../db/dbChat.js";
import DBEvent from "../db/dbEvent.js";
import DBEventChatRelation from "../db/dbEventChatRelation.js";
import DBEventParticipant from "../db/dbParticipants.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../types/Errors.js";

export const createEventService = async (
  name,
  hostname,
  eventtype,
  location,
  starttime,
  endtime,
  description,
  contactnumber,
  imageurl
) => {
  if (!name) {
    throw new BadRequestError("Event name missing");
  }

  if (!hostname) {
    throw new BadRequestError("Host name missing");
  }

  let cid;
  try {
    cid = await DBChat.createChat();
  } catch (e) {
    console.log(e);
    throw new InternalServerError(
      "Something went wrong while creating the chat"
    );
  }

  const event = {
    name,
    hostname,
    eventtype,
    location,
    starttime,
    endtime,
    description,
    contactnumber,
    imageurl,
    cid,
  };

  const createdEvent = await DBEvent.createEvent(event);
  if (createdEvent && createdEvent.eid && cid) {
    await DBEventChatRelation.addChat(createdEvent.eid, cid);
  }

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
export const getEventsService = async () => {
  const responseData = await DBEvent.getEvents();
  if (responseData) {
    if (responseData.length > 0) {
      return responseData;
    } else {
      throw new NotFoundError("No events found!");
    }
  } else {
    throw new InternalServerError(
      "Something went wrong while fetching the events from the db"
    );
  }
};

// @desc    Get a event by id from the db
// @input:  Event id - eid
// @return: return user in the db matching the unique user id
export const getEventByIdService = async (eid) => {
  if (!eid) {
    throw new BadRequestError("Invalid Event ID");
  }
  const event = await DBEvent.getEvent(eid);

  //if event does not exists
  if (!event) {
    throw new NotFoundError("Event does not exist.");
  }
  return event;
};

export const updateEventService = async (
  eventname,
  eventtype,
  location,
  startdate,
  enddate,
  description,
  contactnumber,
  host,
  eid
) => {
  // checks whether the event exists in the database
  const eventExists = await DBEvent.getEvent(eid);

  //if event does not exists
  if (!eventExists.length > 0) {
    throw new NotFoundError("Event does not exist.");
  }

  const responseData = await DBEvent.updateEvent(
    eventname,
    eventtype,
    location,
    startdate,
    enddate,
    description,
    contactnumber,
    host,
    eid
  );
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
export const deleteEvent = async (eid) => {};

export const jointEventService = async (uid, eid, accessRole) => {
  if (!uid) {
    throw new BadRequestError("User ID Missing");
  }
  if (!eid) {
    throw new BadRequestError("Event ID Missing");
  }
  const responseData = await DBEventParticipant.joinEvent(uid, eid, accessRole);

  if (responseData) {
    return responseData;
  } else {
    throw new InternalServerError("Something went wrong while joining event");
  }
};

export const seeEventParticipantsService = async (eid) => {
  if (!eid) {
    throw new BadRequestError("Event ID Missing");
  }
  const responseData = await DBEventParticipant.seeEventParticipants(eid);

  if (responseData) {
    return responseData;
  } else {
    throw new InternalServerError(
      "Something went wrong while fetching event participants"
    );
  }
};
