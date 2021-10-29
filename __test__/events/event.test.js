import supertest from "supertest";
import faker from "faker";
import AppManager from "../../container/AppManager.js";
import sinon from "sinon";
import userRepoMock from "../__mocks__/UserRepo.mock.js";
import { beforeAll, afterAll } from "@jest/globals";
import UserRepo from "../../mvc/database/UserRepo.js";

let am = AppManager();
const app = am.App;
const request = supertest(app);

describe("Tests all CRUD functions for EVENT Service ", () => {
	let db, dummyEvent1, dummyEvent2, attendingEvent, createdEvent;

	beforeAll(() => {
		db = am.EventRepo;
		dummyEvent1 = {
			eid: 1,
			name: "National Pan-Hellenic Council Week: Field Game Day",
			hostname: "Greek Affairs",
			eventtype: null,
			location: "Patriot Plaza",
			starttime: "2021-10-20T22:00:00+00:00",
			endtime: "2021-10-21T01:00:00+00:00",
			description:
				'The National Pan-Hellenic Council is the organization that united the nine\nhistorically African American fraternities and sororities commonly known as the\n"Divine Nine". This event will give students the opportunity to network with\nmembers of NPHC organizations in a lightly competitive atmosphere. Food will be\nprovided to participants. ',
			contactnumber: null,
			imageurl:
				"https://uttyler.campuslabs.com/engage/image/7dc46c8b-0eb8-4b48-ba1a-6a841efd2115d59768c5-58c7-4541-a9e2-c42da539c7e3.png",
			cid: null,
			created_at: "2021-10-21T21:35:07.626Z",
			updated_at: "2021-10-21T21:35:07.626Z",
		};
		dummyEvent2 = {
			eid: 2,
			name: "Pan-Hellenic Council Week: Field Game Day",
			hostname: "Greek Affairs",
			eventtype: null,
			location: "Patriot Plaza",
			starttime: "2021-10-20T22:00:00+00:00",
			endtime: "2021-10-21T01:00:00+00:00",
			description:
				'The National Pan-Hellenic Council is the organization that united the nine\nhistorically African American fraternities and sororities commonly known as the\n"Divine Nine". This event will give students the opportunity to network with\nmembers of NPHC organizations in a lightly competitive atmosphere. Food will be\nprovided to participants. ',
			contactnumber: null,
			imageurl:
				"https://uttyler.campuslabs.com/engage/image/7dc46c8b-0eb8-4b48-ba1a-6a841efd2115d59768c5-58c7-4541-a9e2-c42da539c7e3.png",
			cid: null,
			created_at: "2021-10-21T21:35:07.626Z",
			updated_at: "2021-10-21T21:35:07.626Z",
		};

		createdEvent = {
			eid: 1,
			uid: 1,
			accessrole: "HOST",
			name: "National Pan-Hellenic Council Week: Field Game Day",
			hostname: "Greek Affairs",
			eventtype: null,
			location: "Patriot Plaza",
			starttime: "2021-10-20T22:00:00+00:00",
			endtime: "2021-10-21T01:00:00+00:00",
			description:
				'The National Pan-Hellenic Council is the organization that united the nine\nhistorically African American fraternities and sororities commonly known as the\n"Divine Nine". This event will give students the opportunity to network with\nmembers of NPHC organizations in a lightly competitive atmosphere. Food will be\nprovided to participants. ',
			contactnumber: null,
			imageurl:
				"https://uttyler.campuslabs.com/engage/image/7dc46c8b-0eb8-4b48-ba1a-6a841efd2115d59768c5-58c7-4541-a9e2-c42da539c7e3.png",
			cid: null,
			created_at: "2021-10-21T21:35:07.626Z",
			updated_at: "2021-10-21T21:35:07.626Z",
		};

		attendingEvent = {
			eid: 2,
			uid: 1,
			accessrole: "READ",
			name: "National Pan-Hellenic Council Week: Field Game Day",
			hostname: "Greek Affairs",
			eventtype: null,
			location: "Patriot Plaza",
			starttime: "2021-10-20T22:00:00+00:00",
			endtime: "2021-10-21T01:00:00+00:00",
			description:
				'The National Pan-Hellenic Council is the organization that united the nine\nhistorically African American fraternities and sororities commonly known as the\n"Divine Nine". This event will give students the opportunity to network with\nmembers of NPHC organizations in a lightly competitive atmosphere. Food will be\nprovided to participants. ',
			contactnumber: null,
			imageurl:
				"https://uttyler.campuslabs.com/engage/image/7dc46c8b-0eb8-4b48-ba1a-6a841efd2115d59768c5-58c7-4541-a9e2-c42da539c7e3.png",
			cid: null,
			created_at: "2021-10-21T21:35:07.626Z",
			updated_at: "2021-10-21T21:35:07.626Z",
		};
	});

	afterAll(() => {
		db = null;
		dummyEvent1 = null;
		createdEvent = null;
		attendingEvent = null;
	});

	//------------------------------------------------POST---------------------------------------
	it("POST /api/events -> create a new event without event name and host name", async () => {
		// const hostname = faker.company.catchPhrase();
		// const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({})
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> create a new event without host name - 400", async () => {
		// const hostname = faker.company.catchPhrase();
		const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({ name })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> create a new event without event name -400", async () => {
		const hostname = faker.company.catchPhrase();
		// const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({ hostname })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> event occured while creating event in db -500", async () => {
		var repoStub = sinon
			.stub(db, "createEvent")
			.callsFake(() => Promise.resolve(mull));
		const hostname = faker.company.catchPhrase();
		const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({ hostname, name })
			.expect("Content-Type", /json/)
			.expect(500);

		repoStub.restore();
	});

	it("POST /api/events -> create a new event", async () => {
		var repoStub = sinon
			.stub(db, "createEvent")
			.callsFake(() => Promise.resolve(dummyEvent1));
		const hostname = faker.company.catchPhrase();
		const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({ hostname, name })
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[0]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: expect.any(String),
					eid: expect.any(Number),
				})
			);
		}

		repoStub.restore();
	});

	it("GET /api/events -> if list is empty, 404 ", async () => {
		var repoStub = sinon
			.stub(db, "getEvents")
			.callsFake(() => Promise.resolve([]));
		const response = await request
			.get("/api/events/")
			.expect("Content-Type", /json/)
			.expect(404);

		repoStub.restore();
	});

	it("GET /api/events -> get list of valid events ", async () => {
		var repoStub = sinon
			.stub(db, "getEvents")
			.callsFake(() => Promise.resolve([dummyEvent1]));
		const response = await request
			.get("/api/events/")
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[0]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: expect.any(String),
					eid: expect.any(Number),
				})
			);
		}
		repoStub.restore();
	});

	it("GET api/events/myevents/:uid -> get list of user created events ", async () => {
		var repoStub = sinon
			.stub(db, "getMyEvents")
			.callsFake(() => Promise.resolve([createdEvent]));
		const response = await request
			.get("/api/events/myevents/1")
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[0]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					uid: 1,
					hostname: "Greek Affairs",
					accessrole: "HOST",
					eid: expect.any(Number),
				})
			);
		}
		repoStub.restore();
	});

	it("GET api/events/attendingevents/:uid -> get list of user attending events ", async () => {
		var repoStub = sinon
			.stub(db, "getAttendingEvents")
			.callsFake(() => Promise.resolve([attendingEvent]));
		const response = await request
			.get("/api/events/attendingevents/1")
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[0]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: "Greek Affairs",
					uid: 1,
					accessrole: "READ",
					eid: expect.any(Number),
				})
			);
		}
		repoStub.restore();
	});

	it("POST api/events/filter -> when filter value is not provided - 400", async () => {
		await request
			.post("/api/events/filter ")
			.send({ value: "" })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST api/events/filter -> when we cannot find any event", async () => {
		var repoStub = sinon
			.stub(db, "filterEvents")
			.callsFake(() => Promise.resolve([]));
		const response = await request
			.post("/api/events/filter ")
			.send({ value: "dummy" })
			.expect("Content-Type", /json/)
			.expect(200);

		expect(response.body.length).toEqual(0);

		repoStub.restore();
	});

	it("POST api/events/filter -> filter list of events by user provided value", async () => {
		var repoStub = sinon
			.stub(db, "filterEvents")
			.callsFake(() => Promise.resolve([dummyEvent1]));
		const response = await request
			.post("/api/events/filter ")
			.send({ value: "dummy" })
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[0]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: "Greek Affairs",
					eid: expect.any(Number),
				})
			);
		}
		repoStub.restore();
	});

	it("POST api/events/sort -> sort list of events by user provided value", async () => {
		var repoStub = sinon
			.stub(db, "sortEvents")
			.callsFake(() => Promise.resolve([dummyEvent2, dummyEvent1]));

		const response = await request
			.post("/api/events/sort")
			.send({ sort: "name", order: "asc" })
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body[1]).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: "Greek Affairs",
					eid: expect.any(Number),
				})
			);
		}
		repoStub.restore();
	});
});
