import { tables } from "../../utilities/types/Tables.js";

class MessageRepo {
	constructor(dbConnection) {
		this.dbConnection = dbConnection;
	}
	// create chat object in the chats relation
	async addMessage(eid, uid, text) {
		const newChat = await this.dbConnection(tables.MESSAGE)
			.insert({ eid, uid, text })
			.returning("*");
		return newChat[0];
	}
	async getlast30messages(eid) {
		const lastChats = await this.dbConnection.raw(
			`SELECT * FROM ${tables.MESSAGE} WHERE eid=${eid} LIMIT 30`
		);
		return lastChats;
	}
}

export default MessageRepo;
