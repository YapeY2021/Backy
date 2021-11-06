class EventRepoMock {
	constructor() {}

	async getEvents() {}

	async createEvent(eventInfo) {}

	async getMyEvents(uid) {}

	async getAttendingEvents(uid) {}

	async filterEvents(value) {}

	async createEvent(eventInfo) {}

	async getEvents() {}

	async getEventbyId(eid) {}

	async updateEvent(eid, eventInfo) {}

	async checkEventbyId(eid) {}

	async checkEvent(name, hostname, starttime, endtime) {}

	async deleteUser(eid) {}

	async checkEventParticipant(uid) {}

	async joinEvent(uid, eid, accessRole) {}

	async seeEventParticipants(eid) {}

	async getChatMessages(eid) {}
}

export default EventRepoMock;
