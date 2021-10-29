class EventRepoMock {
	constructor() {}

	async getEvents() {}

	async createEvent(eventInfo) {}

	async getMyEvents(uid) {}

	async getAttendingEvents(uid) {}

	async filterEvents(value) {}
}

export default EventRepoMock;
