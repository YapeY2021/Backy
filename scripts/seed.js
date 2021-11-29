import chalk from "chalk";
import { EventAccessRoles } from "../utilities/types/EventAccessRoles.js";
import { tables } from "../utilities/types/Tables.js";

export const Seed = async (dbConnection) => {
	try {
		await dbConnection(tables.USERS).insert({
			firstname: "John",
			lastname: "Doe",
			email: "jdoe1@patriots.uttyler.edu",
			password: "password",
		});
		await dbConnection(tables.USERS).insert({
			firstname: "John",
			lastname: "Doe",
			email: "jdoe2@patriots.uttyler.edu",
			password: "password",
		});
		await dbConnection(tables.USERS).insert({
			firstname: "John Jr.",
			lastname: "Doe",
			email: "jdoe2@patriots.uttyler.edu",
			password: "password",
		});

		await dbConnection(tables.USERS).insert({
			firstname: "John Jr.",
			lastname: "Doe",
			email: "sidoho3089@d3bb.com",
			password: "password",
		});

		// -----------------------------------------EVENTS------------------------------------
		await dbConnection(tables.EVENTS).insert({
			name: "event2",
			hostname: "1",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "event5",
			hostname: "1",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "event3",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "event1",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "event4",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "event6",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "Aavash birthday party",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "Graduation party",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		await dbConnection(tables.EVENTS).insert({
			name: "Graduation party",
			hostname: "John Jr. Doe",
			imageurl:
				"https://pixabay.com/photos/crowd-dance-party-people-1056764/",
		});

		// -----------------------------------------PARTICIPANTS------------------------------------
		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "1",
			eid: "1",
			accessrole: "HOST",
		});
		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "1",
			eid: "2",
			accessrole: "HOST",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "1",
			eid: "3",
			accessrole: "READ",
		});
		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "1",
			eid: "4",
			accessrole: "READ",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "2",
			eid: "1",
			accessrole: "HOST",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "3",
			eid: "2",
			accessrole: "HOST",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "3",
			eid: "3",
			accessrole: "HOST",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "2",
			eid: "3",
			accessrole: "READ",
		});

		await dbConnection(tables.PARTICIPANTS).insert({
			uid: "3",
			eid: "4",
			accessrole: "READ",
		});

		console.log(
			chalk.green.bold(
				"------------------------Dummy Seeder Data Added-------------------------------"
			)
		);
	} catch (err) {
		console.log(err);
	}
};
