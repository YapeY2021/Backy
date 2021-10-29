class EventRepoMock {
	constructor() {}

	async getEvents() {}

	async createEvent(eventInfo) {}

	async getMyEvents(uid) {}

	async getAttendingEvents(uid) {}

	async filterEvents(value) {}

	async sortEvents(sort, order) {}
}

export default EventRepoMock;
