import { EventAccessRoles } from "../../utilities/types/EventAccessRoles.js";
import { tables } from "../../utilities/types/Tables.js";

// Manages all the user related database operations
class EventRepo {
	constructor(dbConnection) {
		this.dbConnection = dbConnection;
	}

	// checks whether event exists in the events relation or not
	async checkEvent(name, hostname, starttime, endtime) {
		const event = await this.dbConnection(tables.EVENTS)
			.where({ name, hostname, starttime, endtime })
			.first();
		return event;
	}

	// gets required event from the db using eid
	async checkEventbyId(eid) {
		const events = await this.dbConnection(tables.EVENTS)
			.where({ eid: eid })
			.select();
		return events.length > 0;
	}

	// gets required event from the db using eid
	async getEventbyId(eid) {
		// const event = await this.dbConnection.raw(
		// 	`SELECT * FROM ${tables.EVENTS} WHERE eid = ${eid} LIMIT)`
		// );
		// const event = await this.dbConnection(tables.EVENTS)
		// 	.where({ eid: eid })
		// 	.first();

		const event = await this.dbConnection(tables.EVENTS)
			.select(
				`*`,
				this.dbConnection(tables.PARTICIPANTS)
					.count("*")
					.whereRaw("?? = ??", [
						`${tables.EVENTS}.eid`,
						`${tables.PARTICIPANTS}.eid`,
					])
					.as("participants")
			)
			.where({ eid: eid });
		return event;
	}

	// gets events from the db
	async getEvents() {
		const event = await this.dbConnection(tables.EVENTS).select(
			`*`,
			this.dbConnection(tables.PARTICIPANTS)
				.count("*")
				.whereRaw("?? = ??", [
					`${tables.EVENTS}.eid`,
					`${tables.PARTICIPANTS}.eid`,
				])
				.as("participants")
		);
		return event;
	}

	// gets unattended events by the user
	async getUnAttendedEvents(uid) {
		// const events = await this.dbConnection.raw(
		// 	`SELECT * FROM ${tables.EVENTS} WHERE eid NOT IN (SELECT eid FROM ${tables.PARTICIPANTS} WHERE ${tables.PARTICIPANTS}.uid = ${uid})`
		// );

		const events = await this.dbConnection.raw(
			`SELECT *,(SELECT COUNT(*) from ${tables.PARTICIPANTS} where ${tables.PARTICIPANTS}.eid=${tables.EVENTS}.eid) as participants FROM ${tables.EVENTS} WHERE eid NOT IN (SELECT eid FROM ${tables.PARTICIPANTS} WHERE ${tables.PARTICIPANTS}.uid = ${uid})`
		);

		if (events.rows) {
			return events.rows;
		} else {
			return events;
		}
	}

	async createEvent(eventInfo) {
		const event = await this.dbConnection(tables.EVENTS)
			.insert(eventInfo)
			.returning("*");
		return event[0];
	}

	// updates required event from the db
	async updateEvent(eid, eventInfo) {
		const event = await this.dbConnection(tables.EVENTS)
			.where({ eid })
			.update(eventInfo)
			.returning("*");
		return event[0];
	}

	// deletes the event in the db
	async deleteUser(eid) {
		const event = await this.dbConnection(tables.EVENTS)
			.where({ eid: eid })
			.del();
		return event;
	}

	// determines whether user has already joined the event or not
	async checkEventParticipant(uid) {
		const events = await this.dbConnection(tables.PARTICIPANTS)
			.where({ uid: uid })
			.select();
		return events.length > 0;
	}

	// adds user to the event participants table
	async joinEvent(uid, eid, accessRole) {
		const event = await this.dbConnection(tables.PARTICIPANTS)
			.insert({ eid: eid, uid: uid, accessrole: accessRole })
			.returning("*");
		return event;
	}

	// fetches all the event participants
	async seeEventParticipants(eid) {
		const event = await this.dbConnection(tables.PARTICIPANTS)
			.join(
				tables.USERS,
				`${tables.USERS}.uid`,
				`${tables.PARTICIPANTS}.uid`
			)
			.select(
				`${tables.USERS}.firstname`,
				`${tables.USERS}.lastname`,
				`${tables.PARTICIPANTS}.accessrole`
			)
			.where({ eid: eid });
		return event;
	}

	// fetches all the user created events
	async getMyEvents(uid) {
		const events = await this.dbConnection(tables.PARTICIPANTS)
			.join(
				tables.EVENTS,
				`${tables.EVENTS}.eid`,
				`${tables.PARTICIPANTS}.eid`
			)
			.select(
				`*`,
				this.dbConnection(tables.PARTICIPANTS)
					.count("*")
					.whereRaw("?? = ??", [
						`${tables.EVENTS}.eid`,
						`${tables.PARTICIPANTS}.eid`,
					])
					.as("participants")
			)
			.where({ uid: uid, accessrole: EventAccessRoles.HOST });
		return events;
	}

	// fetches all the events attended by user
	async getAttendingEvents(uid) {
		const events = await this.dbConnection(tables.PARTICIPANTS)
			.join(
				tables.EVENTS,
				`${tables.EVENTS}.eid`,
				`${tables.PARTICIPANTS}.eid`
			)
			.select(
				`*`,
				this.dbConnection(tables.PARTICIPANTS)
					.count("*")
					.whereRaw("?? = ??", [
						`${tables.EVENTS}.eid`,
						`${tables.PARTICIPANTS}.eid`,
					])
					.as("participants")
			)

			.where({ uid: uid, accessrole: EventAccessRoles.READ });
		return events;
	}

	async filterEvents(value) {
		const events = await this.dbConnection(tables.EVENTS)
			.where("name", "like", `%${value}%`)
			.orWhere("location", "like", `%${value}%`)
			.orWhere("hostname", "like", `%${value}%`);
		return events;
	}

	async sortEvents(sort, order) {
		const events = await this.dbConnection(tables.EVENTS).orderBy(
			sort,
			order
		);
		return events;
	}

	async sortUnattendedEvents(uid, sort, order) {
		const events = await this.dbConnection(tables.EVENTS)
			.orderBy(sort, order)
			.where(uid != uid);
		return events;
	}

	async sortAttendedEvents(uid, sort, order) {
		const events = await this.dbConnection(tables.EVENTS)
			.orderBy(sort, order)
			.where((uid = uid));
		return events;
	}

	async sortMyEvents(uid, sort, order) {
		const events = await this.dbConnection(tables.PARTICIPANTS)
			.join(
				tables.EVENTS,
				`${tables.EVENTS}.eid`,
				`${tables.PARTICIPANTS}.eid`
			)
			.select()
			.orderBy(sort, order)
			.where({ uid: uid, accessrole: EventAccessRoles.HOST });
		return events;
	}

	// fetches recent 20 messages by event id
	async getChatMessages(eid) {
		const chats = await this.dbConnection(tables.MESSAGE)
			.where({ eid })
			.limit(10);
		return chats;
	}
}

export default EventRepo;
