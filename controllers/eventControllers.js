import express from "express";
import asyncHandler from "express-async-handler";
import {
  createEventService,
  updateEventService,
} from "../services/EventServices.js";
import { BadRequestError, NotAuthorizedError } from "../types/Errors.js";

export const createEventController = asyncHandler(async (req, res) => {
  const { name, description, location, phone, startDate, endDate, host, type } =
    req.body;
  //Event name missing added
  if (!name) {
    throw new BadRequestError("Event Name Missing");
  }

  const responseData = await createEventService({
    name,
    description,
    location,
    phone,
    startDate,
    endDate,
    host,
    type,
  });

  res.status(201).json(responseData);
});

// @desc    Get a list of events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const responseData = await getEventsService();
  res.status(200).json({ responseData });
});

// @desc    Get a event by id
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const uid = parseInt(req.params.id);
  const responseData = await fetEventByIdService(uid);
  res.status(200).json({ responseData });
});

export const updateEventController = asyncHandler(async (req, res) => {
  const uid = parseInt(req.params.uid);
  const { name, description, location, phone, startDate, endDate, host, type } =
    req.body;
  //Event name missing added
  if (!name) {
    throw new BadRequestError("Event Name Missing");
  }

  const responseData = await updateEventService(
    name,
    description,
    location,
    phone,
    startDate,
    endDate,
    host,
    type,
    uid
  );

  res.status(201).json(responseData);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public
export const deleteEvent = asyncHandler(async (req, res) => {
  const uid = parseInt(req.params.id);

  // deletes user from the db
  const responseData = await deleteEventService(uid);

  // response handling
  res.status(200).json({ responseData });
});
