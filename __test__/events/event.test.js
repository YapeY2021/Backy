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
	let db, dummyEvent1, dummyEvent2, attendingEvents, myEvents, TOKEN;

	beforeAll(() => {
		TOKEN =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQsImVtYWlsIjoiQ0d1bGdvd3NraUBwYXRyaW90cy51dHR5bGVyLmVkdSIsImlhdCI6MTYzNzM1NjcxNiwiZXhwIjoxNjQyNTQwNzE2fQ.tiNugJY8MVt_ewi28uQ1iF-3zuv0LVra3lLBofJdVlY";
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

		myEvents = {
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

		attendingEvents = {
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
		myEvents = null;
		attendingEvents = null;
	});

	//------------------------------------------------POST---------------------------------------
	// it("POST /api/events -> create a new event without valid token", async () => {
	// 	const TOKEN = "";
	// 	await request
	// 		.post("/api/events/")
	// 		.send({})
	// 		.expect("Content-Type", /json/)
	// 		.expect(401);
	// });

	it("POST /api/events -> create a new event without event name and host name", async () => {
		await request
			.post("/api/events/")
			.send({})
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> create a new event without host name - 400", async () => {
		const name = faker.commerce.productName();
		await request
			.post("/api/events/")
			.send({ name })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> create a new event without event name -400", async () => {
		const hostname = faker.company.catchPhrase();
		await request
			.post("/api/events/")
			.send({ hostname })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events -> event occured while creating event in db -500", async () => {
		var repoStub = sinon
			.stub(db, "createEvent")
			.callsFake(() => Promise.resolve(null));
		const hostname = faker.company.catchPhrase();
		const name = faker.commerce.productName();
		await request
			.post("/api/events/")
			.send({ hostname, name })
			.expect("Content-Type", /json/)
			.expect(500);

		repoStub.restore();
	});

	it("POST /api/events -> create a new event", async () => {
		const hostname = faker.company.catchPhrase();
		const name = faker.commerce.productName();
		const response = await request
			.post("/api/events/")
			.send({ hostname, name })
			.expect("Content-Type", /json/)
			.expect(200);
		if (response.body && response.body.length > 0) {
			expect(response.body).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					hostname: expect.any(String),
					eid: expect.any(Number),
				})
			);
		}
	});

	//----------------------join event feature-----------------------------
	it("POST /api/events/:uid/join -> join event with no eid", async () => {
		const eid = 1;
		const uid = 1;
		await request
			.post(`/api/events/${eid}/join`)
			.send({ uid })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events/:uid/join -> join event with no uid", async () => {
		const eid = 1;
		await request
			.post(`/api/events/${eid}/join`)
			.send({ eid })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events/:uid/join -> join event with no uid and eid", async () => {
		const eid = 1;
		const uid = 1;
		await request
			.post(`/api/events/${eid}/join`)
			.send({})
			.expect("Content-Type", /json/)
			.expect(400);
	});

	it("POST /api/events/:uid/join -> join new valid email", async () => {
		const eid = 16;
		const uid = 1;
		const response = await request
			.post(`/api/events/${eid}/join`)
			.send({ eid, uid })
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				eid: expect.any(Number),
				uid: expect.any(Number),
				accessrole: expect.any(String),
			})
		);
	});

	it("POST /api/events/:uid/join -> already joined event", async () => {
		const eid = 17;
		const uid = 1;
		const response = await request
			.post(`/api/events/${eid}/join`)
			.send({ eid, uid })
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				eid: expect.any(Number),
				uid: expect.any(Number),
				accessrole: expect.any(String),
			})
		);
		await request
			.post(`/api/events/${eid}/join`)
			.send({ uid, eid })
			.expect("Content-Type", /json/)
			.expect(400);
	});

	//------------------------------------------------GET----------------------------------------
	// it("GET /myevents/:uid -> create a new event without valid token", async () => {
	// 	const TOKEN = "";
	// 	await request
	// 		.get("/api/events/myevents/1")
	// 		.expect("Content-Type", /json/)
	// 		.expect(401);
	// });

	it("GET /api/events -> if list is empty, 404 ", async () => {
		var repoStub = sinon
			.stub(db, "getEvents")
			.callsFake(() => Promise.resolve([]));
		await request
			.get("/api/events/")
			.expect("Content-Type", /json/)
			.expect(404);

		repoStub.restore();
	});

	// -----------------------------------------------------GET---------------------------------------------------------
	it("GET /api/events -> get list of valid events ", async () => {
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
	});

	it("GET /api/events/:id -> event does not exist 404 ", async () => {
		const eid = -1;
		await request
			.get(`/api/events/${eid}`)
			.expect("Content-Type", /json/)
			.expect(404);
	});

	it("GET /api/events/:id -> event exists 200 ", async () => {
		const response = await request
			.get("/api/events/1")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				name: expect.any(String),
				hostname: expect.any(String),
				eid: expect.any(Number),
			})
		);
	});

	//--------UPDATE
	// it("PUT /api/events/:id -> update event that does not exist - 404", async () => {
	// 	const name = faker.commerce.productName();
	// 	var repoStub = sinon
	// 		.stub(db, "checkEventbyId")
	// 		.callsFake(() => Promise.resolve(false));
	// 	await request
	// 		.put("/api/events/-1")
	// 		.send({ name })
	// 		.expect("Content-Type", /json/)
	// 		.expect(404);
	// 	repoStub.restore();
	// });

	// it("PUT /api/events/:id -> update event that does exist- 200", async () => {
	// 	const name = faker.commerce.productName();
	// 	var repoStub = sinon
	// 		.stub(db, "checkEventbyId")
	// 		.callsFake(() => Promise.resolve(true));

	// 	var repoStub2 = sinon
	// 		.stub(db, "updateEvent")
	// 		.callsFake(() => Promise.resolve(dummyEvent2));
	// 	await request
	// 		.put("/api/events/1")
	// 		.send({ name })
	// 		.expect("Content-Type", /json/)
	// 		.expect(200);
	// 	repoStub.restore();
	// 	repoStub2.restore();
	// });

	// ---- delete
	it("DELETE /api/events/:id -> delete event that does not exist - 404", async () => {
		const name = faker.commerce.productName();
		var repoStub = sinon
			.stub(db, "checkEventbyId")
			.callsFake(() => Promise.resolve(false));
		await request
			.delete("/api/events/-1")
			.expect("Content-Type", /json/)
			.expect(404);
		repoStub.restore();
	});

	it("DELETE /api/events/:id -> delete event that does exist - 200", async () => {
		const name = faker.commerce.productName();
		var repoStub = sinon
			.stub(db, "checkEventbyId")
			.callsFake(() => Promise.resolve(true));
		var repoStub2 = sinon
			.stub(db, "deleteUser")
			.callsFake(() => Promise.resolve(true));
		await request
			.delete("/api/events/1")
			.expect("Content-Type", /json/)
			.expect(200);
		repoStub2.restore();
		repoStub.restore();
	});
});
