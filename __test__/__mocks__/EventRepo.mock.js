class EventRepoMock {
	constructor() {}

	async getEvents() {}

	async createEvent(eventInfo) {}

	async getMyEvents(uid) {}

	async getAttendingEvents(uid) {}

	async filterEvents(value) {}

	async sortEvents(sort, order) {}

	async getUnAttendedEvents(uid) {}
}

export default EventRepoMock;
